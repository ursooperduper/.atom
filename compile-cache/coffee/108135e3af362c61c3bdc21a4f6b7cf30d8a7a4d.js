(function() {
  var AtomReact, Subscriber, contentCheckRegex;

  Subscriber = require('emissary').Subscriber;

  contentCheckRegex = null;

  AtomReact = (function() {
    Subscriber.includeInto(AtomReact);

    AtomReact.prototype.config = {
      detectReactFilePattern: {
        type: 'string',
        "default": '/require\\([\'"]react(?:-native)?[\'"]\\)/'
      },
      jsxTagStartPattern: {
        type: 'string',
        "default": '(?x)((^|=|return)\\s*<([^!/?](?!.+?(</.+?>))))'
      },
      jsxComplexAttributePattern: {
        type: 'string',
        "default": '(?x)\\{ [^}"\']* $|\\( [^)"\']* $'
      },
      decreaseIndentForNextLinePattern: {
        type: 'string',
        "default": '(?x) />\\s*(,|;)?\\s*$ | ^\\s*\\S+.*</[-_\\.A-Za-z0-9]+>$'
      }
    };

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
        var complexAttributeRegex, decreaseIndentRegex, decreaseIndentTest, decreaseNextLineIndentRegex, increaseIndentRegex, indent, precedingLine, precedingRow, scopeDescriptor, tagStartRegex, tagStartTest;
        indent = fn.call(editor.languageMode, bufferRow, options);
        if (!(editor.getGrammar().scopeName === "source.js.jsx" && bufferRow > 1)) {
          return indent;
        }
        scopeDescriptor = this.editor.scopeDescriptorForBufferPosition([bufferRow, 0]);
        decreaseNextLineIndentRegex = this.getRegexForProperty(scopeDescriptor, 'react.decreaseIndentForNextLinePattern');
        increaseIndentRegex = this.increaseIndentRegexForScopeDescriptor(scopeDescriptor);
        decreaseIndentRegex = this.decreaseIndentRegexForScopeDescriptor(scopeDescriptor);
        tagStartRegex = this.getRegexForProperty(scopeDescriptor, 'react.jsxTagStartPattern');
        complexAttributeRegex = this.getRegexForProperty(scopeDescriptor, 'react.jsxComplexAttributePattern');
        precedingRow = this.buffer.previousNonBlankRow(bufferRow);
        if (precedingRow < 0) {
          return indent;
        }
        precedingLine = this.buffer.lineForRow(precedingRow);
        if (precedingLine == null) {
          return indent;
        }
        if (this.editor.isBufferRowCommented(bufferRow) && this.editor.isBufferRowCommented(precedingRow)) {
          return this.editor.indentationForBufferRow(precedingRow);
        }
        tagStartTest = tagStartRegex.testSync(precedingLine);
        decreaseIndentTest = decreaseIndentRegex.testSync(precedingLine);
        if (tagStartTest && complexAttributeRegex.testSync(precedingLine) && !this.editor.isBufferRowCommented(precedingRow)) {
          indent += 1;
        }
        if (precedingLine && !decreaseIndentTest && decreaseNextLineIndentRegex.testSync(precedingLine) && !this.editor.isBufferRowCommented(precedingRow)) {
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

    AtomReact.prototype.isReact = function(text) {
      var match;
      if (contentCheckRegex == null) {
        match = (atom.config.get('react.detectReactFilePattern') || '/require\\([\'"]react(?:-native)?[\'"]\\)/').match(new RegExp('^/(.*?)/([gimy]*)$'));
        contentCheckRegex = new RegExp(match[1], match[2]);
      }
      return text.match(contentCheckRegex) != null;
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
      if (extName === ".jsx" || (extName === ".js" && this.isReact(editor.getText()))) {
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
      this.disposableProcessEditor.dispose();
      return this.disposableConfigListener.dispose();
    };

    AtomReact.prototype.activate = function() {
      var decreaseIndentForNextLinePattern, jsxComplexAttributePattern, jsxTagStartPattern;
      jsxTagStartPattern = '(?x)((^|=|return)\\s*<([^!/?](?!.+?(</.+?>))))';
      jsxComplexAttributePattern = '(?x)\\{ [^}"\']* $|\\( [^)"\']* $';
      decreaseIndentForNextLinePattern = '(?x) />\\s*(,|;)?\\s*$ | ^\\s*\\S+.*</[-_\\.A-Za-z0-9]+>$';
      atom.config.set("react.jsxTagStartPattern", jsxTagStartPattern);
      atom.config.set("react.jsxComplexAttributePattern", jsxComplexAttributePattern);
      atom.config.set("react.decreaseIndentForNextLinePattern", decreaseIndentForNextLinePattern);
      this.disposableConfigListener = atom.config.observe('react.detectReactFilePattern', function(newValue) {
        return contentCheckRegex = null;
      });
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdDQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsVUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNBLGlCQUFBLEdBQW9CLElBRHBCLENBQUE7O0FBQUEsRUFHTTtBQUNKLElBQUEsVUFBVSxDQUFDLFdBQVgsQ0FBdUIsU0FBdkIsQ0FBQSxDQUFBOztBQUFBLHdCQUVBLE1BQUEsR0FDRTtBQUFBLE1BQUEsc0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyw0Q0FEVDtPQURGO0FBQUEsTUFHQSxrQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLGdEQURUO09BSkY7QUFBQSxNQU1BLDBCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsbUNBRFQ7T0FQRjtBQUFBLE1BU0EsZ0NBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUywyREFEVDtPQVZGO0tBSEYsQ0FBQTs7QUFrQmEsSUFBQSxtQkFBQSxHQUFBLENBbEJiOztBQUFBLHdCQW1CQSxpREFBQSxHQUFtRCxTQUFDLE1BQUQsR0FBQTtBQUNqRCxVQUFBLFFBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFQLENBQUE7QUFBQSxNQUNBLEVBQUEsR0FBSyxNQUFNLENBQUMsWUFBWSxDQUFDLDhCQUR6QixDQUFBO0FBRUEsTUFBQSxJQUFVLEVBQUUsQ0FBQyxRQUFiO0FBQUEsY0FBQSxDQUFBO09BRkE7YUFJQSxNQUFNLENBQUMsWUFBWSxDQUFDLDhCQUFwQixHQUFxRCxTQUFDLFNBQUQsRUFBWSxPQUFaLEdBQUE7QUFDbkQsWUFBQSxpS0FBQTtBQUFBLFFBQUEsSUFBK0QsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLFNBQXBCLEtBQWlDLGVBQWhHO0FBQUEsaUJBQU8sRUFBRSxDQUFDLElBQUgsQ0FBUSxNQUFNLENBQUMsWUFBZixFQUE2QixTQUE3QixFQUF3QyxPQUF4QyxDQUFQLENBQUE7U0FBQTtBQUFBLFFBRUEsZUFBQSxHQUFrQixJQUFDLENBQUEsTUFBTSxDQUFDLGdDQUFSLENBQXlDLENBQUMsU0FBRCxFQUFZLENBQVosQ0FBekMsQ0FGbEIsQ0FBQTtBQUFBLFFBR0EsMkJBQUEsR0FBOEIsSUFBQyxDQUFBLG1CQUFELENBQXFCLGVBQXJCLEVBQXNDLHdDQUF0QyxDQUg5QixDQUFBO0FBQUEsUUFJQSxtQkFBQSxHQUFzQixJQUFDLENBQUEscUNBQUQsQ0FBdUMsZUFBdkMsQ0FKdEIsQ0FBQTtBQUFBLFFBS0EsbUJBQUEsR0FBc0IsSUFBQyxDQUFBLHFDQUFELENBQXVDLGVBQXZDLENBTHRCLENBQUE7QUFBQSxRQU9BLFlBQUEsR0FBZSxJQUFDLENBQUEsTUFBTSxDQUFDLG1CQUFSLENBQTRCLFNBQTVCLENBUGYsQ0FBQTtBQVNBLFFBQUEsSUFBVSxZQUFBLEdBQWUsQ0FBekI7QUFBQSxnQkFBQSxDQUFBO1NBVEE7QUFBQSxRQVdBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLFlBQW5CLENBWGhCLENBQUE7QUFBQSxRQVlBLElBQUEsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBbUIsU0FBbkIsQ0FaUCxDQUFBO0FBY0EsUUFBQSxJQUFHLGFBQUEsSUFBa0IsMkJBQTJCLENBQUMsUUFBNUIsQ0FBcUMsYUFBckMsQ0FBbEIsSUFDQSxDQUFBLENBQUssbUJBQUEsSUFBd0IsbUJBQW1CLENBQUMsUUFBcEIsQ0FBNkIsYUFBN0IsQ0FBekIsQ0FESixJQUVBLENBQUEsSUFBSyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixZQUE3QixDQUZQO0FBR0UsVUFBQSxrQkFBQSxHQUFxQixJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQWdDLFlBQWhDLENBQXJCLENBQUE7QUFDQSxVQUFBLElBQTJCLG1CQUFBLElBQXdCLG1CQUFtQixDQUFDLFFBQXBCLENBQTZCLElBQTdCLENBQW5EO0FBQUEsWUFBQSxrQkFBQSxJQUFzQixDQUF0QixDQUFBO1dBREE7QUFBQSxVQUVBLGtCQUFBLEdBQXFCLGtCQUFBLEdBQXFCLENBRjFDLENBQUE7QUFHQSxVQUFBLElBQUcsa0JBQUEsSUFBc0IsQ0FBdEIsSUFBNEIsa0JBQUEsR0FBcUIsa0JBQXBEO21CQUNFLElBQUMsQ0FBQSxNQUFNLENBQUMsMEJBQVIsQ0FBbUMsU0FBbkMsRUFBOEMsa0JBQTlDLEVBREY7V0FORjtTQUFBLE1BUUssSUFBRyxDQUFBLElBQUssQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsU0FBN0IsQ0FBUDtpQkFDSCxFQUFFLENBQUMsSUFBSCxDQUFRLE1BQU0sQ0FBQyxZQUFmLEVBQTZCLFNBQTdCLEVBQXdDLE9BQXhDLEVBREc7U0F2QjhDO01BQUEsRUFMSjtJQUFBLENBbkJuRCxDQUFBOztBQUFBLHdCQWtEQSw4Q0FBQSxHQUFnRCxTQUFDLE1BQUQsR0FBQTtBQUM5QyxVQUFBLFFBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFQLENBQUE7QUFBQSxNQUNBLEVBQUEsR0FBSyxNQUFNLENBQUMsWUFBWSxDQUFDLDJCQUR6QixDQUFBO0FBRUEsTUFBQSxJQUFVLEVBQUUsQ0FBQyxRQUFiO0FBQUEsY0FBQSxDQUFBO09BRkE7YUFJQSxNQUFNLENBQUMsWUFBWSxDQUFDLDJCQUFwQixHQUFrRCxTQUFDLFNBQUQsRUFBWSxPQUFaLEdBQUE7QUFDaEQsWUFBQSxtTUFBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLEVBQUUsQ0FBQyxJQUFILENBQVEsTUFBTSxDQUFDLFlBQWYsRUFBNkIsU0FBN0IsRUFBd0MsT0FBeEMsQ0FBVCxDQUFBO0FBQ0EsUUFBQSxJQUFBLENBQUEsQ0FBcUIsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLFNBQXBCLEtBQWlDLGVBQWpDLElBQXFELFNBQUEsR0FBWSxDQUF0RixDQUFBO0FBQUEsaUJBQU8sTUFBUCxDQUFBO1NBREE7QUFBQSxRQUdBLGVBQUEsR0FBa0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQ0FBUixDQUF5QyxDQUFDLFNBQUQsRUFBWSxDQUFaLENBQXpDLENBSGxCLENBQUE7QUFBQSxRQUlBLDJCQUFBLEdBQThCLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixlQUFyQixFQUFzQyx3Q0FBdEMsQ0FKOUIsQ0FBQTtBQUFBLFFBS0EsbUJBQUEsR0FBc0IsSUFBQyxDQUFBLHFDQUFELENBQXVDLGVBQXZDLENBTHRCLENBQUE7QUFBQSxRQU1BLG1CQUFBLEdBQXNCLElBQUMsQ0FBQSxxQ0FBRCxDQUF1QyxlQUF2QyxDQU50QixDQUFBO0FBQUEsUUFPQSxhQUFBLEdBQWdCLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixlQUFyQixFQUFzQywwQkFBdEMsQ0FQaEIsQ0FBQTtBQUFBLFFBUUEscUJBQUEsR0FBd0IsSUFBQyxDQUFBLG1CQUFELENBQXFCLGVBQXJCLEVBQXNDLGtDQUF0QyxDQVJ4QixDQUFBO0FBQUEsUUFVQSxZQUFBLEdBQWUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBUixDQUE0QixTQUE1QixDQVZmLENBQUE7QUFZQSxRQUFBLElBQWlCLFlBQUEsR0FBZSxDQUFoQztBQUFBLGlCQUFPLE1BQVAsQ0FBQTtTQVpBO0FBQUEsUUFjQSxhQUFBLEdBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixZQUFuQixDQWRoQixDQUFBO0FBZ0JBLFFBQUEsSUFBcUIscUJBQXJCO0FBQUEsaUJBQU8sTUFBUCxDQUFBO1NBaEJBO0FBa0JBLFFBQUEsSUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLFNBQTdCLENBQUEsSUFBNEMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixZQUE3QixDQUEvQztBQUNFLGlCQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBZ0MsWUFBaEMsQ0FBUCxDQURGO1NBbEJBO0FBQUEsUUFxQkEsWUFBQSxHQUFlLGFBQWEsQ0FBQyxRQUFkLENBQXVCLGFBQXZCLENBckJmLENBQUE7QUFBQSxRQXNCQSxrQkFBQSxHQUFxQixtQkFBbUIsQ0FBQyxRQUFwQixDQUE2QixhQUE3QixDQXRCckIsQ0FBQTtBQXdCQSxRQUFBLElBQWUsWUFBQSxJQUFpQixxQkFBcUIsQ0FBQyxRQUF0QixDQUErQixhQUEvQixDQUFqQixJQUFtRSxDQUFBLElBQUssQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsWUFBN0IsQ0FBdEY7QUFBQSxVQUFBLE1BQUEsSUFBVSxDQUFWLENBQUE7U0F4QkE7QUF5QkEsUUFBQSxJQUFlLGFBQUEsSUFBa0IsQ0FBQSxrQkFBbEIsSUFBNkMsMkJBQTJCLENBQUMsUUFBNUIsQ0FBcUMsYUFBckMsQ0FBN0MsSUFBcUcsQ0FBQSxJQUFLLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLFlBQTdCLENBQXhIO0FBQUEsVUFBQSxNQUFBLElBQVUsQ0FBVixDQUFBO1NBekJBO0FBMkJBLGVBQU8sSUFBSSxDQUFDLEdBQUwsQ0FBUyxNQUFULEVBQWlCLENBQWpCLENBQVAsQ0E1QmdEO01BQUEsRUFMSjtJQUFBLENBbERoRCxDQUFBOztBQUFBLHdCQXFGQSxtQkFBQSxHQUFxQixTQUFDLE1BQUQsR0FBQTtBQUNuQixVQUFBLFdBQUE7O1lBQXVELENBQUUsUUFBekQsR0FBb0U7T0FBcEU7cUdBQzBELENBQUUsUUFBNUQsR0FBdUUsY0FGcEQ7SUFBQSxDQXJGckIsQ0FBQTs7QUFBQSx3QkF5RkEsT0FBQSxHQUFTLFNBQUMsSUFBRCxHQUFBO0FBQ1AsVUFBQSxLQUFBO0FBQUEsTUFBQSxJQUFPLHlCQUFQO0FBQ0UsUUFBQSxLQUFBLEdBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsOEJBQWhCLENBQUEsSUFBbUQsNENBQXBELENBQWlHLENBQUMsS0FBbEcsQ0FBNEcsSUFBQSxNQUFBLENBQU8sb0JBQVAsQ0FBNUcsQ0FBUixDQUFBO0FBQUEsUUFDQSxpQkFBQSxHQUF3QixJQUFBLE1BQUEsQ0FBTyxLQUFNLENBQUEsQ0FBQSxDQUFiLEVBQWlCLEtBQU0sQ0FBQSxDQUFBLENBQXZCLENBRHhCLENBREY7T0FBQTtBQUdBLGFBQU8scUNBQVAsQ0FKTztJQUFBLENBekZULENBQUE7O0FBQUEsd0JBK0ZBLHVCQUFBLEdBQXlCLFNBQUMsTUFBRCxHQUFBO0FBQ3ZCLGFBQU8sZ0JBQUEsSUFBVyxNQUFNLENBQUMsVUFBUCxDQUFBLENBQW1CLENBQUMsU0FBcEIsS0FBaUMsZUFBbkQsQ0FEdUI7SUFBQSxDQS9GekIsQ0FBQTs7QUFBQSx3QkFrR0EsY0FBQSxHQUFnQixTQUFDLE1BQUQsR0FBQTtBQUNkLFVBQUEseUJBQUE7QUFBQSxNQUFBLElBQVUsSUFBQyxDQUFBLHVCQUFELENBQXlCLE1BQXpCLENBQVY7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTtBQUFBLE1BS0EsT0FBQSxHQUFVLElBQUksQ0FBQyxPQUFMLENBQWEsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFiLENBTFYsQ0FBQTtBQU1BLE1BQUEsSUFBRyxPQUFBLEtBQVcsTUFBWCxJQUFxQixDQUFDLE9BQUEsS0FBVyxLQUFYLElBQXFCLElBQUMsQ0FBQSxPQUFELENBQVMsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFULENBQXRCLENBQXhCO0FBQ0UsUUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBb0IsQ0FBQSxlQUFBLENBQS9DLENBQUE7QUFDQSxRQUFBLElBQWdDLFVBQWhDO2lCQUFBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFVBQWxCLEVBQUE7U0FGRjtPQVBjO0lBQUEsQ0FsR2hCLENBQUE7O0FBQUEsd0JBNkdBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxVQUFBLG1EQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLFdBQVIsQ0FBWixDQUFBO0FBQUEsTUFDQSxTQUFBLEdBQVksT0FBQSxDQUFRLGFBQVIsQ0FEWixDQUFBO0FBQUEsTUFFQSxTQUFBLEdBQWdCLElBQUEsU0FBQSxDQUFVO0FBQUEsUUFBQSxXQUFBLEVBQWEsS0FBYjtPQUFWLENBRmhCLENBQUE7QUFBQSxNQUlBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FBQSxDQUpULENBQUE7QUFNQSxNQUFBLElBQVUsQ0FBQSxJQUFLLENBQUEsdUJBQUQsQ0FBeUIsTUFBekIsQ0FBZDtBQUFBLGNBQUEsQ0FBQTtPQU5BO0FBQUEsTUFRQSxVQUFBLEdBQWEsTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQVJiLENBQUE7YUFVQSxNQUFNLENBQUMsUUFBUCxDQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2QsY0FBQSx1REFBQTtBQUFBO2VBQUEsaURBQUE7dUNBQUE7QUFDRTtBQUNFLGNBQUEsYUFBQSxHQUFnQixTQUFTLENBQUMsT0FBVixDQUFBLENBQWhCLENBQUE7QUFBQSxjQUNBLFNBQUEsR0FBWSxTQUFTLENBQUMsT0FBVixDQUFrQixhQUFsQixDQURaLENBQUE7QUFHQTtBQUNFLGdCQUFBLFNBQVMsQ0FBQyxVQUFWLENBQXFCLEVBQXJCLENBQUEsQ0FBQTtBQUFBLGdCQUNBLFNBQUEsR0FBWSxTQUFTLENBQUMsTUFBVixDQUFpQixTQUFqQixDQURaLENBREY7ZUFBQSxrQkFIQTtBQUFBLDRCQU9BLFNBQVMsQ0FBQyxVQUFWLENBQXFCLFNBQXJCLEVBQWdDO0FBQUEsZ0JBQUEsVUFBQSxFQUFZLElBQVo7ZUFBaEMsRUFQQSxDQURGO2FBQUEsa0JBREY7QUFBQTswQkFEYztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCLEVBWFc7SUFBQSxDQTdHYixDQUFBOztBQUFBLHdCQW9JQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxnQ0FBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBQVosQ0FBQTtBQUFBLE1BQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBREosQ0FBQTtBQUFBLE1BR0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUFBLENBSFQsQ0FBQTtBQUtBLE1BQUEsSUFBVSxDQUFBLElBQUssQ0FBQSx1QkFBRCxDQUF5QixNQUF6QixDQUFkO0FBQUEsY0FBQSxDQUFBO09BTEE7QUFBQSxNQU9BLFVBQUEsR0FBYSxNQUFNLENBQUMsYUFBUCxDQUFBLENBUGIsQ0FBQTthQVFBLE1BQU0sQ0FBQyxRQUFQLENBQWdCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDZCxjQUFBLHlJQUFBO0FBQUE7ZUFBQSxpREFBQTt1Q0FBQTtBQUNFO0FBQ0UsY0FBQSxRQUFBLEdBQVcsU0FBUyxDQUFDLGNBQVYsQ0FBQSxDQUEwQixDQUFDLFNBQTNCLENBQUEsQ0FBdUMsQ0FBQSxDQUFBLENBQWxELENBQUE7QUFBQSxjQUNBLFNBQVMsQ0FBQyxVQUFWLENBQXFCLEVBQXJCLENBREEsQ0FBQTtBQUFBLGNBRUEsTUFBQSxHQUFTLFNBQVMsQ0FBQyxNQUFWLENBQWlCLFNBQVMsQ0FBQyxPQUFWLENBQUEsQ0FBakIsQ0FGVCxDQUFBO0FBQUEsY0FHQSxTQUFTLENBQUMsVUFBVixDQUFxQixNQUFyQixFQUE2QjtBQUFBLGdCQUFBLFVBQUEsRUFBWSxJQUFaO2VBQTdCLENBSEEsQ0FBQTtBQUFBLDRCQUlBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixRQUEvQixFQUpBLENBREY7YUFBQSxjQUFBO0FBUUUsY0FGSSxZQUVKLENBQUE7QUFBQSxjQUFBLEtBQUEsR0FBUSxTQUFTLENBQUMsY0FBVixDQUFBLENBQTBCLENBQUMsU0FBM0IsQ0FBQSxDQUFSLENBQUE7QUFBQSxjQUVBLEtBQU0sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQVQsRUFGQSxDQUFBO0FBQUEsY0FHQSxLQUFNLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFULEVBSEEsQ0FBQTtBQUFBLGNBS0EsU0FBUyxDQUFDLFVBQVYsQ0FBcUI7QUFBQSxnQkFBQyxLQUFBLEVBQU8sS0FBUjtlQUFyQixDQUxBLENBQUE7QUFBQSxjQVFBLFFBQUEsR0FBVyxNQUFNLENBQUMsT0FBUCxDQUFBLENBUlgsQ0FBQTtBQVVBO0FBQ0UsZ0JBQUEsTUFBQSxHQUFTLFNBQVMsQ0FBQyxNQUFWLENBQWlCLFFBQWpCLENBQVQsQ0FBQTtBQUFBLGdCQUNBLFNBQVMsQ0FBQyxLQUFWLENBQUEsQ0FEQSxDQUFBO0FBQUEsZ0JBR0EsaUJBQUEsR0FBb0IsTUFBTSxDQUFDLFlBQVAsQ0FBQSxDQUhwQixDQUFBO0FBQUEsZ0JBSUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxNQUFmLENBSkEsQ0FBQTtBQUFBLGdCQUtBLFlBQUEsR0FBZSxNQUFNLENBQUMsWUFBUCxDQUFBLENBTGYsQ0FBQTtBQUFBLGdCQU9BLGdCQUFBLEdBQW1CLEtBQU0sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQVQsR0FBYyxDQVBqQyxDQUFBO0FBQUEsZ0JBUUEsZUFBQSxHQUFrQixLQUFNLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFULEdBQWMsQ0FBZCxHQUFrQixDQUFDLFlBQUEsR0FBZSxpQkFBaEIsQ0FScEMsQ0FBQTtBQUFBLGdCQVVBLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixnQkFBNUIsRUFBOEMsZUFBOUMsQ0FWQSxDQUFBO0FBQUEsOEJBYUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsZ0JBQUQsRUFBbUIsS0FBTSxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBNUIsQ0FBL0IsRUFiQSxDQURGO2VBQUEsa0JBbEJGO2FBREY7QUFBQTswQkFEYztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCLEVBVFU7SUFBQSxDQXBJWixDQUFBOztBQUFBLHdCQWtMQSxhQUFBLEdBQWUsU0FBQyxNQUFELEdBQUE7QUFDYixNQUFBLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixNQUFyQixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsY0FBRCxDQUFnQixNQUFoQixFQUZhO0lBQUEsQ0FsTGYsQ0FBQTs7QUFBQSx3QkFzTEEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLGtCQUFrQixDQUFDLE9BQXBCLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsbUJBQW1CLENBQUMsT0FBckIsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSx1QkFBdUIsQ0FBQyxPQUF6QixDQUFBLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSx3QkFBd0IsQ0FBQyxPQUExQixDQUFBLEVBSlU7SUFBQSxDQXRMWixDQUFBOztBQUFBLHdCQTRMQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBRVIsVUFBQSxnRkFBQTtBQUFBLE1BQUEsa0JBQUEsR0FBcUIsZ0RBQXJCLENBQUE7QUFBQSxNQUNBLDBCQUFBLEdBQTZCLG1DQUQ3QixDQUFBO0FBQUEsTUFFQSxnQ0FBQSxHQUFtQywyREFGbkMsQ0FBQTtBQUFBLE1BTUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQixFQUE0QyxrQkFBNUMsQ0FOQSxDQUFBO0FBQUEsTUFPQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0NBQWhCLEVBQW9ELDBCQUFwRCxDQVBBLENBQUE7QUFBQSxNQVFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3Q0FBaEIsRUFBMEQsZ0NBQTFELENBUkEsQ0FBQTtBQUFBLE1BV0EsSUFBQyxDQUFBLHdCQUFELEdBQTRCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQiw4QkFBcEIsRUFBb0QsU0FBQyxRQUFELEdBQUE7ZUFDOUUsaUJBQUEsR0FBb0IsS0FEMEQ7TUFBQSxDQUFwRCxDQVg1QixDQUFBO0FBQUEsTUFjQSxJQUFDLENBQUEsa0JBQUQsR0FBc0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxvQkFBcEMsRUFBMEQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsVUFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExRCxDQWR0QixDQUFBO0FBQUEsTUFlQSxJQUFDLENBQUEsbUJBQUQsR0FBdUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxtQkFBcEMsRUFBeUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsV0FBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6RCxDQWZ2QixDQUFBO2FBZ0JBLElBQUMsQ0FBQSx1QkFBRCxHQUEyQixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLElBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUFvQixJQUFwQixDQUFsQyxFQWxCbkI7SUFBQSxDQTVMVixDQUFBOztxQkFBQTs7TUFKRixDQUFBOztBQUFBLEVBcU5BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBck5qQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/sarah/.atom/packages/react/lib/atom-react.coffee