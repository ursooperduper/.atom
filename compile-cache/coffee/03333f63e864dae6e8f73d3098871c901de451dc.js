(function() {
  var AtomReact, Subscriber;

  Subscriber = require('emissary').Subscriber;

  AtomReact = (function() {
    Subscriber.includeInto(AtomReact);

    function AtomReact() {}

    AtomReact.prototype.patchEditorLangModeAutoDecreaseIndentForBufferRow = function(editor) {
      var fn, self;
      self = this;
      fn = editor.languageMode.autoDecreaseIndentForBufferRow;
      if (fn.jsxPatch) {
        return;
      }
      return editor.languageMode.autoDecreaseIndentForBufferRow = function(bufferRow, options) {
        var currentIndentLevel, decreaseIndentRegex, decreaseNextLineIndentRegex, desiredIndentLevel, increaseIndentRegex, line, precedingLine, precedingRow, scopeDescriptor;
        if (editor.getGrammar().scopeName !== "source.js.jsx") {
          return fn.call(editor.languageMode, bufferRow, options);
        }
        scopeDescriptor = this.editor.scopeDescriptorForBufferPosition([bufferRow, 0]);
        decreaseNextLineIndentRegex = this.getRegexForProperty(scopeDescriptor, 'react.decreaseIndentForNextLinePattern');
        decreaseIndentRegex = this.decreaseIndentRegexForScopeDescriptor(scopeDescriptor);
        increaseIndentRegex = this.increaseIndentRegexForScopeDescriptor(scopeDescriptor);
        precedingRow = this.buffer.previousNonBlankRow(bufferRow);
        if (precedingRow < 0) {
          return;
        }
        precedingLine = this.buffer.lineForRow(precedingRow);
        line = this.buffer.lineForRow(bufferRow);
        if (precedingLine && decreaseNextLineIndentRegex.testSync(precedingLine) && !(increaseIndentRegex && increaseIndentRegex.testSync(precedingLine)) && !this.editor.isBufferRowCommented(precedingRow)) {
          currentIndentLevel = this.editor.indentationForBufferRow(precedingRow);
          if (decreaseIndentRegex && decreaseIndentRegex.testSync(line)) {
            currentIndentLevel -= 1;
          }
          desiredIndentLevel = currentIndentLevel - 1;
          if (desiredIndentLevel >= 0 && desiredIndentLevel < currentIndentLevel) {
            return this.editor.setIndentationForBufferRow(bufferRow, desiredIndentLevel);
          }
        } else if (!this.editor.isBufferRowCommented(bufferRow)) {
          return fn.call(editor.languageMode, bufferRow, options);
        }
      };
    };

    AtomReact.prototype.patchEditorLangModeSuggestedIndentForBufferRow = function(editor) {
      var fn, self;
      self = this;
      fn = editor.languageMode.suggestedIndentForBufferRow;
      if (fn.jsxPatch) {
        return;
      }
      return editor.languageMode.suggestedIndentForBufferRow = function(bufferRow, options) {
        var complexAttributeRegex, decreaseNextLineIndentRegex, increaseIndentRegex, indent, precedingLine, precedingRow, scopeDescriptor, tagStartRegex, tagStartTest;
        indent = fn.call(editor.languageMode, bufferRow, options);
        if (!(editor.getGrammar().scopeName === "source.js.jsx" && bufferRow > 1)) {
          return indent;
        }
        scopeDescriptor = this.editor.scopeDescriptorForBufferPosition([bufferRow, 0]);
        decreaseNextLineIndentRegex = this.getRegexForProperty(scopeDescriptor, 'react.decreaseIndentForNextLinePattern');
        increaseIndentRegex = this.increaseIndentRegexForScopeDescriptor(scopeDescriptor);
        tagStartRegex = this.getRegexForProperty(scopeDescriptor, 'react.jsxTagStartPattern');
        complexAttributeRegex = this.getRegexForProperty(scopeDescriptor, 'react.jsxComplexAttributePattern');
        precedingRow = this.buffer.previousNonBlankRow(bufferRow);
        if (precedingRow < 0) {
          return indent;
        }
        if (this.editor.isBufferRowCommented(bufferRow) && this.editor.isBufferRowCommented(precedingRow)) {
          return this.editor.indentationForBufferRow(precedingRow);
        }
        precedingLine = this.buffer.lineForRow(precedingRow);
        if (precedingLine == null) {
          return indent;
        }
        tagStartTest = tagStartRegex.testSync(precedingLine);
        if (tagStartTest && complexAttributeRegex.testSync(precedingLine) && !this.editor.isBufferRowCommented(precedingRow)) {
          indent += 1;
        }
        if (precedingLine && decreaseNextLineIndentRegex.testSync(precedingLine) && !this.editor.isBufferRowCommented(precedingRow)) {
          indent -= 1;
        }
        return Math.max(indent, 0);
      };
    };

    AtomReact.prototype.patchEditorLangMode = function(editor) {
      var _ref, _ref1;
      if ((_ref = this.patchEditorLangModeSuggestedIndentForBufferRow(editor)) != null) {
        _ref.jsxPatch = true;
      }
      return (_ref1 = this.patchEditorLangModeAutoDecreaseIndentForBufferRow(editor)) != null ? _ref1.jsxPatch = true : void 0;
    };

    AtomReact.prototype.isJSX = function(text) {
      var b, doc, docblock, _i, _len;
      docblock = require('jstransform/src/docblock');
      doc = docblock.parse(text);
      for (_i = 0, _len = doc.length; _i < _len; _i++) {
        b = doc[_i];
        if (b[0] === 'jsx') {
          return true;
        }
      }
      return false;
    };

    AtomReact.prototype.isReactEnabledForEditor = function(editor) {
      return (editor != null) && editor.getGrammar().scopeName === "source.js.jsx";
    };

    AtomReact.prototype.autoSetGrammar = function(editor) {
      var extName, jsxGrammar, path;
      if (this.isReactEnabledForEditor(editor)) {
        return;
      }
      path = require('path');
      extName = path.extname(editor.getPath());
      if (extName === ".jsx" || (extName === ".js" && this.isJSX(editor.getText()))) {
        jsxGrammar = atom.grammars.grammarsByScopeName["source.js.jsx"];
        if (jsxGrammar) {
          return editor.setGrammar(jsxGrammar);
        }
      }
    };

    AtomReact.prototype.onHTMLToJSX = function() {
      var HTMLtoJSX, converter, editor, jsxformat, selections;
      jsxformat = require('jsxformat');
      HTMLtoJSX = require('./htmltojsx');
      converter = new HTMLtoJSX({
        createClass: false
      });
      editor = atom.workspace.getActiveEditor();
      if (!this.isReactEnabledForEditor(editor)) {
        return;
      }
      selections = editor.getSelections();
      return editor.transact((function(_this) {
        return function() {
          var jsxOutput, selection, selectionText, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = selections.length; _i < _len; _i++) {
            selection = selections[_i];
            try {
              selectionText = selection.getText();
              jsxOutput = converter.convert(selectionText);
              try {
                jsxformat.setOptions({});
                jsxOutput = jsxformat.format(jsxOutput);
              } catch (_error) {}
              _results.push(selection.insertText(jsxOutput, {
                autoIndent: true
              }));
            } catch (_error) {}
          }
          return _results;
        };
      })(this));
    };

    AtomReact.prototype.onReformat = function() {
      var editor, jsxformat, selections, _;
      jsxformat = require('jsxformat');
      _ = require('lodash');
      editor = atom.workspace.getActiveEditor();
      if (!this.isReactEnabledForEditor(editor)) {
        return;
      }
      selections = editor.getSelections();
      return editor.transact((function(_this) {
        return function() {
          var bufStart, err, firstChangedLine, lastChangedLine, newLineCount, original, originalLineCount, range, result, selection, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = selections.length; _i < _len; _i++) {
            selection = selections[_i];
            try {
              bufStart = selection.getBufferRange().serialize()[0];
              jsxformat.setOptions({});
              result = jsxformat.format(selection.getText());
              selection.insertText(result, {
                autoIndent: true
              });
              _results.push(editor.setCursorBufferPosition(bufStart));
            } catch (_error) {
              err = _error;
              range = selection.getBufferRange().serialize();
              range[0][0]++;
              range[1][0]++;
              jsxformat.setOptions({
                range: range
              });
              original = editor.getText();
              try {
                result = jsxformat.format(original);
                selection.clear();
                originalLineCount = editor.getLineCount();
                editor.setText(result);
                newLineCount = editor.getLineCount();
                firstChangedLine = range[0][0] - 1;
                lastChangedLine = range[1][0] - 1 + (newLineCount - originalLineCount);
                editor.autoIndentBufferRows(firstChangedLine, lastChangedLine);
                _results.push(editor.setCursorBufferPosition([firstChangedLine, range[0][1]]));
              } catch (_error) {}
            }
          }
          return _results;
        };
      })(this));
    };

    AtomReact.prototype.processEditor = function(editor) {
      this.patchEditorLangMode(editor);
      return this.autoSetGrammar(editor);
    };

    AtomReact.prototype.deactivate = function() {
      this.disposableReformat.dispose();
      this.disposableHTMLTOJSX.dispose();
      return this.disposableProcessEditor.dispose();
    };

    AtomReact.prototype.activate = function() {
      var decreaseIndentForNextLinePattern, jsxComplexAttributePattern, jsxTagStartPattern;
      jsxTagStartPattern = '(?x)((^|=|return)\\s*<([^!/?](?!.+?(</.+?>))))';
      jsxComplexAttributePattern = '(?x)\\{ [^}"\']* $|\\( [^)"\']* $';
      decreaseIndentForNextLinePattern = '(?x) />\\s*(,|;)?\\s*$ | ^\\s*\\S+.*</[-_\\.A-Za-z0-9]+>$';
      atom.config.set("react.jsxTagStartPattern", jsxTagStartPattern);
      atom.config.set("react.jsxComplexAttributePattern", jsxComplexAttributePattern);
      atom.config.set("react.decreaseIndentForNextLinePattern", decreaseIndentForNextLinePattern);
      this.disposableReformat = atom.commands.add('atom-workspace', 'react:reformat-JSX', (function(_this) {
        return function() {
          return _this.onReformat();
        };
      })(this));
      this.disposableHTMLTOJSX = atom.commands.add('atom-workspace', 'react:HTML-to-JSX', (function(_this) {
        return function() {
          return _this.onHTMLToJSX();
        };
      })(this));
      return this.disposableProcessEditor = atom.workspace.observeTextEditors(this.processEditor.bind(this));
    };

    return AtomReact;

  })();

  module.exports = AtomReact;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFCQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsVUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUVNO0FBQ0osSUFBQSxVQUFVLENBQUMsV0FBWCxDQUF1QixTQUF2QixDQUFBLENBQUE7O0FBQ2EsSUFBQSxtQkFBQSxHQUFBLENBRGI7O0FBQUEsd0JBRUEsaURBQUEsR0FBbUQsU0FBQyxNQUFELEdBQUE7QUFDakQsVUFBQSxRQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBUCxDQUFBO0FBQUEsTUFDQSxFQUFBLEdBQUssTUFBTSxDQUFDLFlBQVksQ0FBQyw4QkFEekIsQ0FBQTtBQUVBLE1BQUEsSUFBVSxFQUFFLENBQUMsUUFBYjtBQUFBLGNBQUEsQ0FBQTtPQUZBO2FBSUEsTUFBTSxDQUFDLFlBQVksQ0FBQyw4QkFBcEIsR0FBcUQsU0FBQyxTQUFELEVBQVksT0FBWixHQUFBO0FBQ25ELFlBQUEsaUtBQUE7QUFBQSxRQUFBLElBQStELE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBbUIsQ0FBQyxTQUFwQixLQUFpQyxlQUFoRztBQUFBLGlCQUFPLEVBQUUsQ0FBQyxJQUFILENBQVEsTUFBTSxDQUFDLFlBQWYsRUFBNkIsU0FBN0IsRUFBd0MsT0FBeEMsQ0FBUCxDQUFBO1NBQUE7QUFBQSxRQUVBLGVBQUEsR0FBa0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQ0FBUixDQUF5QyxDQUFDLFNBQUQsRUFBWSxDQUFaLENBQXpDLENBRmxCLENBQUE7QUFBQSxRQUdBLDJCQUFBLEdBQThCLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixlQUFyQixFQUFzQyx3Q0FBdEMsQ0FIOUIsQ0FBQTtBQUFBLFFBSUEsbUJBQUEsR0FBc0IsSUFBQyxDQUFBLHFDQUFELENBQXVDLGVBQXZDLENBSnRCLENB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
//# sourceURL=/Users/sarah/.atom/packages/react/lib/atom-react.coffee