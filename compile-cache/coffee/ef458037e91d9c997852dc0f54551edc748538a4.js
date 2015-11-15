(function() {
  var AutocompleteManager, CompositeDisposable, Disposable, Emitter, ProviderManager, Range, SuggestionList, SuggestionListElement, TextEditor, minimatch, path, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('atom'), Range = _ref.Range, TextEditor = _ref.TextEditor, CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable, Emitter = _ref.Emitter;

  _ = require('underscore-plus');

  minimatch = require('minimatch');

  path = require('path');

  ProviderManager = require('./provider-manager');

  SuggestionList = require('./suggestion-list');

  SuggestionListElement = require('./suggestion-list-element');

  module.exports = AutocompleteManager = (function() {
    var autosaveEnabled;

    autosaveEnabled = false;

    AutocompleteManager.prototype.editor = null;

    AutocompleteManager.prototype.editorView = null;

    AutocompleteManager.prototype.buffer = null;

    AutocompleteManager.prototype.providerManager = null;

    AutocompleteManager.prototype.subscriptions = null;

    AutocompleteManager.prototype.suggestionList = null;

    AutocompleteManager.prototype.editorSubscriptions = null;

    function AutocompleteManager() {
      this.bufferChanged = __bind(this.bufferChanged, this);
      this.bufferSaved = __bind(this.bufferSaved, this);
      this.cursorMoved = __bind(this.cursorMoved, this);
      this.contentsModified = __bind(this.contentsModified, this);
      this.isCurrentFileBlackListed = __bind(this.isCurrentFileBlackListed, this);
      this.replaceTextWithMatch = __bind(this.replaceTextWithMatch, this);
      this.hideSuggestionList = __bind(this.hideSuggestionList, this);
      this.confirm = __bind(this.confirm, this);
      this.prefixForCursor = __bind(this.prefixForCursor, this);
      this.showSuggestions = __bind(this.showSuggestions, this);
      this.scatterRequest = __bind(this.scatterRequest, this);
      this.runAutocompletion = __bind(this.runAutocompletion, this);
      this.handleCommands = __bind(this.handleCommands, this);
      this.handleEvents = __bind(this.handleEvents, this);
      this.updateCurrentEditor = __bind(this.updateCurrentEditor, this);
      this.subscriptions = new CompositeDisposable;
      this.providerManager = new ProviderManager;
      this.subscriptions.add(this.providerManager);
      this.emitter = new Emitter;
      this.subscriptions.add(atom.views.addViewProvider(SuggestionList, function(model) {
        return new SuggestionListElement().initialize(model);
      }));
      this.suggestionList = new SuggestionList;
      this.handleEvents();
      this.handleCommands();
    }

    AutocompleteManager.prototype.updateCurrentEditor = function(currentPaneItem) {
      var _ref1;
      if (currentPaneItem == null) {
        return;
      }
      if (currentPaneItem === this.editor) {
        return;
      }
      if ((_ref1 = this.editorSubscriptions) != null) {
        _ref1.dispose();
      }
      this.editorSubscriptions = null;
      this.editor = null;
      this.editorView = null;
      this.buffer = null;
      if (!this.paneItemIsValid(currentPaneItem)) {
        return;
      }
      this.editor = currentPaneItem;
      this.editorView = atom.views.getView(this.editor);
      this.buffer = this.editor.getBuffer();
      this.editorSubscriptions = new CompositeDisposable;
      this.editorSubscriptions.add(this.buffer.onDidSave(this.bufferSaved));
      this.editorSubscriptions.add(this.buffer.onDidChange(this.bufferChanged));
      return this.editorSubscriptions.add(this.editor.onDidChangeCursorPosition(this.cursorMoved));
    };

    AutocompleteManager.prototype.paneItemIsValid = function(paneItem) {
      if (paneItem == null) {
        return false;
      }
      return paneItem instanceof TextEditor;
    };

    AutocompleteManager.prototype.handleEvents = function() {
      this.subscriptions.add(atom.workspace.observeActivePaneItem(this.updateCurrentEditor));
      this.subscriptions.add(atom.config.observe('autosave.enabled', (function(_this) {
        return function(value) {
          return _this.autosaveEnabled = value;
        };
      })(this)));
      this.subscriptions.add(this.suggestionList.onDidConfirm(this.confirm));
      return this.subscriptions.add(this.suggestionList.onDidCancel(this.hideSuggestionList));
    };

    AutocompleteManager.prototype.handleCommands = function() {
      return this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'autocomplete-plus:activate': this.runAutocompletion
      }));
    };

    AutocompleteManager.prototype.runAutocompletion = function() {
      var currentScope, currentScopeChain, cursor, cursorPosition, options;
      this.hideSuggestionList();
      if (this.providerManager == null) {
        return;
      }
      if (this.editor == null) {
        return;
      }
      if (this.buffer == null) {
        return;
      }
      if (this.isCurrentFileBlackListed()) {
        return;
      }
      cursor = this.editor.getLastCursor();
      if (cursor == null) {
        return;
      }
      cursorPosition = cursor.getBufferPosition();
      currentScope = cursor.getScopeDescriptor();
      if (currentScope == null) {
        return;
      }
      currentScopeChain = currentScope.getScopeChain();
      if (currentScopeChain == null) {
        return;
      }
      options = {
        editor: this.editor,
        buffer: this.buffer,
        cursor: cursor,
        position: cursorPosition,
        scope: currentScope,
        scopeChain: currentScopeChain,
        prefix: this.prefixForCursor(cursor)
      };
      return this.scatterRequest(options);
    };

    AutocompleteManager.prototype.scatterRequest = function(options) {
      var providers, suggestionsPromise;
      providers = this.providerManager.providersForScopeChain(options.scopeChain);
      if (!((providers != null) && providers.length)) {
        return;
      }
      providers = providers.map(function(provider) {
        var providerSuggestions;
        return providerSuggestions = provider != null ? provider.requestHandler(options) : void 0;
      });
      if (!((providers != null) && providers.length)) {
        return;
      }
      return this.currentSuggestionsPromise = suggestionsPromise = Promise.all(providers).then(_.partial(this.gatherSuggestions, providers)).then((function(_this) {
        return function(suggestions) {
          return _this.showSuggestions(suggestions, suggestionsPromise, options);
        };
      })(this));
    };

    AutocompleteManager.prototype.showSuggestions = function(suggestions, suggestionsPromise, options) {
      if (!suggestions.length) {
        this.emitter.emit('did-autocomplete', {
          options: options,
          suggestions: suggestions
        });
        return;
      }
      suggestions = _.uniq(suggestions, function(s) {
        return s.word;
      });
      if (this.currentSuggestionsPromise === suggestionsPromise) {
        this.showSuggestionList(suggestions);
      }
      return this.emitter.emit('did-autocomplete', {
        options: options,
        suggestions: suggestions
      });
    };

    AutocompleteManager.prototype.gatherSuggestions = function(providers, providerSuggestions) {
      return providerSuggestions.reduce(function(suggestions, providerSuggestions, index) {
        var provider;
        provider = providers[index];
        if (!(providerSuggestions != null ? providerSuggestions.length : void 0)) {
          return suggestions;
        }
        suggestions = suggestions.concat(providerSuggestions);
        return suggestions;
      }, []);
    };

    AutocompleteManager.prototype.prefixForCursor = function(cursor) {
      var end, start;
      if (!((this.buffer != null) && (cursor != null))) {
        return '';
      }
      start = cursor.getBeginningOfCurrentWordBufferPosition();
      end = cursor.getBufferPosition();
      if (!((start != null) && (end != null))) {
        return '';
      }
      return this.buffer.getTextInRange(new Range(start, end));
    };

    AutocompleteManager.prototype.confirm = function(match) {
      var _ref1;
      if (!((this.editor != null) && (match != null))) {
        return;
      }
      if (match.onWillConfirm != null) {
        match.onWillConfirm();
      }
      if ((_ref1 = this.editor.getSelections()) != null) {
        _ref1.forEach(function(selection) {
          return selection != null ? selection.clear() : void 0;
        });
      }
      this.hideSuggestionList();
      this.replaceTextWithMatch(match);
      if ((match.isSnippet != null) && match.isSnippet) {
        setTimeout((function(_this) {
          return function() {
            return atom.commands.dispatch(atom.views.getView(_this.editor), 'snippets:expand');
          };
        })(this), 1);
      }
      if (match.onDidConfirm != null) {
        return match.onDidConfirm();
      }
    };

    AutocompleteManager.prototype.showSuggestionList = function(suggestions) {
      this.suggestionList.changeItems(suggestions);
      return this.suggestionList.show(this.editor);
    };

    AutocompleteManager.prototype.hideSuggestionList = function() {
      var _ref1;
      return (_ref1 = this.suggestionList) != null ? _ref1.hideAndFocusOn(this.editorView) : void 0;
    };

    AutocompleteManager.prototype.replaceTextWithMatch = function(match) {
      var buffer, newSelectedBufferRanges, selections;
      if (this.editor == null) {
        return;
      }
      newSelectedBufferRanges = [];
      buffer = this.editor.getBuffer();
      if (buffer == null) {
        return;
      }
      selections = this.editor.getSelections();
      if (selections == null) {
        return;
      }
      return this.editor.transact((function(_this) {
        return function() {
          if ((match.prefix != null) && match.prefix.length > 0) {
            _this.editor.selectLeft(match.prefix.length);
            _this.editor["delete"]();
          }
          return _this.editor.insertText(match.word);
        };
      })(this));
    };

    AutocompleteManager.prototype.isCurrentFileBlackListed = function() {
      var blacklist, blacklistGlob, fileName, _i, _len, _ref1;
      blacklist = (_ref1 = atom.config.get('autocomplete-plus.fileBlacklist')) != null ? _ref1.map(function(s) {
        return s.trim();
      }) : void 0;
      if (!((blacklist != null) && blacklist.length)) {
        return false;
      }
      fileName = path.basename(this.editor.getBuffer().getPath());
      for (_i = 0, _len = blacklist.length; _i < _len; _i++) {
        blacklistGlob = blacklist[_i];
        if (minimatch(fileName, blacklistGlob)) {
          return true;
        }
      }
      return false;
    };

    AutocompleteManager.prototype.contentsModified = function() {
      var delay;
      delay = atom.config.get('autocomplete-plus.autoActivationDelay');
      clearTimeout(this.delayTimeout);
      return this.delayTimeout = setTimeout(this.runAutocompletion, delay);
    };

    AutocompleteManager.prototype.cursorMoved = function(_arg) {
      var textChanged;
      textChanged = _arg.textChanged;
      if (!textChanged) {
        return this.hideSuggestionList();
      }
    };

    AutocompleteManager.prototype.bufferSaved = function() {
      if (!this.autosaveEnabled) {
        return this.hideSuggestionList();
      }
    };

    AutocompleteManager.prototype.bufferChanged = function(_arg) {
      var newText, oldText;
      newText = _arg.newText, oldText = _arg.oldText;
      if (this.suggestionList.compositionInProgress) {
        return;
      }
      if (atom.config.get('autocomplete-plus.enableAutoActivation') && (newText.trim().length === 1 || oldText.trim().length === 1)) {
        return this.contentsModified();
      } else {
        return this.hideSuggestionList();
      }
    };

    AutocompleteManager.prototype.onDidAutocomplete = function(callback) {
      return this.emitter.on('did-autocomplete', callback);
    };

    AutocompleteManager.prototype.dispose = function() {
      var _ref1, _ref2, _ref3, _ref4, _ref5;
      if ((_ref1 = this.editorSubscriptions) != null) {
        _ref1.dispose();
      }
      this.editorSubscriptions = null;
      if ((_ref2 = this.suggestionList) != null) {
        _ref2.destroy();
      }
      this.suggestionList = null;
      if ((_ref3 = this.subscriptions) != null) {
        _ref3.dispose();
      }
      this.subscriptions = null;
      this.providerManager = null;
      if ((_ref4 = this.emitter) != null) {
        _ref4.emit('did-dispose');
      }
      if ((_ref5 = this.emitter) != null) {
        _ref5.dispose();
      }
      return this.emitter = null;
    };

    return AutocompleteManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtLQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUFpRSxPQUFBLENBQVEsTUFBUixDQUFqRSxFQUFDLGFBQUEsS0FBRCxFQUFRLGtCQUFBLFVBQVIsRUFBb0IsMkJBQUEsbUJBQXBCLEVBQXlDLGtCQUFBLFVBQXpDLEVBQXFELGVBQUEsT0FBckQsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FESixDQUFBOztBQUFBLEVBRUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBRlosQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFJQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQUpsQixDQUFBOztBQUFBLEVBS0EsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FMakIsQ0FBQTs7QUFBQSxFQU1BLHFCQUFBLEdBQXdCLE9BQUEsQ0FBUSwyQkFBUixDQU54QixDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLFFBQUEsZUFBQTs7QUFBQSxJQUFBLGVBQUEsR0FBa0IsS0FBbEIsQ0FBQTs7QUFBQSxrQ0FDQSxNQUFBLEdBQVEsSUFEUixDQUFBOztBQUFBLGtDQUVBLFVBQUEsR0FBWSxJQUZaLENBQUE7O0FBQUEsa0NBR0EsTUFBQSxHQUFRLElBSFIsQ0FBQTs7QUFBQSxrQ0FJQSxlQUFBLEdBQWlCLElBSmpCLENBQUE7O0FBQUEsa0NBS0EsYUFBQSxHQUFlLElBTGYsQ0FBQTs7QUFBQSxrQ0FNQSxjQUFBLEdBQWdCLElBTmhCLENBQUE7O0FBQUEsa0NBT0EsbUJBQUEsR0FBcUIsSUFQckIsQ0FBQTs7QUFTYSxJQUFBLDZCQUFBLEdBQUE7QUFDWCwyREFBQSxD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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-plus/lib/autocomplete-manager.coffee