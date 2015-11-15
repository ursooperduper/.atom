(function() {
  var CompositeDisposable, FuzzyProvider, Suggestion, TextEditor, fuzzaldrin, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  Suggestion = require('./suggestion');

  fuzzaldrin = require('fuzzaldrin');

  CompositeDisposable = require('event-kit').CompositeDisposable;

  TextEditor = require('atom').TextEditor;

  module.exports = FuzzyProvider = (function() {
    FuzzyProvider.prototype.wordRegex = /\b\w*[a-zA-Z_-]+\w*\b/g;

    FuzzyProvider.prototype.wordList = null;

    FuzzyProvider.prototype.editor = null;

    FuzzyProvider.prototype.buffer = null;

    function FuzzyProvider() {
      this.dispose = __bind(this.dispose, this);
      this.getCompletionsForCursorScope = __bind(this.getCompletionsForCursorScope, this);
      this.settingsForScopeDescriptor = __bind(this.settingsForScopeDescriptor, this);
      this.findSuggestionsForWord = __bind(this.findSuggestionsForWord, this);
      this.buildWordList = __bind(this.buildWordList, this);
      this.lastTypedWord = __bind(this.lastTypedWord, this);
      this.addLastWordToList = __bind(this.addLastWordToList, this);
      this.bufferChanged = __bind(this.bufferChanged, this);
      this.bufferSaved = __bind(this.bufferSaved, this);
      this.requestHandler = __bind(this.requestHandler, this);
      this.paneItemIsValid = __bind(this.paneItemIsValid, this);
      this.updateCurrentEditor = __bind(this.updateCurrentEditor, this);
      this.id = 'autocomplete-plus-fuzzyprovider';
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.workspace.observeActivePaneItem(this.updateCurrentEditor));
      this.buildWordList();
      this.selector = '*';
    }

    FuzzyProvider.prototype.updateCurrentEditor = function(currentPaneItem) {
      var _ref, _ref1;
      if (currentPaneItem == null) {
        return;
      }
      if (currentPaneItem === this.editor) {
        return;
      }
      if ((_ref = this.bufferSavedSubscription) != null) {
        _ref.dispose();
      }
      if ((_ref1 = this.bufferChangedSubscription) != null) {
        _ref1.dispose();
      }
      this.editor = null;
      this.buffer = null;
      if (!this.paneItemIsValid(currentPaneItem)) {
        return;
      }
      this.editor = currentPaneItem;
      this.buffer = this.editor.getBuffer();
      this.bufferSavedSubscription = this.buffer.onDidSave(this.bufferSaved);
      this.bufferChangedSubscription = this.buffer.onDidChange(this.bufferChanged);
      return this.buildWordList();
    };

    FuzzyProvider.prototype.paneItemIsValid = function(paneItem) {
      if (paneItem == null) {
        return false;
      }
      return paneItem instanceof TextEditor;
    };

    FuzzyProvider.prototype.requestHandler = function(options) {
      var prefix, selection, suggestions;
      if (options == null) {
        return;
      }
      if (options.editor == null) {
        return;
      }
      selection = options.editor.getLastSelection();
      prefix = options.prefix;
      if (!prefix.length) {
        return;
      }
      suggestions = this.findSuggestionsForWord(prefix);
      if (!suggestions.length) {
        return;
      }
      return suggestions;
    };

    FuzzyProvider.prototype.bufferSaved = function() {
      return this.buildWordList();
    };

    FuzzyProvider.prototype.bufferChanged = function(e) {
      var newline, wordChars;
      wordChars = "ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź" + "abcdefghijklmnopqrstuvwxyz1234567890";
      if (wordChars.indexOf(e.newText.toLowerCase()) === -1) {
        newline = e.newText === "\n";
        return this.addLastWordToList(e.newRange.start.row, e.newRange.start.column, newline);
      }
    };

    FuzzyProvider.prototype.addLastWordToList = function(row, column, newline) {
      var lastWord;
      lastWord = this.lastTypedWord(row, column, newline);
      if (!lastWord) {
        return;
      }
      if (this.wordList.indexOf(lastWord) < 0) {
        return this.wordList.push(lastWord);
      }
    };

    FuzzyProvider.prototype.lastTypedWord = function(row, column, newline) {
      var lastWord, lineRange, maxColumn;
      if (newline) {
        if (!(column = 0)) {
          maxColumn = column - 1;
        }
      } else {
        maxColumn = column;
      }
      lineRange = [[row, 0], [row, column]];
      lastWord = null;
      this.buffer.scanInRange(this.wordRegex, lineRange, function(_arg) {
        var match, range, stop;
        match = _arg.match, range = _arg.range, stop = _arg.stop;
        return lastWord = match[0];
      });
      return lastWord;
    };

    FuzzyProvider.prototype.buildWordList = function() {
      var editor, editors, matches, minimumWordLength, wordList, _i, _len;
      if (this.editor == null) {
        return;
      }
      wordList = [];
      if (atom.config.get('autocomplete-plus.includeCompletionsFromAllBuffers')) {
        editors = atom.workspace.getEditors();
      } else {
        editors = [this.editor];
      }
      matches = [];
      for (_i = 0, _len = editors.length; _i < _len; _i++) {
        editor = editors[_i];
        matches.push(editor.getText().match(this.wordRegex));
      }
      wordList = _.uniq(_.flatten(matches));
      minimumWordLength = atom.config.get('autocomplete-plus.minimumWordLength');
      if (minimumWordLength) {
        wordList = wordList.filter(function(word) {
          return (word != null ? word.length : void 0) >= minimumWordLength;
        });
      }
      return this.wordList = wordList;
    };

    FuzzyProvider.prototype.findSuggestionsForWord = function(prefix) {
      var results, word, wordList, words;
      if (this.wordList == null) {
        return;
      }
      wordList = this.wordList.concat(this.getCompletionsForCursorScope());
      words = atom.config.get("autocomplete-plus.strictMatching") ? wordList.filter(function(word) {
        return (word != null ? word.indexOf(prefix) : void 0) === 0;
      }) : fuzzaldrin.filter(wordList, prefix);
      results = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = words.length; _i < _len; _i++) {
          word = words[_i];
          if (word !== prefix) {
            _results.push({
              word: word,
              prefix: prefix
            });
          }
        }
        return _results;
      })();
      return results;
    };

    FuzzyProvider.prototype.settingsForScopeDescriptor = function(scopeDescriptor, keyPath) {
      var entries, value, _i, _len, _results;
      if (!(((typeof atom !== "undefined" && atom !== null ? atom.config : void 0) != null) && (scopeDescriptor != null) && (keyPath != null))) {
        return [];
      }
      entries = atom.config.getAll(null, {
        scope: scopeDescriptor
      });
      _results = [];
      for (_i = 0, _len = entries.length; _i < _len; _i++) {
        value = entries[_i].value;
        if (_.valueForKeyPath(value, keyPath) != null) {
          _results.push(value);
        }
      }
      return _results;
    };

    FuzzyProvider.prototype.getCompletionsForCursorScope = function() {
      var completions, cursorScope;
      cursorScope = this.editor.scopeDescriptorForBufferPosition(this.editor.getCursorBufferPosition());
      completions = this.settingsForScopeDescriptor(cursorScope != null ? cursorScope.getScopesArray() : void 0, "editor.completions");
      completions = completions.map(function(properties) {
        return _.valueForKeyPath(properties, "editor.completions");
      });
      return _.uniq(_.flatten(completions));
    };

    FuzzyProvider.prototype.dispose = function() {
      var _ref, _ref1;
      if ((_ref = this.bufferSavedSubscription) != null) {
        _ref.dispose();
      }
      if ((_ref1 = this.bufferChangedSubscription) != null) {
        _ref1.dispose();
      }
      return this.subscriptions.dispose();
    };

    return FuzzyProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlFQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQURiLENBQUE7O0FBQUEsRUFFQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FGYixDQUFBOztBQUFBLEVBR0Msc0JBQXVCLE9BQUEsQ0FBUSxXQUFSLEVBQXZCLG1CQUhELENBQUE7O0FBQUEsRUFJQyxhQUFlLE9BQUEsQ0FBUSxNQUFSLEVBQWYsVUFKRCxDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDRCQUFBLFNBQUEsR0FBVyx3QkFBWCxDQUFBOztBQUFBLDRCQUNBLFFBQUEsR0FBVSxJQURWLENBQUE7O0FBQUEsNEJBRUEsTUFBQSxHQUFRLElBRlIsQ0FBQTs7QUFBQSw0QkFHQSxNQUFBLEdBQVEsSUFIUixDQUFBOztBQUthLElBQUEsdUJBQUEsR0FBQTtBQUNYLCtDQUFBLENBQUE7QUFBQSx5RkFBQSxDQUFBO0FBQUEscUZBQUEsQ0FBQTtBQUFBLDZFQUFBLENBQUE7QUFBQSwyREFBQSxDQUFBO0FBQUEsMkRBQUEsQ0FBQTtBQUFBLG1FQUFBLENBQUE7QUFBQSwyREFBQSxDQUFBO0FBQUEsdURBQUEsQ0FBQTtBQUFBLDZEQUFBLENBQUE7QUFBQSwrREFBQSxDQUFBO0FBQUEsdUVBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLEVBQUQsR0FBTSxpQ0FBTixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBRGpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsU0FBUyxD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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-plus/lib/fuzzy-provider.coffee