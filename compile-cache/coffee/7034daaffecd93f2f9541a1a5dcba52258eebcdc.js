(function() {
  var CmdModule, CompositeDisposable, basicConfig, config,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require("atom").CompositeDisposable;

  config = require("./config");

  basicConfig = require("./config-basic");

  CmdModule = {};

  module.exports = {
    config: basicConfig,
    activate: function() {
      this.disposables = new CompositeDisposable();
      this.registerWorkspaceCommands();
      return this.registerEditorCommands();
    },
    registerWorkspaceCommands: function() {
      var workspaceCommands;
      workspaceCommands = {};
      ["draft", "post"].forEach((function(_this) {
        return function(file) {
          return workspaceCommands["markdown-writer:new-" + file] = _this.registerView("./views/new-" + file + "-view", {
            optOutGrammars: true
          });
        };
      })(this));
      ["open-cheat-sheet", "create-default-keymaps"].forEach((function(_this) {
        return function(command) {
          return workspaceCommands["markdown-writer:" + command] = _this.registerCommand("./commands/" + command, {
            optOutGrammars: true
          });
        };
      })(this));
      return this.disposables.add(atom.commands.add("atom-workspace", workspaceCommands));
    },
    registerEditorCommands: function() {
      var editorCommands;
      editorCommands = {};
      ["tags", "categories"].forEach((function(_this) {
        return function(attr) {
          return editorCommands["markdown-writer:manage-post-" + attr] = _this.registerView("./views/manage-post-" + attr + "-view");
        };
      })(this));
      ["link", "image", "table"].forEach((function(_this) {
        return function(media) {
          return editorCommands["markdown-writer:insert-" + media] = _this.registerView("./views/insert-" + media + "-view");
        };
      })(this));
      ["code", "codeblock", "bold", "italic", "keystroke", "strikethrough"].forEach((function(_this) {
        return function(style) {
          return editorCommands["markdown-writer:toggle-" + style + "-text"] = _this.registerCommand("./commands/style-text", {
            args: style
          });
        };
      })(this));
      ["h1", "h2", "h3", "h4", "h5", "ul", "ol", "task", "taskdone", "blockquote"].forEach((function(_this) {
        return function(style) {
          return editorCommands["markdown-writer:toggle-" + style] = _this.registerCommand("./commands/style-line", {
            args: style
          });
        };
      })(this));
      ["previous-heading", "next-heading", "next-table-cell", "reference-definition"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:jump-to-" + command] = _this.registerCommand("./commands/jump-to", {
            args: command
          });
        };
      })(this));
      ["insert-new-line", "indent-list-line"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/edit-line", {
            args: command
          });
        };
      })(this));
      ["correct-order-list-numbers", "format-table"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/format-text", {
            args: command
          });
        };
      })(this));
      ["publish-draft"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/" + command);
        };
      })(this));
      return this.disposables.add(atom.commands.add("atom-text-editor", editorCommands));
    },
    registerView: function(path, options) {
      if (options == null) {
        options = {};
      }
      return (function(_this) {
        return function(e) {
          var cmdInstance;
          if (!(options.optOutGrammars || _this.isMarkdown())) {
            return e.abortKeyBinding();
          }
          if (CmdModule[path] == null) {
            CmdModule[path] = require(path);
          }
          cmdInstance = new CmdModule[path](options.args);
          return cmdInstance.display();
        };
      })(this);
    },
    registerCommand: function(path, options) {
      if (options == null) {
        options = {};
      }
      return (function(_this) {
        return function(e) {
          var cmdInstance;
          if (!(options.optOutGrammars || _this.isMarkdown())) {
            return e.abortKeyBinding();
          }
          if (CmdModule[path] == null) {
            CmdModule[path] = require(path);
          }
          cmdInstance = new CmdModule[path](options.args);
          return cmdInstance.trigger(e);
        };
      })(this);
    },
    isMarkdown: function() {
      var editor, _ref;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return false;
      }
      return _ref = editor.getGrammar().scopeName, __indexOf.call(config.get("grammars"), _ref) >= 0;
    },
    deactivate: function() {
      this.disposables.dispose();
      return CmdModule = {};
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvbWFya2Rvd24td3JpdGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtREFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FGVCxDQUFBOztBQUFBLEVBR0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUhkLENBQUE7O0FBQUEsRUFLQSxTQUFBLEdBQVksRUFMWixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUFRLFdBQVI7QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsbUJBQUEsQ0FBQSxDQUFuQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEseUJBQUQsQ0FBQSxDQUZBLENBQUE7YUFHQSxJQUFDLENBQUEsc0JBQUQsQ0FBQSxFQUpRO0lBQUEsQ0FGVjtBQUFBLElBUUEseUJBQUEsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLFVBQUEsaUJBQUE7QUFBQSxNQUFBLGlCQUFBLEdBQW9CLEVBQXBCLENBQUE7QUFBQSxNQUVBLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7aUJBQ3hCLGlCQUFrQixDQUFDLHNCQUFBLEdBQXNCLElBQXZCLENBQWxCLEdBQ0UsS0FBQyxDQUFBLFlBQUQsQ0FBZSxjQUFBLEdBQWMsSUFBZCxHQUFtQixPQUFsQyxFQUEwQztBQUFBLFlBQUEsY0FBQSxFQUFnQixJQUFoQjtXQUExQyxFQUZzQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCLENBRkEsQ0FBQTtBQUFBLE1BTUEsQ0FBQyxrQkFBRCxFQUFxQix3QkFBckIsQ0FBOEMsQ0FBQyxPQUEvQyxDQUF1RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEdBQUE7aUJBQ3JELGlCQUFrQixDQUFDLGtCQUFBLEdBQWtCLE9BQW5CLENBQWxCLEdBQ0UsS0FBQyxDQUFBLGVBQUQsQ0FBa0IsYUFBQSxHQUFhLE9BQS9CLEVBQTBDO0FBQUEsWUFBQSxjQUFBLEVBQWdCLElBQWhCO1dBQTFDLEVBRm1EO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkQsQ0FOQSxDQUFBO2FBVUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsaUJBQXBDLENBQWpCLEVBWHlCO0lBQUEsQ0FSM0I7QUFBQSxJQXFCQSxzQkFBQSxFQUF3QixTQUFBLEdBQUE7QUFDdEIsVUFBQSxjQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWlCLEVBQWpCLENBQUE7QUFBQSxNQUVBLENBQUMsTUFBRCxFQUFTLFlBQVQsQ0FBc0IsQ0FBQyxPQUF2QixDQUErQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7aUJBQzdCLGNBQWUsQ0FBQyw4QkFBQSxHQUE4QixJQUEvQixDQUFmLEdBQ0UsS0FBQyxDQUFBLFlBQUQsQ0FBZSxzQkFBQSxHQUFzQixJQUF0QixHQUEyQixPQUExQyxFQUYyQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9CLENBRkEsQ0FBQTtBQUFBLE1BTUEsQ0FBQyxNQUFELEVBQVMsT0FBVCxFQUFrQixPQUFsQixDQUEwQixDQUFDLE9BQTNCLENBQW1DLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtpQkFDakMsY0FBZSxDQUFDLHlCQUFBLEdBQXlCLEtBQTFCLENBQWYsR0FDRSxLQUFDLENBQUEsWUFBRCxDQUFlLGlCQUFBLEdBQWlCLEtBQWpCLEdBQXVCLE9BQXRDLEVBRitCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkMsQ0FOQSxDQUFBO0FBQUEsTUFVQSxDQUFDLE1BQUQsRUFBUyxXQUFULEVBQXNCLE1BQXRCLEVBQThCLFFBQTlCLEVBQ0MsV0FERCxFQUNjLGVBRGQsQ0FDOEIsQ0FBQyxPQUQvQixDQUN1QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7aUJBQ3JDLGNBQWUsQ0FBQyx5QkFBQSxHQUF5QixLQUF6QixHQUErQixPQUFoQyxDQUFmLEdBQ0UsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsdUJBQWpCLEVBQTBDO0FBQUEsWUFBQSxJQUFBLEVBQU0sS0FBTjtXQUExQyxFQUZtQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRHZDLENBVkEsQ0FBQTtBQUFBLE1BZUEsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsRUFBK0IsSUFBL0IsRUFBcUMsSUFBckMsRUFDQyxNQURELEVBQ1MsVUFEVCxFQUNxQixZQURyQixDQUNrQyxDQUFDLE9BRG5DLENBQzJDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtpQkFDekMsY0FBZSxDQUFDLHlCQUFBLEdBQXlCLEtBQTFCLENBQWYsR0FDRSxLQUFDLENBQUEsZUFBRCxDQUFpQix1QkFBakIsRUFBMEM7QUFBQSxZQUFBLElBQUEsRUFBTSxLQUFOO1dBQTFDLEVBRnVDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEM0MsQ0FmQSxDQUFBO0FBQUEsTUFvQkEsQ0FBQyxrQkFBRCxFQUFxQixjQUFyQixFQUFxQyxpQkFBckMsRUFDQyxzQkFERCxDQUN3QixDQUFDLE9BRHpCLENBQ2lDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsR0FBQTtpQkFDL0IsY0FBZSxDQUFDLDBCQUFBLEdBQTBCLE9BQTNCLENBQWYsR0FDRSxLQUFDLENBQUEsZUFBRCxDQUFpQixvQkFBakIsRUFBdUM7QUFBQSxZQUFBLElBQUEsRUFBTSxPQUFOO1dBQXZDLEVBRjZCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEakMsQ0FwQkEsQ0FBQTtBQUFBLE1BeUJBLENBQUMsaUJBQUQsRUFBb0Isa0JBQXBCLENBQXVDLENBQUMsT0FBeEMsQ0FBZ0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxHQUFBO2lCQUM5QyxjQUFlLENBQUMsa0JBQUEsR0FBa0IsT0FBbkIsQ0FBZixHQUNFLEtBQUMsQ0FBQSxlQUFELENBQWlCLHNCQUFqQixFQUF5QztBQUFBLFlBQUEsSUFBQSxFQUFNLE9BQU47V0FBekMsRUFGNEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRCxDQXpCQSxDQUFBO0FBQUEsTUE2QkEsQ0FBQyw0QkFBRCxFQUErQixjQUEvQixDQUE4QyxDQUFDLE9BQS9DLENBQXVELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsR0FBQTtpQkFDckQsY0FBZSxDQUFDLGtCQUFBLEdBQWtCLE9BQW5CLENBQWYsR0FDRSxLQUFDLENBQUEsZUFBRCxDQUFpQix3QkFBakIsRUFBMkM7QUFBQSxZQUFBLElBQUEsRUFBTSxPQUFOO1dBQTNDLEVBRm1EO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkQsQ0E3QkEsQ0FBQTtBQUFBLE1BaUNBLENBQUMsZUFBRCxDQUFpQixDQUFDLE9BQWxCLENBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsR0FBQTtpQkFDeEIsY0FBZSxDQUFDLGtCQUFBLEdBQWtCLE9BQW5CLENBQWYsR0FDRSxLQUFDLENBQUEsZUFBRCxDQUFrQixhQUFBLEdBQWEsT0FBL0IsRUFGc0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQixDQWpDQSxDQUFBO2FBcUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLGNBQXRDLENBQWpCLEVBdENzQjtJQUFBLENBckJ4QjtBQUFBLElBNkRBLFlBQUEsRUFBYyxTQUFDLElBQUQsRUFBTyxPQUFQLEdBQUE7O1FBQU8sVUFBVTtPQUM3QjthQUFBLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtBQUNFLGNBQUEsV0FBQTtBQUFBLFVBQUEsSUFBQSxDQUFBLENBQU8sT0FBTyxDQUFDLGNBQVIsSUFBMEIsS0FBQyxDQUFBLFVBQUQsQ0FBQSxDQUFqQyxDQUFBO0FBQ0UsbUJBQU8sQ0FBQyxDQUFDLGVBQUYsQ0FBQSxDQUFQLENBREY7V0FBQTs7WUFHQSxTQUFVLENBQUEsSUFBQSxJQUFTLE9BQUEsQ0FBUSxJQUFSO1dBSG5CO0FBQUEsVUFJQSxXQUFBLEdBQWtCLElBQUEsU0FBVSxDQUFBLElBQUEsQ0FBVixDQUFnQixPQUFPLENBQUMsSUFBeEIsQ0FKbEIsQ0FBQTtpQkFLQSxXQUFXLENBQUMsT0FBWixDQUFBLEVBTkY7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxFQURZO0lBQUEsQ0E3RGQ7QUFBQSxJQXNFQSxlQUFBLEVBQWlCLFNBQUMsSUFBRCxFQUFPLE9BQVAsR0FBQTs7UUFBTyxVQUFVO09BQ2hDO2FBQUEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQ0UsY0FBQSxXQUFBO0FBQUEsVUFBQSxJQUFBLENBQUEsQ0FBTyxPQUFPLENBQUMsY0FBUixJQUEwQixLQUFDLENBQUEsVUFBRCxDQUFBLENBQWpDLENBQUE7QUFDRSxtQkFBTyxDQUFDLENBQUMsZUFBRixDQUFBLENBQVAsQ0FERjtXQUFBOztZQUdBLFNBQVUsQ0FBQSxJQUFBLElBQVMsT0FBQSxDQUFRLElBQVI7V0FIbkI7QUFBQSxVQUlBLFdBQUEsR0FBa0IsSUFBQSxTQUFVLENBQUEsSUFBQSxDQUFWLENBQWdCLE9BQU8sQ0FBQyxJQUF4QixDQUpsQixDQUFBO2lCQUtBLFdBQVcsQ0FBQyxPQUFaLENBQW9CLENBQXBCLEVBTkY7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxFQURlO0lBQUEsQ0F0RWpCO0FBQUEsSUErRUEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsWUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFDQSxNQUFBLElBQW9CLGNBQXBCO0FBQUEsZUFBTyxLQUFQLENBQUE7T0FEQTtBQUVBLG9CQUFPLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBbUIsQ0FBQyxTQUFwQixFQUFBLGVBQWlDLE1BQU0sQ0FBQyxHQUFQLENBQVcsVUFBWCxDQUFqQyxFQUFBLElBQUEsTUFBUCxDQUhVO0lBQUEsQ0EvRVo7QUFBQSxJQW9GQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxDQUFBLENBQUE7YUFDQSxTQUFBLEdBQVksR0FGRjtJQUFBLENBcEZaO0dBUkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/lib/markdown-writer.coffee
