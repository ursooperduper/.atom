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
        name: 'JSHint',
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1qc2hpbnQvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLGNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsSUFBckIsRUFBMkIsY0FBM0IsRUFBMkMsUUFBM0MsRUFBcUQsS0FBckQsRUFBNEQsUUFBNUQsQ0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLGtDQUZiO09BREY7QUFBQSxNQUlBLG9CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLGdFQUZiO09BTEY7QUFBQSxNQVFBLCtCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLHlEQUZiO09BVEY7S0FERjtBQUFBLElBY0EsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsYUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLDhCQUFwQixFQUNqQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxjQUFELEdBQUE7aUJBQ0UsS0FBQyxDQUFBLGNBQUQsR0FBa0IsZUFEcEI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURpQixDQUFuQixDQURBLENBQUE7QUFBQSxNQUlBLGFBQUEsR0FBZ0IseUJBSmhCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBQyxXQUFELEVBQWMsZUFBZCxFQUErQixvQkFBL0IsQ0FMVixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLG9DQUFwQixFQUNqQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxvQkFBRCxHQUFBO0FBQ0UsVUFBQSxJQUFHLG9CQUFIO0FBQ0UsWUFBQSxJQUFtQyxlQUFpQixLQUFDLENBQUEsTUFBbEIsRUFBQSxhQUFBLEtBQW5DO3FCQUFBLEtBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLGFBQWIsRUFBQTthQURGO1dBQUEsTUFBQTtBQUdFLFlBQUEsSUFBcUQsZUFBaUIsS0FBQyxDQUFBLE1BQWxCLEVBQUEsYUFBQSxNQUFyRDtxQkFBQSxLQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsQ0FBZSxLQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBZ0IsYUFBaEIsQ0FBZixFQUErQyxDQUEvQyxFQUFBO2FBSEY7V0FERjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGlCLENBQW5CLENBTkEsQ0FBQTthQVlBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsK0NBQXBCLEVBQ2pCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLCtCQUFELEdBQUE7aUJBQ0UsS0FBQyxDQUFBLCtCQUFELEdBQW1DLGdDQURyQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGlCLENBQW5CLEVBYlE7SUFBQSxDQWRWO0FBQUEsSUErQkEsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLEVBRFU7SUFBQSxDQS9CWjtBQUFBLElBa0NBLGFBQUEsRUFBZSxTQUFBLEdBQUE7QUFDYixVQUFBLDJCQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGFBQVIsQ0FBVixDQUFBO0FBQUEsTUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FEWCxDQUFBO2FBRUEsUUFBQSxHQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsYUFBQSxFQUFlLElBQUMsQ0FBQSxNQURoQjtBQUFBLFFBRUEsS0FBQSxFQUFPLE1BRlA7QUFBQSxRQUdBLFNBQUEsRUFBVyxJQUhYO0FBQUEsUUFJQSxJQUFBLEVBQU0sQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLFVBQUQsR0FBQTtBQUNKLGdCQUFBLDBCQUFBO0FBQUEsWUFBQSxRQUFBLEdBQVcsVUFBVSxDQUFDLE9BQVgsQ0FBQSxDQUFYLENBQUE7QUFDQSxZQUFBLElBQUcsS0FBQyxDQUFBLCtCQUFELElBQXFDLENBQUEsT0FBVyxDQUFDLFFBQVIsQ0FBaUIsUUFBakIsRUFBMkIsV0FBM0IsQ0FBNUM7QUFDRSxxQkFBTyxFQUFQLENBREY7YUFEQTtBQUFBLFlBSUEsSUFBQSxHQUFPLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FKUCxDQUFBO0FBQUEsWUFLQSxVQUFBLEdBQWEsQ0FBQyxZQUFELEVBQWUsUUFBZixFQUF5QixZQUF6QixFQUF1QyxRQUF2QyxDQUxiLENBQUE7QUFNQSxZQUFBLElBQUcsVUFBVSxDQUFDLFVBQVgsQ0FBQSxDQUF1QixDQUFDLFNBQVMsQ0FBQyxPQUFsQyxDQUEwQyxXQUExQyxDQUFBLEtBQTRELENBQUEsQ0FBNUQsSUFBbUUsZUFBNkIsS0FBQyxDQUFBLE1BQTlCLEVBQUEseUJBQUEsTUFBdEU7QUFDRSxjQUFBLFVBQVUsQ0FBQyxJQUFYLENBQWdCLFdBQWhCLEVBQTZCLFFBQTdCLENBQUEsQ0FERjthQU5BO0FBQUEsWUFRQSxVQUFVLENBQUMsSUFBWCxDQUFnQixHQUFoQixDQVJBLENBQUE7QUFTQSxtQkFBTyxPQUFPLENBQUMsUUFBUixDQUFpQixLQUFDLENBQUEsY0FBbEIsRUFBa0MsVUFBbEMsRUFBOEM7QUFBQSxjQUFDLEtBQUEsRUFBTyxJQUFSO2FBQTlDLENBQTRELENBQUMsSUFBN0QsQ0FBa0UsU0FBQyxNQUFELEdBQUE7QUFDdkUsY0FBQSxJQUFBLENBQUEsTUFBYSxDQUFDLE1BQWQ7QUFDRSx1QkFBTyxFQUFQLENBREY7ZUFBQTtBQUFBLGNBRUEsTUFBQSxHQUFTLElBQUksQ0FBQyxLQUFMLENBQVcsTUFBWCxDQUFrQixDQUFDLE1BRjVCLENBQUE7QUFBQSxjQUdBLE1BQUEsR0FBUyxNQUFNLENBQUMsTUFBUCxDQUFjLFNBQUMsS0FBRCxHQUFBO3VCQUFXLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBdkI7Y0FBQSxDQUFkLENBSFQsQ0FBQTtBQUlBLHFCQUFPLE1BQU0sQ0FBQyxHQUFQLENBQVcsU0FBQyxLQUFELEdBQUE7QUFDaEIsb0JBQUEsaUNBQUE7QUFBQSxnQkFBQSxLQUFBLEdBQVEsS0FBSyxDQUFDLEtBQWQsQ0FBQTtBQUFBLGdCQUNBLFVBQUEsR0FBYSxDQUFDLEtBQUssQ0FBQyxJQUFOLEdBQWEsQ0FBZCxFQUFpQixLQUFLLENBQUMsU0FBTixHQUFrQixDQUFuQyxDQURiLENBQUE7QUFBQSxnQkFFQSxRQUFBLEdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBTixHQUFhLENBQWQsRUFBaUIsS0FBSyxDQUFDLFNBQXZCLENBRlgsQ0FBQTtBQUFBLGdCQUdBLElBQUEsR0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQVgsQ0FBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsQ0FIUCxDQUFBO0FBSUEsdUJBQU87QUFBQSxrQkFDTCxJQUFBLEVBQVMsSUFBQSxLQUFRLEdBQVgsR0FBb0IsT0FBcEIsR0FBb0MsSUFBQSxLQUFRLEdBQVgsR0FBb0IsU0FBcEIsR0FBbUMsTUFEckU7QUFBQSxrQkFFTCxJQUFBLEVBQU0sRUFBQSxHQUFHLEtBQUssQ0FBQyxJQUFULEdBQWMsS0FBZCxHQUFtQixLQUFLLENBQUMsTUFGMUI7QUFBQSxrQkFHTCxVQUFBLFFBSEs7QUFBQSxrQkFJTCxLQUFBLEVBQU8sQ0FBQyxVQUFELEVBQWEsUUFBYixDQUpGO2lCQUFQLENBTGdCO2NBQUEsQ0FBWCxDQUFQLENBTHVFO1lBQUEsQ0FBbEUsQ0FBUCxDQVZJO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKTjtRQUpXO0lBQUEsQ0FsQ2Y7R0FKRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/sarah/.atom/packages/linter-jshint/lib/main.coffee
