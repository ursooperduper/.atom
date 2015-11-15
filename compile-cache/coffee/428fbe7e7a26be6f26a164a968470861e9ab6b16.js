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
      atom.workspaceView.command('script:run-by-line-number', (function(_this) {
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
      codeContext = this.buildCodeContext('Line Number Based');
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
      if (argType === 'Line Number Based') {
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
      if (codeContext.argType === 'Line Number Based') {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtIQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FBYixDQUFBOztBQUFBLEVBQ0EsT0FBOEIsT0FBQSxDQUFRLE1BQVIsQ0FBOUIsRUFBQyxZQUFBLElBQUQsRUFBTyx1QkFBQSxlQUFQLEVBQXdCLFVBQUEsRUFEeEIsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FGZCxDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBSGIsQ0FBQTs7QUFBQSxFQUlBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx1QkFBUixDQUpwQixDQUFBOztBQUFBLEVBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBTGIsQ0FBQTs7QUFBQSxFQU1BLENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUixDQU5KLENBQUE7O0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsVUFBQyxDQUFBLGVBQUQsR0FBa0IsSUFBbEIsQ0FBQTs7QUFBQSxJQUVBLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ0gsY0FBQSxHQUFBO0FBQUEsVUFBQSxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBMkIsSUFBQSxVQUFBLENBQUEsQ0FBM0IsQ0FBQSxDQUFBO0FBQUEsVUFHQSxHQUFBLEdBQU0sdUVBSE4sQ0FBQTtpQkFLQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sR0FBUDtBQUFBLFlBQVksTUFBQSxFQUFR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
//# sourceURL=/Users/sarah/.atom/packages/script/lib/script-view.coffee