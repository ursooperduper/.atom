(function() {
  var CompositeDisposable, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  path = require('path');

  module.exports = {
    config: {
      executablePath: {
        type: 'string',
        "default": path.join(__dirname, '..', 'node_modules', 'jshint', 'bin', 'jshint'),
        description: 'Path of the `jshint` executable.'
      },
      lintInlineJavaScript: {
        type: 'boolean',
        "default": false,
        description: 'Lint JavaScript inside `<script>` blocks in HTML or PHP files.'
      },
      disableWhenNoJshintrcFileInPath: {
        type: 'boolean',
        "default": false,
        description: 'Disable linter when no `.jshintrc` is found in project.'
      }
    },
    activate: function() {
      var scopeEmbedded;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-jshint.executablePath', (function(_this) {
        return function(executablePath) {
          return _this.executablePath = executablePath;
        };
      })(this)));
      scopeEmbedded = 'source.js.embedded.html';
      this.scopes = ['source.js', 'source.js.jsx', 'source.js-semantic'];
      this.subscriptions.add(atom.config.observe('linter-jshint.lintInlineJavaScript', (function(_this) {
        return function(lintInlineJavaScript) {
          if (lintInlineJavaScript) {
            if (__indexOf.call(_this.scopes, scopeEmbedded) < 0) {
              return _this.scopes.push(scopeEmbedded);
            }
          } else {
            if (__indexOf.call(_this.scopes, scopeEmbedded) >= 0) {
              return _this.scopes.splice(_this.scopes.indexOf(scopeEmbedded), 1);
            }
          }
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter-jshint.disableWhenNoJshintrcFileInPath', (function(_this) {
        return function(disableWhenNoJshintrcFileInPath) {
          return _this.disableWhenNoJshintrcFileInPath = disableWhenNoJshintrcFileInPath;
        };
      })(this)));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var helpers, provider, reporter;
      helpers = require('atom-linter');
      reporter = require('jshint-json');
      return provider = {
        grammarScopes: this.scopes,
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(textEditor) {
            var filePath, parameters, text;
            filePath = textEditor.getPath();
            if (_this.disableWhenNoJshintrcFileInPath && !helpers.findFile(filePath, '.jshintrc')) {
              return [];
            }
            text = textEditor.getText();
            parameters = ['--reporter', reporter, '--filename', filePath];
            if (textEditor.getGrammar().scopeName.indexOf('text.html') !== -1 && __indexOf.call(_this.scopes, 'source.js.embedded.html') >= 0) {
              parameters.push('--extract', 'always');
            }
            parameters.push('-');
            return helpers.execNode(_this.executablePath, parameters, {
              stdin: text
            }).then(function(output) {
              if (!output.length) {
                return [];
              }
              output = JSON.parse(output).result;
              output = output.filter(function(entry) {
                return entry.error.id;
              });
              return output.map(function(entry) {
                var error, pointEnd, pointStart, type;
                error = entry.error;
                pointStart = [error.line - 1, error.character - 1];
                pointEnd = [error.line - 1, error.character];
                type = error.code.substr(0, 1);
                return {
                  type: type === 'E' ? 'Error' : type === 'W' ? 'Warning' : 'Info',
                  text: "" + error.code + " - " + error.reason,
                  filePath: filePath,
                  range: [pointStart, pointEnd]
                };
              });
            });
          };
        })(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1qc2hpbnQvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLGNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsSUFBckIsRUFBMkIsY0FBM0IsRUFBMkMsUUFBM0MsRUFBcUQsS0FBckQsRUFBNEQsUUFBNUQsQ0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLGtDQUZiO09BREY7QUFBQSxNQUlBLG9CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLGdFQUZiO09BTEY7QUFBQSxNQVFBLCtCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLHlEQUZiO09BVEY7S0FERjtBQUFBLElBY0EsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsYUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxP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

//# sourceURL=/Users/sarah/.atom/packages/linter-jshint/lib/main.coffee
