(function() {
  var $$, AnsiFilter, BufferedProcess, CodeContext, HeaderView, ScriptOptionsView, ScriptView, View, grammarMap, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  grammarMap = require('./grammars');

  _ref = require('atom'), View = _ref.View, BufferedProcess = _ref.BufferedProcess, $$ = _ref.$$;

  CodeContext = require('./code-context');

  HeaderView = require('./header-view');

  ScriptOptionsView = require('./script-options-view');

  AnsiFilter = require('ansi-to-html');

  _ = require('underscore');

  module.exports = ScriptView = (function(_super) {
    __extends(ScriptView, _super);

    function ScriptView() {
      return ScriptView.__super__.constructor.apply(this, arguments);
    }

    ScriptView.bufferedProcess = null;

    ScriptView.content = function() {
      return this.div((function(_this) {
        return function() {
          var css;
          _this.subview('headerView', new HeaderView());
          css = 'tool-panel panel panel-bottom padding script-view native-key-bindings';
          return _this.div({
            "class": css,
            outlet: 'script',
            tabindex: -1
          }, function() {
            return _this.div({
              "class": 'panel-body padded output',
              outlet: 'output'
            });
          });
        };
      })(this));
    };

    ScriptView.prototype.initialize = function(serializeState, runOptions) {
      this.runOptions = runOptions;
      atom.workspaceView.command('script:run', (function(_this) {
        return function() {
          return _this.defaultRun();
        };
      })(this));
      atom.workspaceView.command('script:run-at-line', (function(_this) {
        return function() {
          return _this.lineRun();
        };
      })(this));
      atom.workspaceView.command('script:close-view', (function(_this) {
        return function() {
          return _this.close();
        };
      })(this));
      atom.workspaceView.command('script:kill-process', (function(_this) {
        return function() {
          return _this.stop();
        };
      })(this));
      return this.ansiFilter = new AnsiFilter;
    };

    ScriptView.prototype.serialize = function() {};

    ScriptView.prototype.updateOptions = function(event) {
      return this.runOptions = event.runOptions;
    };

    ScriptView.prototype.getShebang = function(editor) {
      var firstLine, lines, text;
      text = editor.getText();
      lines = text.split("\n");
      firstLine = lines[0];
      if (!firstLine.match(/^#!/)) {
        return;
      }
      return firstLine.replace(/^#!\s*/, '');
    };

    ScriptView.prototype.initCodeContext = function(editor) {
      var codeContext, filename, filepath, lang, selection, textSource;
      filename = editor.getTitle();
      filepath = editor.getPath();
      selection = editor.getSelection();
      if (selection.isEmpty()) {
        textSource = editor;
      } else {
        textSource = selection;
      }
      codeContext = new CodeContext(filename, filepath, textSource);
      codeContext.selection = selection;
      codeContext.shebang = this.getShebang(editor);
      lang = this.getLang(editor);
      if (this.validateLang(lang)) {
        codeContext.lang = lang;
      }
      return codeContext;
    };

    ScriptView.prototype.lineRun = function() {
      var codeContext;
      this.resetView();
      codeContext = this.buildCodeContext('Line Based');
      if (!(codeContext == null)) {
        return this.start(codeContext);
      }
    };

    ScriptView.prototype.defaultRun = function() {
      var codeContext;
      this.resetView();
      codeContext = this.buildCodeContext();
      if (!(codeContext == null)) {
        return this.start(codeContext);
      }
    };

    ScriptView.prototype.buildCodeContext = function(argType) {
      var codeContext, cursor, editor;
      if (argType == null) {
        argType = 'Selection Based';
      }
      editor = atom.workspace.getActiveEditor();
      if (editor == null) {
        return;
      }
      codeContext = this.initCodeContext(editor);
      codeContext.argType = argType;
      if (argType === 'Line Based') {
        editor.save();
      } else if (codeContext.selection.isEmpty() && (codeContext.filepath != null)) {
        codeContext.argType = 'File Based';
        editor.save();
      }
      if (argType !== 'File Based') {
        cursor = editor.getCursor();
        codeContext.lineNumber = cursor.getScreenRow() + 1;
      }
      return codeContext;
    };

    ScriptView.prototype.start = function(codeContext) {
      var commandContext;
      if (codeContext.lang == null) {
        return;
      }
      commandContext = this.setupRuntime(codeContext);
      if (commandContext) {
        return this.run(commandContext.command, commandContext.args, codeContext);
      }
    };

    ScriptView.prototype.resetView = function(title) {
      if (title == null) {
        title = 'Loading...';
      }
      if (!this.hasParent()) {
        atom.workspaceView.prependToBottom(this);
      }
      this.stop();
      this.headerView.title.text(title);
      this.headerView.setStatus('start');
      return this.output.empty();
    };

    ScriptView.prototype.close = function() {
      this.stop();
      if (this.hasParent()) {
        return this.detach();
      }
    };

    ScriptView.prototype.getLang = function(editor) {
      return editor.getGrammar().name;
    };

    ScriptView.prototype.validateLang = function(lang) {
      var err;
      err = null;
      if (lang === 'Null Grammar' || lang === 'Plain Text') {
        err = $$(function() {
          return this.p('You must select a language in the lower left, or save the file with an appropriate extension.');
        });
      } else if (!(lang in grammarMap)) {
        err = $$(function() {
          this.p({
            "class": 'block'
          }, "Command not configured for " + lang + "!");
          return this.p({
            "class": 'block'
          }, (function(_this) {
            return function() {
              _this.text('Add an ');
              _this.a({
                href: "https://github.com/rgbkrk/atom-script/issues/new?title=Add%20support%20for%20" + lang
              }, 'issue on GitHub');
              return _this.text(' or send your own Pull Request.');
            };
          })(this));
        });
      }
      if (err != null) {
        this.handleError(err);
        return false;
      }
      return true;
    };

    ScriptView.prototype.setupRuntime = function(codeContext) {
      var buildArgsArray, commandContext, err, error;
      commandContext = {};
      try {
        if ((this.runOptions.cmd == null) || this.runOptions.cmd === '') {
          commandContext.command = codeContext.shebangCommand() || grammarMap[codeContext.lang][codeContext.argType].command;
        } else {
          commandContext.command = this.runOptions.cmd;
        }
        buildArgsArray = grammarMap[codeContext.lang][codeContext.argType].args;
      } catch (_error) {
        error = _error;
        err = $$(function() {
          this.p({
            "class": 'block'
          }, "" + codeContext.argType + " runner not available for " + codeContext.lang + ".");
          return this.p({
            "class": 'block'
          }, (function(_this) {
            return function() {
              _this.text('If it should exist, add an ');
              _this.a({
                href: "https://github.com/rgbkrk/atom-script/issues/new?title=Add%20support%20for%20" + codeContext.lang
              }, 'issue on GitHub');
              return _this.text(', or send your own pull request.');
            };
          })(this));
        });
        this.handleError(err);
        return false;
      }
      if (codeContext.argType === 'Line Based') {
        this.headerView.title.text("" + codeContext.lang + " - " + (codeContext.fileColonLine(false)));
      } else {
        this.headerView.title.text("" + codeContext.lang + " - " + codeContext.filename);
      }
      commandContext.args = buildArgsArray(codeContext);
      return commandContext;
    };

    ScriptView.prototype.handleError = function(err) {
      this.headerView.title.text('Error');
      this.headerView.setStatus('err');
      this.output.append(err);
      return this.stop();
    };

    ScriptView.prototype.run = function(command, extraArgs, codeContext) {
      var args, exit, options, stderr, stdout;
      atom.emit('achievement:unlock', {
        msg: 'Homestar Runner'
      });
      options = {
        cwd: this.getCwd(),
        env: this.runOptions.mergedEnv(process.env)
      };
      args = (this.runOptions.cmdArgs.concat(extraArgs)).concat(this.runOptions.scriptArgs);
      if ((this.runOptions.cmd == null) || this.runOptions.cmd === '') {
        args = codeContext.shebangCommandArgs().concat(args);
      }
      stdout = (function(_this) {
        return function(output) {
          return _this.display('stdout', output);
        };
      })(this);
      stderr = (function(_this) {
        return function(output) {
          return _this.display('stderr', output);
        };
      })(this);
      exit = (function(_this) {
        return function(returnCode) {
          if (returnCode === 0) {
            _this.headerView.setStatus('stop');
          } else {
            _this.headerView.setStatus('err');
          }
          return console.log("Exited with " + returnCode);
        };
      })(this);
      this.bufferedProcess = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      return this.bufferedProcess.process.on('error', (function(_this) {
        return function(nodeError) {
          return _this.output.append($$(function() {
            this.h1('Unable to run');
            this.pre(_.escape(command));
            this.h2('Is it on your path?');
            return this.pre("PATH: " + (_.escape(process.env.PATH)));
          }));
        };
      })(this));
    };

    ScriptView.prototype.getCwd = function() {
      if ((this.runOptions.workingDirectory == null) || this.runOptions.workingDirectory === '') {
        return atom.project.getPath();
      } else {
        return this.runOptions.workingDirectory;
      }
    };

    ScriptView.prototype.stop = function() {
      if ((this.bufferedProcess != null) && (this.bufferedProcess.process != null)) {
        this.display('stdout', '^C');
        this.headerView.setStatus('kill');
        return this.bufferedProcess.kill();
      }
    };

    ScriptView.prototype.display = function(css, line) {
      line = _.escape(line);
      line = this.ansiFilter.toHtml(line);
      return this.output.append($$(function() {
        return this.pre({
          "class": "line " + css
        }, (function(_this) {
          return function() {
            return _this.raw(line);
          };
        })(this));
      }));
    };

    return ScriptView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtIQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FBYixDQUFBOztBQUFBLEVBQ0EsT0FBOEIsT0FBQSxDQUFRLE1BQVIsQ0FBOUIsRUFBQyxZQUFBLElBQUQsRUFBTyx1QkFBQSxlQUFQLEVBQXdCLFVBQUEsRUFEeEIsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FGZCxDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBSGIsQ0FBQTs7QUFBQSxFQUlBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx1QkFBUixDQUpwQixDQUFBOztBQUFBLEVBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBTGIsQ0FBQTs7QUFBQSxFQU1BLENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUixDQU5KLENBQUE7O0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsVUFBQyxDQUFBLGVBQUQsR0FBa0IsSUFBbEIsQ0FBQTs7QUFBQSxJQUVBLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ0gsY0FBQSxHQUFBO0FBQUEsVUFBQSxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBMkIsSUFBQSxVQUFBLENBQUEsQ0FBM0IsQ0FBQSxDQUFBO0FBQUEsVUFHQSxHQUFBLEdBQU0sdUVBSE4sQ0FBQTtpQkFLQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sR0FBUDtBQUFBLFlBQVksTUFBQSxFQUFRLFFBQXBCO0FBQUEsWUFBOEIsUUFBQSxFQUFVLENBQUEsQ0FBeEM7V0FBTCxFQUFpRCxTQUFBLEdBQUE7bUJBQy9DLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTywwQkFBUDtBQUFBLGNBQW1DLE1BQUEsRUFBUSxRQUEzQzthQUFMLEVBRCtDO1VBQUEsQ0FBakQsRUFORztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUwsRUFEUTtJQUFBLENBRlYsQ0FBQTs7QUFBQSx5QkFZQSxVQUFBLEdBQVksU0FBQyxjQUFELEVBQWtCLFVBQWxCLEdBQUE7QUFFVixNQUYyQixJQUFDLENBQUEsYUFBQSxVQUU1QixDQUFBO0FBQUEsTUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLFlBQTNCLEVBQXlDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLFVBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekMsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLG9CQUEzQixFQUFpRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxPQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpELENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixtQkFBM0IsRUFBZ0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsS0FBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRCxDQUZBLENBQUE7QUFBQSxNQUdBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIscUJBQTNCLEVBQWtELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLElBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEQsQ0FIQSxDQUFBO2FBS0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxHQUFBLENBQUEsV0FQSjtJQUFBLENBWlosQ0FBQTs7QUFBQSx5QkFxQkEsU0FBQSxHQUFXLFNBQUEsR0FBQSxDQXJCWCxDQUFBOztBQUFBLHlCQXVCQSxhQUFBLEdBQWUsU0FBQyxLQUFELEdBQUE7YUFBVyxJQUFDLENBQUEsVUFBRCxHQUFjLEtBQUssQ0FBQyxXQUEvQjtJQUFBLENBdkJmLENBQUE7O0FBQUEseUJBeUJBLFVBQUEsR0FBWSxTQUFDLE1BQUQsR0FBQTtBQUNWLFVBQUEsc0JBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWCxDQURSLENBQUE7QUFBQSxNQUVBLFNBQUEsR0FBWSxLQUFNLENBQUEsQ0FBQSxDQUZsQixDQUFBO0FBR0EsTUFBQSxJQUFBLENBQUEsU0FBdUIsQ0FBQyxLQUFWLENBQWdCLEtBQWhCLENBQWQ7QUFBQSxjQUFBLENBQUE7T0FIQTthQUtBLFNBQVMsQ0FBQyxPQUFWLENBQWtCLFFBQWxCLEVBQTRCLEVBQTVCLEVBTlU7SUFBQSxDQXpCWixDQUFBOztBQUFBLHlCQWlDQSxlQUFBLEdBQWlCLFNBQUMsTUFBRCxHQUFBO0FBQ2YsVUFBQSw0REFBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FBWCxDQUFBO0FBQUEsTUFDQSxRQUFBLEdBQVcsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQURYLENBQUE7QUFBQSxNQUVBLFNBQUEsR0FBWSxNQUFNLENBQUMsWUFBUCxDQUFBLENBRlosQ0FBQTtBQU1BLE1BQUEsSUFBRyxTQUFTLENBQUMsT0FBVixDQUFBLENBQUg7QUFDRSxRQUFBLFVBQUEsR0FBYSxNQUFiLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxVQUFBLEdBQWEsU0FBYixDQUhGO09BTkE7QUFBQSxNQVdBLFdBQUEsR0FBa0IsSUFBQSxXQUFBLENBQVksUUFBWixFQUFzQixRQUF0QixFQUFnQyxVQUFoQyxDQVhsQixDQUFBO0FBQUEsTUFZQSxXQUFXLENBQUMsU0FBWixHQUF3QixTQVp4QixDQUFBO0FBQUEsTUFhQSxXQUFXLENBQUMsT0FBWixHQUFzQixJQUFDLENBQUEsVUFBRCxDQUFZLE1BQVosQ0FidEIsQ0FBQTtBQUFBLE1BZ0JBLElBQUEsR0FBTyxJQUFDLENBQUEsT0FBRCxDQUFTLE1BQVQsQ0FoQlAsQ0FBQTtBQWtCQSxNQUFBLElBQUcsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFkLENBQUg7QUFDRSxRQUFBLFdBQVcsQ0FBQyxJQUFaLEdBQW1CLElBQW5CLENBREY7T0FsQkE7QUFxQkEsYUFBTyxXQUFQLENBdEJlO0lBQUEsQ0FqQ2pCLENBQUE7O0FBQUEseUJBeURBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLFdBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxXQUFBLEdBQWMsSUFBQyxDQUFBLGdCQUFELENBQWtCLFlBQWxCLENBRGQsQ0FBQTtBQUVBLE1BQUEsSUFBQSxDQUFBLHFCQUFBO2VBQUEsSUFBQyxDQUFBLEtBQUQsQ0FBTyxXQUFQLEVBQUE7T0FITztJQUFBLENBekRULENBQUE7O0FBQUEseUJBOERBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixVQUFBLFdBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxXQUFBLEdBQWMsSUFBQyxDQUFBLGdCQUFELENBQUEsQ0FEZCxDQUFBO0FBRUEsTUFBQSxJQUFBLENBQUEscUJBQUE7ZUFBQSxJQUFDLENBQUEsS0FBRCxDQUFPLFdBQVAsRUFBQTtPQUhVO0lBQUEsQ0E5RFosQ0FBQTs7QUFBQSx5QkFtRUEsZ0JBQUEsR0FBa0IsU0FBQyxPQUFELEdBQUE7QUFFaEIsVUFBQSwyQkFBQTs7UUFGaUIsVUFBUTtPQUV6QjtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUFBLENBQVQsQ0FBQTtBQUVBLE1BQUEsSUFBYyxjQUFkO0FBQUEsY0FBQSxDQUFBO09BRkE7QUFBQSxNQUlBLFdBQUEsR0FBYyxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFqQixDQUpkLENBQUE7QUFBQSxNQU1BLFdBQVcsQ0FBQyxPQUFaLEdBQXNCLE9BTnRCLENBQUE7QUFRQSxNQUFBLElBQUcsT0FBQSxLQUFXLFlBQWQ7QUFDRSxRQUFBLE1BQU0sQ0FBQyxJQUFQLENBQUEsQ0FBQSxDQURGO09BQUEsTUFFSyxJQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsT0FBdEIsQ0FBQSxDQUFBLElBQW9DLDhCQUF2QztBQUNILFFBQUEsV0FBVyxDQUFDLE9BQVosR0FBc0IsWUFBdEIsQ0FBQTtBQUFBLFFBQ0EsTUFBTSxDQUFDLElBQVAsQ0FBQSxDQURBLENBREc7T0FWTDtBQWdCQSxNQUFBLElBQU8sT0FBQSxLQUFXLFlBQWxCO0FBQ0UsUUFBQSxNQUFBLEdBQVMsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFULENBQUE7QUFBQSxRQUNBLFdBQVcsQ0FBQyxVQUFaLEdBQXlCLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FBQSxHQUF3QixDQURqRCxDQURGO09BaEJBO0FBb0JBLGFBQU8sV0FBUCxDQXRCZ0I7SUFBQSxDQW5FbEIsQ0FBQTs7QUFBQSx5QkEyRkEsS0FBQSxHQUFPLFNBQUMsV0FBRCxHQUFBO0FBR0wsVUFBQSxjQUFBO0FBQUEsTUFBQSxJQUFPLHdCQUFQO0FBR0UsY0FBQSxDQUhGO09BQUE7QUFBQSxNQUtBLGNBQUEsR0FBaUIsSUFBQyxDQUFBLFlBQUQsQ0FBYyxXQUFkLENBTGpCLENBQUE7QUFNQSxNQUFBLElBQWlFLGNBQWpFO2VBQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSyxjQUFjLENBQUMsT0FBcEIsRUFBNkIsY0FBYyxDQUFDLElBQTVDLEVBQWtELFdBQWxELEVBQUE7T0FUSztJQUFBLENBM0ZQLENBQUE7O0FBQUEseUJBc0dBLFNBQUEsR0FBVyxTQUFDLEtBQUQsR0FBQTs7UUFBQyxRQUFRO09BSWxCO0FBQUEsTUFBQSxJQUFBLENBQUEsSUFBZ0QsQ0FBQSxTQUFELENBQUEsQ0FBL0M7QUFBQSxRQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBbkIsQ0FBbUMsSUFBbkMsQ0FBQSxDQUFBO09BQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FIQSxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFsQixDQUF1QixLQUF2QixDQUxBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixDQUFzQixPQUF0QixDQU5BLENBQUE7YUFTQSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsQ0FBQSxFQWJTO0lBQUEsQ0F0R1gsQ0FBQTs7QUFBQSx5QkFxSEEsS0FBQSxHQUFPLFNBQUEsR0FBQTtBQUVMLE1BQUEsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFBLENBQUE7QUFDQSxNQUFBLElBQWEsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFiO2VBQUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQUFBO09BSEs7SUFBQSxDQXJIUCxDQUFBOztBQUFBLHlCQTBIQSxPQUFBLEdBQVMsU0FBQyxNQUFELEdBQUE7YUFBWSxNQUFNLENBQUMsVUFBUCxDQUFBLENBQW1CLENBQUMsS0FBaEM7SUFBQSxDQTFIVCxDQUFBOztBQUFBLHlCQTRIQSxZQUFBLEdBQWMsU0FBQyxJQUFELEdBQUE7QUFDWixVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxJQUFOLENBQUE7QUFHQSxNQUFBLElBQUcsSUFBQSxLQUFRLGNBQVIsSUFBMEIsSUFBQSxLQUFRLFlBQXJDO0FBQ0UsUUFBQSxHQUFBLEdBQU0sRUFBQSxDQUFHLFNBQUEsR0FBQTtpQkFDUCxJQUFDLENBQUEsQ0FBRCxDQUFHLCtGQUFILEVBRE87UUFBQSxDQUFILENBQU4sQ0FERjtPQUFBLE1BT0ssSUFBRyxDQUFBLENBQUssSUFBQSxJQUFRLFVBQVQsQ0FBUDtBQUNILFFBQUEsR0FBQSxHQUFNLEVBQUEsQ0FBRyxTQUFBLEdBQUE7QUFDUCxVQUFBLElBQUMsQ0FBQSxDQUFELENBQUc7QUFBQSxZQUFBLE9BQUEsRUFBTyxPQUFQO1dBQUgsRUFBb0IsNkJBQUEsR0FBNEIsSUFBNUIsR0FBa0MsR0FBdEQsQ0FBQSxDQUFBO2lCQUNBLElBQUMsQ0FBQSxDQUFELENBQUc7QUFBQSxZQUFBLE9BQUEsRUFBTyxPQUFQO1dBQUgsRUFBbUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTttQkFBQSxTQUFBLEdBQUE7QUFDakIsY0FBQSxLQUFDLENBQUEsSUFBRCxDQUFNLFNBQU4sQ0FBQSxDQUFBO0FBQUEsY0FDQSxLQUFDLENBQUEsQ0FBRCxDQUFHO0FBQUEsZ0JBQUEsSUFBQSxFQUFPLCtFQUFBLEdBQ3lCLElBRGhDO2VBQUgsRUFDNEMsaUJBRDVDLENBREEsQ0FBQTtxQkFHQSxLQUFDLENBQUEsSUFBRCxDQUFNLGlDQUFOLEVBSmlCO1lBQUEsRUFBQTtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkIsRUFGTztRQUFBLENBQUgsQ0FBTixDQURHO09BVkw7QUFtQkEsTUFBQSxJQUFHLFdBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxXQUFELENBQWEsR0FBYixDQUFBLENBQUE7QUFDQSxlQUFPLEtBQVAsQ0FGRjtPQW5CQTtBQXVCQSxhQUFPLElBQVAsQ0F4Qlk7SUFBQSxDQTVIZCxDQUFBOztBQUFBLHlCQXNKQSxZQUFBLEdBQWMsU0FBQyxXQUFELEdBQUE7QUFHWixVQUFBLDBDQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWlCLEVBQWpCLENBQUE7QUFFQTtBQUNFLFFBQUEsSUFBTyw2QkFBSixJQUF3QixJQUFDLENBQUEsVUFBVSxDQUFDLEdBQVosS0FBbUIsRUFBOUM7QUFFRSxVQUFBLGNBQWMsQ0FBQyxPQUFmLEdBQXlCLFdBQVcsQ0FBQyxjQUFaLENBQUEsQ0FBQSxJQUFnQyxVQUFXLENBQUEsV0FBVyxDQUFDLElBQVosQ0FBa0IsQ0FBQSxXQUFXLENBQUMsT0FBWixDQUFvQixDQUFDLE9BQTNHLENBRkY7U0FBQSxNQUFBO0FBSUUsVUFBQSxjQUFjLENBQUMsT0FBZixHQUF5QixJQUFDLENBQUEsVUFBVSxDQUFDLEdBQXJDLENBSkY7U0FBQTtBQUFBLFFBTUEsY0FBQSxHQUFpQixVQUFXLENBQUEsV0FBVyxDQUFDLElBQVosQ0FBa0IsQ0FBQSxXQUFXLENBQUMsT0FBWixDQUFvQixDQUFDLElBTm5FLENBREY7T0FBQSxjQUFBO0FBVUUsUUFESSxjQUNKLENBQUE7QUFBQSxRQUFBLEdBQUEsR0FBTSxFQUFBLENBQUcsU0FBQSxHQUFBO0FBQ1AsVUFBQSxJQUFDLENBQUEsQ0FBRCxDQUFHO0FBQUEsWUFBQSxPQUFBLEVBQU8sT0FBUDtXQUFILEVBQW1CLEVBQUEsR0FBRSxXQUFXLENBQUMsT0FBZCxHQUF1Qiw0QkFBdkIsR0FBa0QsV0FBVyxDQUFDLElBQTlELEdBQW9FLEdBQXZGLENBQUEsQ0FBQTtpQkFDQSxJQUFDLENBQUEsQ0FBRCxDQUFHO0FBQUEsWUFBQSxPQUFBLEVBQU8sT0FBUDtXQUFILEVBQW1CLENBQUEsU0FBQSxLQUFBLEdBQUE7bUJBQUEsU0FBQSxHQUFBO0FBQ2pCLGNBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTSw2QkFBTixDQUFBLENBQUE7QUFBQSxjQUNBLEtBQUMsQ0FBQSxDQUFELENBQUc7QUFBQSxnQkFBQSxJQUFBLEVBQU8sK0VBQUEsR0FDeUIsV0FBVyxDQUFDLElBRDVDO2VBQUgsRUFDd0QsaUJBRHhELENBREEsQ0FBQTtxQkFHQSxLQUFDLENBQUEsSUFBRCxDQUFNLGtDQUFOLEVBSmlCO1lBQUEsRUFBQTtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkIsRUFGTztRQUFBLENBQUgsQ0FBTixDQUFBO0FBQUEsUUFRQSxJQUFDLENBQUEsV0FBRCxDQUFhLEdBQWIsQ0FSQSxDQUFBO0FBU0EsZUFBTyxLQUFQLENBbkJGO09BRkE7QUF3QkEsTUFBQSxJQUFHLFdBQVcsQ0FBQyxPQUFaLEtBQXVCLFlBQTFCO0FBQ0UsUUFBQSxJQUFDLENBQUEsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFsQixDQUF1QixFQUFBLEdBQUUsV0FBVyxDQUFDLElBQWQsR0FBb0IsS0FBcEIsR0FBd0IsQ0FBQSxXQUFXLENBQUMsYUFBWixDQUEwQixLQUExQixDQUFBLENBQS9DLENBQUEsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLElBQUMsQ0FBQSxVQUFVLENBQUMsS0FBSyxDQUFDLElBQWxCLENBQXVCLEVBQUEsR0FBRSxXQUFXLENBQUMsSUFBZCxHQUFvQixLQUFwQixHQUF3QixXQUFXLENBQUMsUUFBM0QsQ0FBQSxDQUhGO09BeEJBO0FBQUEsTUE2QkEsY0FBYyxDQUFDLElBQWYsR0FBc0IsY0FBQSxDQUFlLFdBQWYsQ0E3QnRCLENBQUE7QUFpQ0EsYUFBTyxjQUFQLENBcENZO0lBQUEsQ0F0SmQsQ0FBQTs7QUFBQSx5QkE0TEEsV0FBQSxHQUFhLFNBQUMsR0FBRCxHQUFBO0FBRVgsTUFBQSxJQUFDLENBQUEsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFsQixDQUF1QixPQUF2QixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixDQUFzQixLQUF0QixDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixDQUFlLEdBQWYsQ0FGQSxDQUFBO2FBR0EsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQUxXO0lBQUEsQ0E1TGIsQ0FBQTs7QUFBQSx5QkFtTUEsR0FBQSxHQUFLLFNBQUMsT0FBRCxFQUFVLFNBQVYsRUFBcUIsV0FBckIsR0FBQTtBQUNILFVBQUEsbUNBQUE7QUFBQSxNQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsb0JBQVYsRUFBZ0M7QUFBQSxRQUFBLEdBQUEsRUFBSyxpQkFBTDtPQUFoQyxDQUFBLENBQUE7QUFBQSxNQUdBLE9BQUEsR0FDRTtBQUFBLFFBQUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBTDtBQUFBLFFBQ0EsR0FBQSxFQUFLLElBQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixDQUFzQixPQUFPLENBQUMsR0FBOUIsQ0FETDtPQUpGLENBQUE7QUFBQSxNQU1BLElBQUEsR0FBTyxDQUFDLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQXBCLENBQTJCLFNBQTNCLENBQUQsQ0FBc0MsQ0FBQyxNQUF2QyxDQUE4QyxJQUFDLENBQUEsVUFBVSxDQUFDLFVBQTFELENBTlAsQ0FBQTtBQU9BLE1BQUEsSUFBTyw2QkFBSixJQUF3QixJQUFDLENBQUEsVUFBVSxDQUFDLEdBQVosS0FBbUIsRUFBOUM7QUFDRSxRQUFBLElBQUEsR0FBTyxXQUFXLENBQUMsa0JBQVosQ0FBQSxDQUFnQyxDQUFDLE1BQWpDLENBQXdDLElBQXhDLENBQVAsQ0FERjtPQVBBO0FBQUEsTUFVQSxNQUFBLEdBQVMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUFZLEtBQUMsQ0FBQSxPQUFELENBQVMsUUFBVCxFQUFtQixNQUFuQixFQUFaO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FWVCxDQUFBO0FBQUEsTUFXQSxNQUFBLEdBQVMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUFZLEtBQUMsQ0FBQSxPQUFELENBQVMsUUFBVCxFQUFtQixNQUFuQixFQUFaO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FYVCxDQUFBO0FBQUEsTUFZQSxJQUFBLEdBQU8sQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsVUFBRCxHQUFBO0FBQ0wsVUFBQSxJQUFHLFVBQUEsS0FBYyxDQUFqQjtBQUNFLFlBQUEsS0FBQyxDQUFBLFVBQVUsQ0FBQyxTQUFaLENBQXNCLE1BQXRCLENBQUEsQ0FERjtXQUFBLE1BQUE7QUFHRSxZQUFBLEtBQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixDQUFzQixLQUF0QixDQUFBLENBSEY7V0FBQTtpQkFJQSxPQUFPLENBQUMsR0FBUixDQUFhLGNBQUEsR0FBYSxVQUExQixFQUxLO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FaUCxDQUFBO0FBQUEsTUFvQkEsSUFBQyxDQUFBLGVBQUQsR0FBdUIsSUFBQSxlQUFBLENBQWdCO0FBQUEsUUFDckMsU0FBQSxPQURxQztBQUFBLFFBQzVCLE1BQUEsSUFENEI7QUFBQSxRQUN0QixTQUFBLE9BRHNCO0FBQUEsUUFDYixRQUFBLE1BRGE7QUFBQSxRQUNMLFFBQUEsTUFESztBQUFBLFFBQ0csTUFBQSxJQURIO09BQWhCLENBcEJ2QixDQUFBO2FBd0JBLElBQUMsQ0FBQSxlQUFlLENBQUMsT0FBTyxDQUFDLEVBQXpCLENBQTRCLE9BQTVCLEVBQXFDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLFNBQUQsR0FBQTtpQkFDbkMsS0FBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQWUsRUFBQSxDQUFHLFNBQUEsR0FBQTtBQUNoQixZQUFBLElBQUMsQ0FBQSxFQUFELENBQUksZUFBSixDQUFBLENBQUE7QUFBQSxZQUNBLElBQUMsQ0FBQSxHQUFELENBQUssQ0FBQyxDQUFDLE1BQUYsQ0FBUyxPQUFULENBQUwsQ0FEQSxDQUFBO0FBQUEsWUFFQSxJQUFDLENBQUEsRUFBRCxDQUFJLHFCQUFKLENBRkEsQ0FBQTttQkFHQSxJQUFDLENBQUEsR0FBRCxDQUFNLFFBQUEsR0FBTyxDQUFBLENBQUMsQ0FBQyxNQUFGLENBQVMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFyQixDQUFBLENBQWIsRUFKZ0I7VUFBQSxDQUFILENBQWYsRUFEbUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQyxFQXpCRztJQUFBLENBbk1MLENBQUE7O0FBQUEseUJBbU9BLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQU8sMENBQUosSUFBcUMsSUFBQyxDQUFBLFVBQVUsQ0FBQyxnQkFBWixLQUFnQyxFQUF4RTtlQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBYixDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLFVBQVUsQ0FBQyxpQkFIZDtPQURNO0lBQUEsQ0FuT1IsQ0FBQTs7QUFBQSx5QkF5T0EsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUVKLE1BQUEsSUFBRyw4QkFBQSxJQUFzQixzQ0FBekI7QUFDRSxRQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsUUFBVCxFQUFtQixJQUFuQixDQUFBLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixDQUFzQixNQUF0QixDQURBLENBQUE7ZUFFQSxJQUFDLENBQUEsZUFBZSxDQUFDLElBQWpCLENBQUEsRUFIRjtPQUZJO0lBQUEsQ0F6T04sQ0FBQTs7QUFBQSx5QkFnUEEsT0FBQSxHQUFTLFNBQUMsR0FBRCxFQUFNLElBQU4sR0FBQTtBQUNQLE1BQUEsSUFBQSxHQUFPLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxDQUFQLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxJQUFDLENBQUEsVUFBVSxDQUFDLE1BQVosQ0FBbUIsSUFBbkIsQ0FEUCxDQUFBO2FBR0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQWUsRUFBQSxDQUFHLFNBQUEsR0FBQTtlQUNoQixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsVUFBQSxPQUFBLEVBQVEsT0FBQSxHQUFNLEdBQWQ7U0FBTCxFQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFDekIsS0FBQyxDQUFBLEdBQUQsQ0FBSyxJQUFMLEVBRHlCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0IsRUFEZ0I7TUFBQSxDQUFILENBQWYsRUFKTztJQUFBLENBaFBULENBQUE7O3NCQUFBOztLQUR1QixLQVZ6QixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/sarah/.atom/packages/script/lib/script-view.coffee