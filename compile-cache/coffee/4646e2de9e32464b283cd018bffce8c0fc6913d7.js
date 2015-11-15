(function() {
  var BufferedProcess, CompositeDisposable, Linter, XRegExp, fs, fse, helpers, path, temp, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, CompositeDisposable = _ref.CompositeDisposable;

  helpers = require('atom-linter');

  fs = require('fs');

  fse = require('fs-extra');

  path = require('path');

  temp = require('temp');

  XRegExp = require('xregexp').XRegExp;

  Linter = (function() {
    function Linter() {
      this.lint = __bind(this.lint, this);
      this.findRubocopYmlFile = __bind(this.findRubocopYmlFile, this);
      this.findHamlLintYmlFile = __bind(this.findHamlLintYmlFile, this);
      this.findFile = __bind(this.findFile, this);
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-haml.copyRubocopYml', (function(_this) {
        return function(copyRubocopYml) {
          return _this.copyRubocopYml = copyRubocopYml;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-haml.hamlLintExecutablePath', (function(_this) {
        return function(executablePath) {
          return _this.executablePath = executablePath;
        };
      })(this)));
    }

    Linter.prototype.copyFile = function(sourcePath, destinationPath) {
      return new Promise(function(resolve, reject) {
        return fse.copy(sourcePath, destinationPath, function(error) {
          if (error) {
            return reject(Error(error));
          }
          return resolve();
        });
      });
    };

    Linter.prototype.exists = function(filePath) {
      return new Promise(function(resolve, reject) {
        return fs.exists(filePath, function(exists) {
          return resolve(exists);
        });
      });
    };

    Linter.prototype.findFile = function(filePath, fileName) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var foundPath, homeDir, homePath;
          foundPath = helpers.findFile(filePath, fileName);
          if (foundPath) {
            return resolve(foundPath);
          }
          homeDir = process.env.HOME || process.env.USERPROFILE;
          homePath = path.join(homeDir, fileName);
          return _this.exists(homePath).then(function(exists) {
            return resolve(exists ? homePath : void 0);
          });
        };
      })(this));
    };

    Linter.prototype.findHamlLintYmlFile = function(filePath) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.findFile(filePath, '.haml-lint.yml').then(function(hamlLintYmlPath) {
            return resolve(hamlLintYmlPath);
          });
        };
      })(this));
    };

    Linter.prototype.findRubocopYmlFile = function(filePath) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.findFile(filePath, '.rubocop.yml').then(function(rubocopYmlPath) {
            return resolve(rubocopYmlPath);
          });
        };
      })(this));
    };

    Linter.prototype.grammarScopes = ['text.haml'];

    Linter.prototype.lint = function(textEditor) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var fileContent, fileName, filePath, results, rubocopYmlPath, tempDir, tempFile;
          fileContent = textEditor.getText();
          filePath = textEditor.getPath();
          fileName = path.basename(filePath);
          results = [];
          rubocopYmlPath = void 0;
          tempDir = void 0;
          tempFile = void 0;
          return _this.makeTempDir().then(function(dir) {
            tempDir = dir;
            return _this.writeTempFile(tempDir, fileName, fileContent);
          }).then(function(file) {
            tempFile = file;
            if (_this.copyRubocopYml) {
              return _this.findRubocopYmlFile(filePath);
            }
          }).then(function(rubocopYmlPath) {
            if (rubocopYmlPath) {
              return _this.copyFile(rubocopYmlPath, path.join(tempDir, '.rubocop.yml'));
            }
          }).then(function() {
            return _this.findHamlLintYmlFile(filePath);
          }).then(function(hamlLintYmlPath) {
            return _this.lintFile(textEditor, tempFile, hamlLintYmlPath);
          }).then(function(messages) {
            return results = messages;
          }).then(function() {
            return _this.removeTempDir(tempDir);
          }).then(function() {
            return resolve(results);
          })["catch"](function(error) {
            console.error('linter-haml error', error);
            return resolve(results);
          });
        };
      })(this));
    };

    Linter.prototype.lintFile = function(textEditor, tempFile, hamlLintYmlPath) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var args, filePath, output, process, tabLength, textBuffer;
          filePath = textEditor.getPath();
          tabLength = textEditor.getTabLength();
          textBuffer = textEditor.getBuffer();
          args = [];
          if (hamlLintYmlPath != null) {
            args.push('--config');
            args.push(hamlLintYmlPath);
          }
          args.push(tempFile);
          output = [];
          return process = new BufferedProcess({
            command: _this.executablePath,
            args: args,
            options: {
              cwd: path.dirname(tempFile)
            },
            stdout: function(data) {
              return output.push(data);
            },
            exit: function(code) {
              var messages, regex;
              regex = XRegExp('.+?:(?<line>\\d+) ' + '\\[((?<warning>W)|(?<error>E))\\] ' + '(?<message>.+)');
              messages = [];
              XRegExp.forEach(output, regex, function(match, i) {
                var indentLevel;
                indentLevel = textEditor.indentationForBufferRow(match.line - 1);
                return messages.push({
                  type: match.warning != null ? 'warning' : 'error',
                  text: match.message,
                  filePath: filePath,
                  range: [[match.line - 1, indentLevel * tabLength], [match.line - 1, textBuffer.lineLengthForRow(match.line - 1)]]
                });
              });
              return resolve(messages);
            }
          });
        };
      })(this));
    };

    Linter.prototype.lintOnFly = true;

    Linter.prototype.makeTempDir = function() {
      return new Promise(function(resolve, reject) {
        return temp.mkdir('AtomLinter', function(error, directory) {
          if (error) {
            return reject(Error(error));
          }
          return resolve(directory);
        });
      });
    };

    Linter.prototype.removeTempDir = function(tempDir) {
      return new Promise(function(resolve, reject) {
        return fse.remove(tempDir, function(error) {
          if (error) {
            return reject(Error(error));
          }
          return resolve();
        });
      });
    };

    Linter.prototype.scope = 'file';

    Linter.prototype.writeTempFile = function(tempDir, fileName, fileContent) {
      return new Promise(function(resolve, reject) {
        var tempFile;
        tempFile = path.join(tempDir, fileName);
        return fse.writeFile(tempFile, fileContent, function(error) {
          if (error) {
            return reject(Error(error));
          }
          return resolve(tempFile);
        });
      });
    };

    return Linter;

  })();

  module.exports = Linter;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1oYW1sL2xpYi9saW50ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlGQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUF5QyxPQUFBLENBQVEsTUFBUixDQUF6QyxFQUFDLHVCQUFBLGVBQUQsRUFBa0IsMkJBQUEsbUJBQWxCLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGFBQVIsQ0FEVixDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsVUFBUixDQUhOLENBQUE7O0FBQUEsRUFJQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FKUCxDQUFBOztBQUFBLEVBS0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBTFAsQ0FBQTs7QUFBQSxFQU1BLE9BQUEsR0FBVSxPQUFBLENBQVEsU0FBUixDQUFrQixDQUFDLE9BTjdCLENBQUE7O0FBQUEsRUFRTTtBQUNTLElBQUEsZ0JBQUEsR0FBQTtBQUNYLHlDQUFBLENBQUE7QUFBQSxxRUFBQSxDQUFBO0FBQUEsdUVBQUEsQ0FBQTtBQUFBLGlEQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQiw0QkFBcEIsRUFBa0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsY0FBRCxHQUFBO2lCQUNuRSxLQUFDLENBQUEsY0FBRCxHQUFrQixlQURpRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FB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

//# sourceURL=/Users/sarah/.atom/packages/linter-haml/lib/linter.coffee
