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
    AutocompleteManager.prototype.autosaveEnabled = false;

    AutocompleteManager.prototype.backspaceTriggersAutocomplete = true;

    AutocompleteManager.prototype.buffer = null;

    AutocompleteManager.prototype.editor = null;

    AutocompleteManager.prototype.editorSubscriptions = null;

    AutocompleteManager.prototype.editorView = null;

    AutocompleteManager.prototype.providerManager = null;

    AutocompleteManager.prototype.ready = false;

    AutocompleteManager.prototype.subscriptions = null;

    AutocompleteManager.prototype.suggestionDelay = 50;

    AutocompleteManager.prototype.suggestionList = null;

    AutocompleteManager.prototype.shouldDisplaySuggestions = false;

    function AutocompleteManager() {
      this.dispose = __bind(this.dispose, this);
      this.onDidAutocomplete = __bind(this.onDidAutocomplete, this);
      this.bufferChanged = __bind(this.bufferChanged, this);
      this.bufferSaved = __bind(this.bufferSaved, this);
      this.cursorMoved = __bind(this.cursorMoved, this);
      this.requestNewSuggestions = __bind(this.requestNewSuggestions, this);
      this.isCurrentFileBlackListed = __bind(this.isCurrentFileBlackListed, this);
      this.replaceTextWithMatch = __bind(this.replaceTextWithMatch, this);
      this.hideSuggestionList = __bind(this.hideSuggestionList, this);
      this.confirm = __bind(this.confirm, this);
      this.prefixForCursor = __bind(this.prefixForCursor, this);
      this.displaySuggestions = __bind(this.displaySuggestions, this);
      this.getSuggestionsFromProviders = __bind(this.getSuggestionsFromProviders, this);
      this.findSuggestions = __bind(this.findSuggestions, this);
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
      this.ready = true;
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
      this.subscriptions.add(atom.config.observe('autocomplete-plus.backspaceTriggersAutocomplete', (function(_this) {
        return function(value) {
          return _this.backspaceTriggersAutocomplete = value;
        };
      })(this)));
      this.subscriptions.add(this.suggestionList.onDidConfirm(this.confirm));
      return this.subscriptions.add(this.suggestionList.onDidCancel(this.hideSuggestionList));
    };

    AutocompleteManager.prototype.handleCommands = function() {
      return this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'autocomplete-plus:activate': (function(_this) {
          return function() {
            _this.shouldDisplaySuggestions = true;
            return _this.findSuggestions();
          };
        })(this)
      }));
    };

    AutocompleteManager.prototype.findSuggestions = function() {
      var currentScope, currentScopeChain, cursor, cursorPosition, options;
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
      return this.getSuggestionsFromProviders(options);
    };

    AutocompleteManager.prototype.getSuggestionsFromProviders = function(options) {
      var providerPromises, providers, suggestionsPromise;
      providers = this.providerManager.providersForScopeChain(options.scopeChain);
      providerPromises = providers != null ? providers.map(function(provider) {
        return provider != null ? provider.requestHandler(options) : void 0;
      }) : void 0;
      if (!(providerPromises != null ? providerPromises.length : void 0)) {
        return;
      }
      return this.currentSuggestionsPromise = suggestionsPromise = Promise.all(providerPromises).then(this.mergeSuggestionsFromProviders).then((function(_this) {
        return function(suggestions) {
          if (_this.currentSuggestionsPromise === suggestionsPromise) {
            return _this.displaySuggestions(suggestions, options);
          }
        };
      })(this));
    };

    AutocompleteManager.prototype.mergeSuggestionsFromProviders = function(providerSuggestions) {
      return providerSuggestions.reduce(function(suggestions, providerSuggestions) {
        if (providerSuggestions != null ? providerSuggestions.length : void 0) {
          suggestions = suggestions.concat(providerSuggestions);
        }
        return suggestions;
      }, []);
    };

    AutocompleteManager.prototype.displaySuggestions = function(suggestions, options) {
      suggestions = _.uniq(suggestions, function(s) {
        return s.word;
      });
      if (this.shouldDisplaySuggestions && suggestions.length) {
        this.showSuggestionList(suggestions);
      } else {
        this.hideSuggestionList();
      }
      return this.emitter.emit('did-autocomplete', {
        options: options,
        suggestions: suggestions
      });
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
      if ((_ref1 = this.suggestionList) != null) {
        _ref1.hideAndFocusOn(this.editorView);
      }
      return this.shouldDisplaySuggestions = false;
    };

    AutocompleteManager.prototype.requestHideSuggestionList = function(command) {
      this.hideTimeout = setTimeout(this.hideSuggestionList, 0);
      return this.shouldDisplaySuggestions = false;
    };

    AutocompleteManager.prototype.cancelHideSuggestionListRequest = function() {
      return clearTimeout(this.hideTimeout);
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

    AutocompleteManager.prototype.requestNewSuggestions = function() {
      var delay;
      delay = atom.config.get('autocomplete-plus.autoActivationDelay');
      clearTimeout(this.delayTimeout);
      if (this.suggestionList.isActive()) {
        delay = this.suggestionDelay;
      }
      this.delayTimeout = setTimeout(this.findSuggestions, delay);
      return this.shouldDisplaySuggestions = true;
    };

    AutocompleteManager.prototype.cancelNewSuggestionsRequest = function() {
      clearTimeout(this.delayTimeout);
      return this.shouldDisplaySuggestions = false;
    };

    AutocompleteManager.prototype.cursorMoved = function(_arg) {
      var textChanged;
      textChanged = _arg.textChanged;
      if (!textChanged) {
        return this.requestHideSuggestionList();
      }
    };

    AutocompleteManager.prototype.bufferSaved = function() {
      if (!this.autosaveEnabled) {
        return this.hideSuggestionList();
      }
    };

    AutocompleteManager.prototype.bufferChanged = function(_arg) {
      var autoActivationEnabled, newText, oldText, wouldAutoActivate;
      newText = _arg.newText, oldText = _arg.oldText;
      autoActivationEnabled = atom.config.get('autocomplete-plus.enableAutoActivation');
      wouldAutoActivate = newText.trim().length === 1 || ((this.backspaceTriggersAutocomplete || this.suggestionList.isActive()) && oldText.trim().length === 1);
      if (autoActivationEnabled && wouldAutoActivate) {
        this.cancelHideSuggestionListRequest();
        return this.requestNewSuggestions();
      } else {
        this.cancelNewSuggestionsRequest();
        return this.hideSuggestionList();
      }
    };

    AutocompleteManager.prototype.onDidAutocomplete = function(callback) {
      return this.emitter.on('did-autocomplete', callback);
    };

    AutocompleteManager.prototype.dispose = function() {
      var _ref1, _ref2, _ref3, _ref4, _ref5;
      this.ready = false;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtLQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUFpRSxPQUFBLENBQVEsTUFBUixDQUFqRSxFQUFDLGFBQUEsS0FBRCxFQUFRLGtCQUFBLFVBQVIsRUFBb0IsMkJBQUEsbUJBQXBCLEVBQXlDLGtCQUFBLFVBQXpDLEVBQXFELGVBQUEsT0FBckQsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FESixDQUFBOztBQUFBLEVBRUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBRlosQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFJQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQUpsQixDQUFBOztBQUFBLEVBS0EsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FMakIsQ0FBQTs7QUFBQSxFQU1BLHFCQUFBLEdBQXdCLE9BQUEsQ0FBUSwyQkFBUixDQU54QixDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGtDQUFBLGVBQUEsR0FBaUIsS0FBakIsQ0FBQTs7QUFBQSxrQ0FDQSw2QkFBQSxHQUErQixJQUQvQixDQUFBOztBQUFBLGtDQUVBLE1BQUEsR0FBUSxJQUZSLENBQUE7O0FBQUEsa0NBR0EsTUFBQSxHQUFRLElBSFIsQ0FBQTs7QUFBQSxrQ0FJQSxtQkFBQSxHQUFxQixJQUpyQixDQUFBOztBQUFBLGtDQUtBLFVBQUEsR0FBWSxJQUxaLENBQUE7O0FBQUEsa0NBTUEsZUFBQSxHQUFpQixJQU5qQixDQUFBOztBQUFBLGtDQU9BLEtBQUEsR0FBTyxLQVBQLENBQUE7O0FBQUEsa0NBUUEsYUFBQSxHQUFlLElBUmYsQ0FBQTs7QUFBQSxrQ0FTQSxlQUFB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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-plus/lib/autocomplete-manager.coffee