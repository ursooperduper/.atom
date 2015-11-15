(function() {
  var CompositeDisposable, FuzzyProvider, Suggestion, TextEditor, fuzzaldrin, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  Suggestion = require('./suggestion');

  fuzzaldrin = require('fuzzaldrin');

  _ref = require('atom'), TextEditor = _ref.TextEditor, CompositeDisposable = _ref.CompositeDisposable;

  module.exports = FuzzyProvider = (function() {
    FuzzyProvider.prototype.wordRegex = /\b\w*[a-zA-Z_-]+\w*\b/g;

    FuzzyProvider.prototype.wordList = null;

    FuzzyProvider.prototype.editor = null;

    FuzzyProvider.prototype.buffer = null;

    function FuzzyProvider() {
      this.dispose = __bind(this.dispose, this);
      this.getCompletionsForCursorScope = __bind(this.getCompletionsForCursorScope, this);
      this.findSuggestionsForWord = __bind(this.findSuggestionsForWord, this);
      this.buildWordList = __bind(this.buildWordList, this);
      this.lastTypedWord = __bind(this.lastTypedWord, this);
      this.addLastWordToList = __bind(this.addLastWordToList, this);
      this.bufferChanged = __bind(this.bufferChanged, this);
      this.bufferSaved = __bind(this.bufferSaved, this);
      this.requestHandler = __bind(this.requestHandler, this);
      this.updateCurrentEditor = __bind(this.updateCurrentEditor, this);
      this.id = 'autocomplete-plus-fuzzyprovider';
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.workspace.observeActivePaneItem(this.updateCurrentEditor));
      this.buildWordList();
      this.selector = '*';
    }

    FuzzyProvider.prototype.updateCurrentEditor = function(currentPaneItem) {
      var _ref1, _ref2;
      if (currentPaneItem == null) {
        return;
      }
      if (currentPaneItem === this.editor) {
        return;
      }
      if ((_ref1 = this.bufferSavedSubscription) != null) {
        _ref1.dispose();
      }
      if ((_ref2 = this.bufferChangedSubscription) != null) {
        _ref2.dispose();
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
      wordChars = 'ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź' + 'abcdefghijklmnopqrstuvwxyz1234567890';
      if (wordChars.indexOf(e.newText.toLowerCase()) === -1) {
        newline = e.newText === '\n';
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
      words = atom.config.get('autocomplete-plus.strictMatching') ? wordList.filter(function(word) {
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
      completions = this.settingsForScopeDescriptor(cursorScope != null ? cursorScope.getScopesArray() : void 0, 'editor.completions');
      completions = completions.map(function(properties) {
        return _.valueForKeyPath(properties, 'editor.completions');
      });
      return _.uniq(_.flatten(completions));
    };

    FuzzyProvider.prototype.dispose = function() {
      var _ref1, _ref2;
      if ((_ref1 = this.bufferSavedSubscription) != null) {
        _ref1.dispose();
      }
      if ((_ref2 = this.bufferChangedSubscription) != null) {
        _ref2.dispose();
      }
      return this.subscriptions.dispose();
    };

    return FuzzyProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtFQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQURiLENBQUE7O0FBQUEsRUFFQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FGYixDQUFBOztBQUFBLEVBR0EsT0FBcUMsT0FBQSxDQUFRLE1BQVIsQ0FBckMsRUFBQyxrQkFBQSxVQUFELEVBQWEsMkJBQUEsbUJBSGIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw0QkFBQSxTQUFBLEdBQVcsd0JBQVgsQ0FBQTs7QUFBQSw0QkFDQSxRQUFBLEdBQVUsSUFEVixDQUFBOztBQUFBLDRCQUVBLE1BQUEsR0FBUSxJQUZSLENBQUE7O0FBQUEsNEJBR0EsTUFBQSxHQUFRLElBSFIsQ0FBQTs7QUFLYSxJQUFBLHVCQUFBLEdBQUE7QUFDWCwrQ0FBQSxDQUFBO0FBQUEseUZBQUEsQ0FBQTtBQUFBLDZFQUFBLENBQUE7QUFBQSwyREFBQSxDQUFBO0FBQUEsMkRBQUEsQ0FBQTtBQUFBLG1FQUFBLENBQUE7QUFBQSwyREFBQSxDQUFBO0FBQUEsdURBQUEsQ0FBQTtBQUFBLDZEQUFBLENBQUE7QUFBQSx1RUFBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsRUFBRCxHQUFNLGlDQUFOLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFEakIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQWYsQ0FBcUMsSUFBQyxDQUFBLG1CQUF0QyxDQUFuQixDQUZBLENBQUE7QUFB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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-plus/lib/fuzzy-provider.coffee