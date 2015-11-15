(function() {
  var ScriptOptionsView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  module.exports = ScriptOptionsView = (function(_super) {
    __extends(ScriptOptionsView, _super);

    function ScriptOptionsView() {
      return ScriptOptionsView.__super__.constructor.apply(this, arguments);
    }

    ScriptOptionsView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.div({
            "class": 'overlay from-top panel',
            outlet: 'scriptOptionsView'
          }, function() {
            _this.div({
              "class": 'panel-heading'
            }, 'Configure Run Options');
            return _this.div({
              "class": 'panel-body padded'
            }, function() {
              _this.div({
                "class": 'block'
              }, function() {
                _this.label('Current Working Directory:');
                return _this.input({
                  type: 'text',
                  "class": 'editor mini editor-colors native-key-bindings',
                  outlet: 'inputCwd'
                });
              });
              _this.div({
                "class": 'block'
              }, function() {
                _this.label('Command');
                return _this.input({
                  type: 'text',
                  "class": 'editor mini editor-colors native-key-bindings',
                  outlet: 'inputCommand'
                });
              });
              _this.div({
                "class": 'block'
              }, function() {
                _this.label('Command Arguments:');
                return _this.input({
                  type: 'text',
                  "class": 'editor mini editor-colors native-key-bindings',
                  outlet: 'inputCommandArgs'
                });
              });
              _this.div({
                "class": 'block'
              }, function() {
                _this.label('Program Arguments:');
                return _this.input({
                  type: 'text',
                  "class": 'editor mini editor-colors native-key-bindings',
                  outlet: 'inputScriptArgs'
                });
              });
              _this.div({
                "class": 'block'
              }, function() {
                _this.label('Environment Variables:');
                return _this.input({
                  type: 'text',
                  "class": 'editor mini editor-colors native-key-bindings',
                  outlet: 'inputEnv'
                });
              });
              return _this.div({
                "class": 'block'
              }, function() {
                var css;
                css = 'btn inline-block-tight';
                _this.button({
                  "class": "btn " + css,
                  click: 'close'
                }, 'Close');
                return _this.button({
                  "class": "btn " + css,
                  click: 'run'
                }, 'Run');
              });
            });
          });
        };
      })(this));
    };

    ScriptOptionsView.prototype.initialize = function(runOptions) {
      this.runOptions = runOptions;
      atom.workspaceView.command('script:run-options', (function(_this) {
        return function() {
          return _this.toggleScriptOptions();
        };
      })(this));
      atom.workspaceView.command('script:close-options', (function(_this) {
        return function() {
          return _this.toggleScriptOptions('hide');
        };
      })(this));
      atom.workspaceView.command('script:save-options', (function(_this) {
        return function() {
          return _this.saveOptions();
        };
      })(this));
      atom.workspaceView.prependToTop(this);
      return this.toggleScriptOptions('hide');
    };

    ScriptOptionsView.prototype.toggleScriptOptions = function(command) {
      switch (command) {
        case 'show':
          return this.scriptOptionsView.show();
        case 'hide':
          return this.scriptOptionsView.hide();
        default:
          return this.scriptOptionsView.toggle();
      }
    };

    ScriptOptionsView.prototype.saveOptions = function() {
      var splitArgs;
      splitArgs = function(element) {
        var item, _i, _len, _ref, _results;
        _ref = element.val().split(' ');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (item !== '') {
            _results.push(item);
          }
        }
        return _results;
      };
      this.runOptions.workingDirectory = this.inputCwd.val();
      this.runOptions.cmd = this.inputCommand.val();
      this.runOptions.cmdArgs = splitArgs(this.inputCommandArgs);
      this.runOptions.env = this.inputEnv.val();
      return this.runOptions.scriptArgs = splitArgs(this.inputScriptArgs);
    };

    ScriptOptionsView.prototype.close = function() {
      return atom.workspaceView.trigger('script:close-options');
    };

    ScriptOptionsView.prototype.run = function() {
      atom.workspaceView.trigger('script:save-options');
      atom.workspaceView.trigger('script:close-options');
      return atom.workspaceView.trigger('script:run');
    };

    return ScriptOptionsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLHdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGlCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDSCxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sd0JBQVA7QUFBQSxZQUFpQyxNQUFBLEVBQVEsbUJBQXpDO1dBQUwsRUFBbUUsU0FBQSxHQUFBO0FBQ2pFLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLGVBQVA7YUFBTCxFQUE2Qix1QkFBN0IsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxtQkFBUDthQUFMLEVBQWlDLFNBQUEsR0FBQTtBQUMvQixjQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxnQkFBQSxPQUFBLEVBQU8sT0FBUDtlQUFMLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixnQkFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLDRCQUFQLENBQUEsQ0FBQTt1QkFDQSxLQUFDLENBQUEsS0FBRCxDQUNFO0FBQUEsa0JBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxrQkFDQSxPQUFBLEVBQU8sK0NBRFA7QUFBQSxrQkFFQSxNQUFBLEVBQVEsVUFGUjtpQkFERixFQUZtQjtjQUFBLENBQXJCLENBQUEsQ0FBQTtBQUFBLGNBTUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGdCQUFBLE9BQUEsRUFBTyxPQUFQO2VBQUwsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLGdCQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FBUCxDQUFBLENBQUE7dUJBQ0EsS0FBQyxDQUFBLEtBQUQsQ0FDRTtBQUFBLGtCQUFBLElBQUEsRUFBTSxNQUFOO0FBQUEsa0JBQ0EsT0FBQSxFQUFPLCtDQURQO0FBQUEsa0JBRUEsTUFBQSxFQUFRLGNBRlI7aUJBREYsRUFGbUI7Y0FBQSxDQUFyQixDQU5BLENBQUE7QUFBQSxjQVlBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxnQkFBQSxPQUFBLEVBQU8sT0FBUDtlQUFMLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixnQkFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLG9CQUFQLENBQUEsQ0FBQTt1QkFDQSxLQUFDLENBQUEsS0FBRCxDQUNFO0FBQUEsa0JBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxrQkFDQSxPQUFBLEVBQU8sK0NBRFA7QUFBQSxrQkFFQSxNQUFBLEVBQVEsa0JBRlI7aUJBREYsRUFGbUI7Y0FBQSxDQUFyQixDQVpBLENBQUE7QUFBQSxjQWtCQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLE9BQVA7ZUFBTCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsZ0JBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxvQkFBUCxDQUFBLENBQUE7dUJBQ0EsS0FBQyxDQUFBLEtBQUQsQ0FDRTtBQUFBLGtCQUFBLElBQUEsRUFBTSxNQUFOO0FBQUEsa0JBQ0EsT0FBQSxFQUFPLCtDQURQO0FBQUEsa0JBRUEsTUFBQSxFQUFRLGlCQUZSO2lCQURGLEVBRm1CO2NBQUEsQ0FBckIsQ0FsQkEsQ0FBQTtBQUFBLGNBd0JBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxnQkFBQSxPQUFBLEVBQU8sT0FBUDtlQUFMLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixnQkFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLHdCQUFQLENBQUEsQ0FBQTt1QkFDQSxLQUFDLENBQUEsS0FBRCxDQUNFO0FBQUEsa0JBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxrQkFDQSxPQUFBLEVBQU8sK0NBRFA7QUFBQSxrQkFFQSxNQUFBLEVBQVEsVUFGUjtpQkFERixFQUZtQjtjQUFBLENBQXJCLENBeEJBLENBQUE7cUJBOEJBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxnQkFBQSxPQUFBLEVBQU8sT0FBUDtlQUFMLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixvQkFBQSxHQUFBO0FBQUEsZ0JBQUEsR0FBQSxHQUFNLHdCQUFOLENBQUE7QUFBQSxnQkFDQSxLQUFDLENBQUEsTUFBRCxDQUFRO0FBQUEsa0JBQUEsT0FBQSxFQUFRLE1BQUEsR0FBSyxHQUFiO0FBQUEsa0JBQXFCLEtBQUEsRUFBTyxPQUE1QjtpQkFBUixFQUE2QyxPQUE3QyxDQURBLENBQUE7dUJBRUEsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGtCQUFBLE9BQUEsRUFBUSxNQUFBLEdBQUssR0FBYjtBQUFBLGtCQUFxQixLQUFBLEVBQU8sS0FBNUI7aUJBQVIsRUFBMkMsS0FBM0MsRUFIbUI7Y0FBQSxDQUFyQixFQS9CK0I7WUFBQSxDQUFqQyxFQUZpRTtVQUFBLENBQW5FLEVBREc7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFMLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsZ0NBd0NBLFVBQUEsR0FBWSxTQUFFLFVBQUYsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLGFBQUEsVUFDWixDQUFBO0FBQUEsTUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLG9CQUEzQixFQUFpRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxtQkFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqRCxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsc0JBQTNCLEVBQW1ELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2pELEtBQUMsQ0FBQSxtQkFBRCxDQUFxQixNQUFyQixFQURpRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5ELENBREEsQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixxQkFBM0IsRUFBa0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsV0FBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsRCxDQUhBLENBQUE7QUFBQSxNQUlBLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBbkIsQ0FBZ0MsSUFBaEMsQ0FKQSxDQUFBO2FBS0EsSUFBQyxDQUFBLG1CQUFELENBQXFCLE1BQXJCLEVBTlU7SUFBQSxDQXhDWixDQUFBOztBQUFBLGdDQWdEQSxtQkFBQSxHQUFxQixTQUFDLE9BQUQsR0FBQTtBQUNuQixjQUFPLE9BQVA7QUFBQSxhQUNPLE1BRFA7aUJBQ21CLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxJQUFuQixDQUFBLEVBRG5CO0FBQUEsYUFFTyxNQUZQO2lCQUVtQixJQUFDLENBQUEsaUJBQWlCLENBQUMsSUFBbkIsQ0FBQSxFQUZuQjtBQUFBO2lCQUdPLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxNQUFuQixDQUFBLEVBSFA7QUFBQSxPQURtQjtJQUFBLENBaERyQixDQUFBOztBQUFBLGdDQXNEQSxXQUFBLEdBQWEsU0FBQSxHQUFBO0FBQ1gsVUFBQSxTQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksU0FBQyxPQUFELEdBQUE7QUFDVixZQUFBLDhCQUFBO0FBQUE7QUFBQTthQUFBLDJDQUFBOzBCQUFBO2NBQThDLElBQUEsS0FBVTtBQUF4RCwwQkFBQSxLQUFBO1dBQUE7QUFBQTt3QkFEVTtNQUFBLENBQVosQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxnQkFBWixHQUErQixJQUFDLENBQUEsUUFBUSxDQUFDLEdBQVYsQ0FBQSxDQUgvQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsVUFBVSxDQUFDLEdBQVosR0FBa0IsSUFBQyxDQUFBLFlBQVksQ0FBQyxHQUFkLENBQUEsQ0FKbEIsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLEdBQXNCLFNBQUEsQ0FBVSxJQUFDLENBQUEsZ0JBQVgsQ0FMdEIsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxHQUFaLEdBQWtCLElBQUMsQ0FBQSxRQUFRLENBQUMsR0FBVixDQUFBLENBTmxCLENBQUE7YUFPQSxJQUFDLENBQUEsVUFBVSxDQUFDLFVBQVosR0FBeUIsU0FBQSxDQUFVLElBQUMsQ0FBQSxlQUFYLEVBUmQ7SUFBQSxDQXREYixDQUFBOztBQUFBLGdDQWdFQSxLQUFBLEdBQU8sU0FBQSxHQUFBO2FBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixzQkFBM0IsRUFESztJQUFBLENBaEVQLENBQUE7O0FBQUEsZ0NBbUVBLEdBQUEsR0FBSyxTQUFBLEdBQUE7QUFDSCxNQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIscUJBQTNCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixzQkFBM0IsQ0FEQSxDQUFBO2FBRUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixZQUEzQixFQUhHO0lBQUEsQ0FuRUwsQ0FBQTs7NkJBQUE7O0tBRjhCLEtBSGhDLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/sarah/.atom/packages/script/lib/script-options-view.coffee