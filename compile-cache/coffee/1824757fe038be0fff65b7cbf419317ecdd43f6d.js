(function() {
  var CompositeDisposable, exec, findFile, helpers, path, tempFile, _ref,
    __slice = [].slice;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = helpers = require('atom-linter'), findFile = _ref.findFile, exec = _ref.exec, tempFile = _ref.tempFile;

  path = require('path');

  module.exports = {
    config: {
      additionalArguments: {
        title: 'Additional Arguments',
        type: 'string',
        "default": ''
      },
      disableWhenNoConfigFileInPath: {
        type: 'boolean',
        "default": false,
        description: 'Disable linter when no `.scss-lint.yml` is found in project'
      },
      executablePath: {
        title: 'Executable Path',
        type: 'string',
        "default": 'scss-lint'
      }
    },
    activate: function() {
      require('atom-package-deps').install(require('../package.json').name);
      this.subs = new CompositeDisposable;
      this.subs.add(atom.config.observe('linter-scss-lint.executablePath', (function(_this) {
        return function(executablePath) {
          return _this.executablePath = executablePath;
        };
      })(this)));
      return this.subs.add(atom.config.observe('linter-scss-lint.additionalArguments', (function(_this) {
        return function(additionalArguments) {
          return _this.additionalArguments = additionalArguments;
        };
      })(this)));
    },
    deactivate: function() {
      return this.subs.dispose();
    },
    provideLinter: function() {
      var provider;
      return provider = {
        grammarScopes: ['source.css.scss', 'source.scss'],
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(editor) {
            var config, cwd, disableOnNoConfig, filePath;
            filePath = editor.getPath();
            cwd = path.dirname(filePath);
            disableOnNoConfig = atom.config.get('linter-eslint.disableWhenNoEslintrcFileInPath');
            config = findFile(cwd, '.scss-lint.yml');
            if (disableOnNoConfig && !config) {
              return [];
            }
            return tempFile(path.basename(filePath), editor.getText(), function(tmpFilePath) {
              var params;
              params = [tmpFilePath, '--format=JSON', config != null ? "--config=" + config : void 0].concat(__slice.call(_this.additionalArguments.split(' '))).filter(function(e) {
                return e;
              });
              return helpers.exec(_this.executablePath, params, {
                cwd: cwd
              }).then(function(stdout) {
                var lint;
                lint = (function() {
                  try {
                    return JSON.parse(stdout);
                  } catch (_error) {}
                })();
                if (lint == null) {
                  throw new TypeError(stdout);
                }
                if (!lint[tmpFilePath]) {
                  return [];
                }
                return lint[tmpFilePath].map(function(msg) {
                  var col, line;
                  line = (msg.line || 1) - 1;
                  col = (msg.column || 1) - 1;
                  return {
                    type: msg.severity || 'error',
                    text: (msg.reason || 'Unknown Error') + (msg.linter ? " (" + msg.linter + ")" : ''),
                    filePath: filePath,
                    range: [[line, col], [line, col + (msg.length || 0)]]
                  };
                });
              });
            });
          };
        })(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1zY3NzLWxpbnQvbGliL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtFQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQTZCLE9BQUEsR0FBVSxPQUFBLENBQVEsYUFBUixDQUF2QyxFQUFDLGdCQUFBLFFBQUQsRUFBVyxZQUFBLElBQVgsRUFBaUIsZ0JBQUEsUUFEakIsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLG1CQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxzQkFBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxFQUZUO09BREY7QUFBQSxNQUlBLDZCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDZEQUZiO09BTEY7QUFBQSxNQVFBLGNBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLGlCQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLFFBRUEsU0FBQSxFQUFTLFdBRlQ7T0FURjtLQURGO0FBQUEsSUFjQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxPQUFBLENBQVEsbUJBQVIsQ0FBNEIsQ0FBQyxPQUE3QixDQUFxQyxPQUFBLENBQVEsaUJBQVIsQ0FBMEIsQ0FBQyxJQUFoRSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FB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

//# sourceURL=/Users/sarah/.atom/packages/linter-scss-lint/lib/init.coffee
