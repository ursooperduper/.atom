(function() {
  var AutocompleteManager, CompositeDisposable, Disposable, Emitter, ProviderManager, Range, SuggestionList, SuggestionListElement, TextEditor, minimatch, path, _, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('atom'), Range = _ref.Range, TextEditor = _ref.TextEditor;

  _ref1 = require('event-kit'), CompositeDisposable = _ref1.CompositeDisposable, Disposable = _ref1.Disposable, Emitter = _ref1.Emitter;

  _ = require('underscore-plus');

  minimatch = require('minimatch');

  path = require('path');

  ProviderManager = require('./provider-manager');

  SuggestionList = require('./suggestion-list');

  SuggestionListElement = require('./suggestion-list-element');

  module.exports = AutocompleteManager = (function() {
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
      this.paneItemIsValid = __bind(this.paneItemIsValid, this);
      this.updateCurrentEditor = __bind(this.updateCurrentEditor, this);
      this.subscriptions = new CompositeDisposable;
      this.providerManager = new ProviderManager();
      this.subscriptions.add(this.providerManager);
      this.emitter = new Emitter;
      this.subscriptions.add(atom.views.addViewProvider(SuggestionList, (function(_this) {
        return function(model) {
          return new SuggestionListElement().initialize(model);
        };
      })(this)));
      this.suggestionList = new SuggestionList();
      this.handleEvents();
      this.handleCommands();
    }

    AutocompleteManager.prototype.updateCurrentEditor = function(currentPaneItem) {
      var _ref2;
      if (currentPaneItem == null) {
        return;
      }
      if (currentPaneItem === this.editor) {
        return;
      }
      if ((_ref2 = this.editorSubscriptions) != null) {
        _ref2.dispose();
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
      var _ref2;
      if (!((this.editor != null) && (match != null))) {
        return;
      }
      if (match.onWillConfirm != null) {
        match.onWillConfirm();
      }
      if ((_ref2 = this.editor.getSelections()) != null) {
        _ref2.forEach(function(selection) {
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
      var _ref2;
      return (_ref2 = this.suggestionList) != null ? _ref2.hideAndFocusOn(this.editorView) : void 0;
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
      var blacklist, blacklistGlob, fileName, _i, _len, _ref2;
      blacklist = (_ref2 = atom.config.get('autocomplete-plus.fileBlacklist')) != null ? _ref2.map(function(s) {
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
      delay = parseInt(atom.config.get('autocomplete-plus.autoActivationDelay'));
      if (this.delayTimeout) {
        clearTimeout(this.delayTimeout);
      }
      return this.delayTimeout = setTimeout(this.runAutocompletion, delay);
    };

    AutocompleteManager.prototype.cursorMoved = function(data) {
      if (!data.textChanged) {
        return this.hideSuggestionList();
      }
    };

    AutocompleteManager.prototype.bufferSaved = function() {
      return this.hideSuggestionList();
    };

    AutocompleteManager.prototype.bufferChanged = function(e) {
      if (this.suggestionList.compositionInProgress) {
        return;
      }
      if (atom.config.get('autocomplete-plus.enableAutoActivation') && (e.newText.trim().length === 1 || e.oldText.trim().length === 1)) {
        return this.contentsModified();
      } else {
        return this.hideSuggestionList();
      }
    };

    AutocompleteManager.prototype.onDidAutocomplete = function(callback) {
      return this.emitter.on('did-autocomplete', callback);
    };

    AutocompleteManager.prototype.dispose = function() {
      var _ref2, _ref3, _ref4, _ref5, _ref6;
      if ((_ref2 = this.editorSubscriptions) != null) {
        _ref2.dispose();
      }
      this.editorSubscriptions = null;
      if ((_ref3 = this.suggestionList) != null) {
        _ref3.destroy();
      }
      this.suggestionList = null;
      if ((_ref4 = this.subscriptions) != null) {
        _ref4.dispose();
      }
      this.subscriptions = null;
      this.providerManager = null;
      if ((_ref5 = this.emitter) != null) {
        _ref5.emit('did-dispose');
      }
      if ((_ref6 = this.emitter) != null) {
        _ref6.dispose();
      }
      return this.emitter = null;
    };

    return AutocompleteManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlLQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUF1QixPQUFBLENBQVEsTUFBUixDQUF2QixFQUFDLGFBQUEsS0FBRCxFQUFRLGtCQUFBLFVBQVIsQ0FBQTs7QUFBQSxFQUNBLFFBQTZDLE9BQUEsQ0FBUSxXQUFSLENBQTdDLEVBQUMsNEJBQUEsbUJBQUQsRUFBc0IsbUJBQUEsVUFBdEIsRUFBa0MsZ0JBQUEsT0FEbEMsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FGSixDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBSFosQ0FBQTs7QUFBQSxFQUlBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUpQLENBQUE7O0FBQUEsRUFLQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQUxsQixDQUFBOztBQUFBLEVBTUEsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FOakIsQ0FBQTs7QUFBQSxFQU9BLHFCQUFBLEdBQXdCLE9BQUEsQ0FBUSwyQkFBUixDQVB4QixDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGtDQUFBLE1BQUEsR0FBUSxJQUFSLENBQUE7O0FBQUEsa0NBQ0EsVUFBQSxHQUFZLElBRFosQ0FBQTs7QUFBQSxrQ0FFQSxNQUFBLEdBQVEsSUFGUixDQUFBOztBQUFBLGtDQUdBLGVBQUEsR0FBaUIsSUFIakIsQ0FBQTs7QUFBQSxrQ0FJQSxhQUFBLEdBQWUsSUFKZixDQUFBOztBQUFBLGtDQUtBLGNBQUEsR0FBZ0IsSUFMaEIsQ0FBQTs7QUFBQSxrQ0FNQSxtQkFBQSxHQUFxQixJQU5yQixDQUFBOztBQVFhLElBQUEsNkJBQUEsR0FBQTtBQUNYLDJEQUFBLENBQUE7QUFB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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-plus/lib/autocomplete-manager.coffee