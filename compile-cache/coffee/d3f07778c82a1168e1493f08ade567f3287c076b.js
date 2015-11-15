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
      return editor.languageMode.suggestedIndentForBufferRow = function(bufferRow, options) {
        var complexAttributeRegex, decreaseNextLineIndentRegex, increaseIndentRegex, indent, precedingLine, precedingRow, scopeDescriptor, tagStartRegex;
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
        if (tagStartRegex.testSync(precedingLine) && complexAttributeRegex.testSync(precedingLine) && !this.editor.isBufferRowCommented(precedingRow)) {
          indent += 1;
        }
        if (precedingLine && decreaseNextLineIndentRegex.testSync(precedingLine) && !this.editor.isBufferRowCommented(precedingRow)) {
          indent -= 1;
        }
        return Math.max(indent, 0);
      };
    };

    AtomReact.prototype.patchEditorLangMode = function(editor) {
      this.patchEditorLangModeSuggestedIndentForBufferRow(editor);
      return this.patchEditorLangModeAutoDecreaseIndentForBufferRow(editor);
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

    AtomReact.prototype.activate = function() {
      var decreaseIndentForNextLinePattern, jsxComplexAttributePattern, jsxTagStartPattern;
      jsxTagStartPattern = '(?x)((^|=|return)\\s*<([^!/?](?!.+?(</.+?>))))';
      jsxComplexAttributePattern = '(?x)\\{ [^}"\']* $|\\( [^)"\']* $';
      decreaseIndentForNextLinePattern = '/>\\s*(,|;)?\\s*$';
      atom.config.set("react.jsxTagStartPattern", jsxTagStartPattern);
      atom.config.set("react.jsxComplexAttributePattern", jsxComplexAttributePattern);
      atom.config.set("react.decreaseIndentForNextLinePattern", decreaseIndentForNextLinePattern);
      atom.commands.add('atom-workspace', 'react:reformat-JSX', (function(_this) {
        return function() {
          return _this.onReformat();
        };
      })(this));
      atom.commands.add('atom-workspace', 'react:HTML-to-JSX', (function(_this) {
        return function() {
          return _this.onHTMLToJSX();
        };
      })(this));
      return atom.workspace.observeTextEditors(this.processEditor.bind(this));
    };

    return AtomReact;

  })();

  module.exports = AtomReact;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFCQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsVUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUVNO0FBQ0osSUFBQSxVQUFVLENBQUMsV0FBWCxDQUF1QixTQUF2QixDQUFBLENBQUE7O0FBQ2EsSUFBQSxtQkFBQSxHQUFBLENBRGI7O0FBQUEsd0JBRUEsaURBQUEsR0FBbUQsU0FBQyxNQUFELEdBQUE7QUFDakQsVUFBQSxRQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBUCxDQUFBO0FBQUEsTUFDQSxFQUFBLEdBQUssTUFBTSxDQUFDLFlBQVksQ0FBQyw4QkFEekIsQ0FBQTthQUVBLE1BQU0sQ0FBQyxZQUFZLENBQUMsOEJBQXBCLEdBQXFELFNBQUMsU0FBRCxFQUFZLE9BQVosR0FBQTtBQUNuRCxZQUFBLGlLQUFBO0FBQUEsUUFBQSxJQUErRCxNQUFNLENBQUMsVUFBUCxDQUFBLENBQW1CLENBQUMsU0FBcEIsS0FBaUMsZUFBaEc7QUFBQSxpQkFBTyxFQUFFLENBQUMsSUFBSCxDQUFRLE1BQU0sQ0FBQyxZQUFmLEVBQTZCLFNBQTdCLEVBQXdDLE9BQXhDLENBQVAsQ0FBQTtTQUFBO0FBQUEsUUFFQSxlQUFBLEdBQWtCLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0NBQVIsQ0FBeUMsQ0FBQyxTQUFELEVBQVksQ0FBWixDQUF6QyxDQUZsQixDQUFBO0FBQUEsUUFHQSwyQkFBQSxHQUE4QixJQUFDLENBQUEsbUJBQUQsQ0FBcUIsZUFBckIsRUFBc0Msd0NBQXRDLENBSDlCLENBQUE7QUFBQSxRQUlBLG1CQUFBLEdBQXNCLElBQUMsQ0FBQSxxQ0FBRCxDQUF1QyxlQUF2QyxDQUp0QixDQUFBO0FBQUEsUUFLQSxtQkFBQSxHQUFzQixJQUFDLENBQUEscUNBQUQsQ0FBdUMsZUFB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
//# sourceURL=/Users/sarah/.atom/packages/react/lib/atom-react.coffee