(function() {
  var AtomReact, Subscriber, docblock, isJSX, path;

  path = require('path');

  docblock = require('jstransform/src/docblock');

  Subscriber = require('emissary').Subscriber;

  isJSX = function(text) {
    var b, doc, _i, _len;
    doc = docblock.parse(text);
    for (_i = 0, _len = doc.length; _i < _len; _i++) {
      b = doc[_i];
      if (b[0] === 'jsx') {
        return true;
      }
    }
    return false;
  };

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
        if (precedingLine && decreaseNextLineIndentRegex.testSync(precedingLine) && !(increaseIndentRegex && increaseIndentRegex.testSync(precedingLine))) {
          currentIndentLevel = this.editor.indentationForBufferRow(precedingRow);
          if (decreaseIndentRegex && decreaseIndentRegex.testSync(line)) {
            currentIndentLevel -= 1;
          }
          desiredIndentLevel = currentIndentLevel - 1;
          if (desiredIndentLevel >= 0 && desiredIndentLevel < currentIndentLevel) {
            return this.editor.setIndentationForBufferRow(bufferRow, desiredIndentLevel);
          }
        } else {
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
        precedingLine = this.buffer.lineForRow(precedingRow);
        if (precedingLine == null) {
          return indent;
        }
        if (tagStartRegex.testSync(precedingLine) && complexAttributeRegex.testSync(precedingLine)) {
          indent += 1;
        }
        if (precedingLine && decreaseNextLineIndentRegex.testSync(precedingLine)) {
          indent -= 1;
        }
        return Math.max(indent, 0);
      };
    };

    AtomReact.prototype.patchEditorLangMode = function(editor) {
      this.patchEditorLangModeSuggestedIndentForBufferRow(editor);
      return this.patchEditorLangModeAutoDecreaseIndentForBufferRow(editor);
    };

    AtomReact.prototype.autoSetGrammar = function(editor) {
      var jsxGrammar;
      if (path.extname(editor.getPath()) === ".jsx" || isJSX(editor.getText())) {
        jsxGrammar = atom.syntax.grammarsByScopeName["source.js.jsx"];
        if (jsxGrammar) {
          return editor.setGrammar(jsxGrammar);
        }
      }
    };

    AtomReact.prototype.activate = function() {
      var decreaseIndentForNextLinePattern, editor, jsxComplexAttributePattern, jsxTagStartPattern, _i, _j, _len, _len1, _ref, _ref1;
      jsxTagStartPattern = '(?x)((^|=|return)\\s*<([^!/?](?!.+?(</.+?>))))';
      jsxComplexAttributePattern = '(?x)\\{ [^}"\']* $|\\( [^)"\']* $';
      decreaseIndentForNextLinePattern = '/>\\s*,?\\s*$';
      atom.config.set("react.jsxTagStartPattern", jsxTagStartPattern);
      atom.config.set("react.jsxComplexAttributePattern", jsxComplexAttributePattern);
      atom.config.set("react.decreaseIndentForNextLinePattern", decreaseIndentForNextLinePattern);
      _ref = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        editor = _ref[_i];
        this.patchEditorLangMode(editor);
      }
      _ref1 = atom.workspace.getTextEditors();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        editor = _ref1[_j];
        this.autoSetGrammar(editor);
      }
      return this.subscribe(atom.workspace.onDidAddTextEditor((function(_this) {
        return function(event) {
          editor = event.textEditor;
          _this.patchEditorLangMode(editor);
          return _this.autoSetGrammar(editor);
        };
      })(this)));
    };

    return AtomReact;

  })();

  module.exports = new AtomReact;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFTLE9BQUEsQ0FBUSxNQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsMEJBQVIsQ0FEWCxDQUFBOztBQUFBLEVBR0MsYUFBYyxPQUFBLENBQVEsVUFBUixFQUFkLFVBSEQsQ0FBQTs7QUFBQSxFQU1BLEtBQUEsR0FBUSxTQUFDLElBQUQsR0FBQTtBQUNOLFFBQUEsZ0JBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxRQUFRLENBQUMsS0FBVCxDQUFlLElBQWYsQ0FBTixDQUFBO0FBQ0EsU0FBQSwwQ0FBQTtrQkFBQTtBQUNFLE1BQUEsSUFBZSxDQUFFLENBQUEsQ0FBQSxDQUFGLEtBQVEsS0FBdkI7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQURGO0FBQUEsS0FEQTtXQUdBLE1BSk07RUFBQSxDQU5SLENBQUE7O0FBQUEsRUFZTTtBQUNKLElBQUEsVUFBVSxDQUFDLFdBQVgsQ0FBdUIsU0FBdkIsQ0FBQSxDQUFBOztBQUNhLElBQUEsbUJBQUEsR0FBQSxDQURiOztBQUFBLHdCQUVBLGlEQUFBLEdBQW1ELFNBQUMsTUFBRCxHQUFBO0FBQ2pELFVBQUEsUUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQVAsQ0FBQTtBQUFBLE1BQ0EsRUFBQSxHQUFLLE1BQU0sQ0FBQyxZQUFZLENBQUMsOEJBRHpCLENBQUE7YUFFQSxNQUFNLENBQUMsWUFBWSxDQUFDLDhCQUFwQixHQUFxRCxTQUFDLFNBQUQsRUFBWSxPQUFaLEdBQUE7QUFDbkQsWUFBQSxpS0FBQTtBQUFBLFFBQUEsSUFBK0QsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLFNBQXBCLEtBQWlDLGVBQWhHO0FBQUEsaUJBQU8sRUFBRSxDQUFDLElBQUgsQ0FB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
//# sourceURL=/Users/sarah/.atom/packages/react/index.coffee