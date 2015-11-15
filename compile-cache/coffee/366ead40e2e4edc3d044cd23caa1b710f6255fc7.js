(function() {
  var basename, exec, filenameMap, grammarMap, platform, plugin;

  basename = require('path').basename;

  exec = require('child_process').exec;

  platform = require('process').platform;

  grammarMap = require('./grammar-map');

  filenameMap = require('./filename-map');

  plugin = module.exports = {
    config: {
      grammars: {
        type: 'object',
        properties: {}
      },
      filenames: {
        type: 'object',
        properties: {}
      }
    },
    activate: function() {
      return atom.commands.add('atom-text-editor', {
        'dash:shortcut': (function(_this) {
          return function() {
            return _this.shortcut(true);
          };
        })(this),
        'dash:shortcut-alt': (function(_this) {
          return function() {
            return _this.shortcut(false);
          };
        })(this),
        'dash:context-menu': (function(_this) {
          return function() {
            return _this.shortcut(true);
          };
        })(this)
      });
    },
    shortcut: function(sensitive) {
      var currentScope, cursor, editor, range, scopes, selection, text;
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      selection = editor.getLastSelection().getText();
      if (selection) {
        return plugin.search(selection, sensitive);
      }
      cursor = editor.getLastCursor();
      scopes = cursor.getScopeDescriptor().getScopesArray();
      currentScope = scopes[scopes.length - 1];
      if (scopes.length < 2 || /^(?:comment|string|meta|markup)(?:\.|$)/.test(currentScope)) {
        return plugin.search(editor.getWordUnderCursor(), sensitive);
      }
      range = editor.displayBuffer.bufferRangeForScreenRange(editor.displayBuffer.bufferRangeForScopeAtPosition(currentScope, cursor.getScreenPosition()));
      if (range != null) {
        text = editor.getTextInBufferRange(range);
      } else {
        text = editor.getWordUnderCursor();
      }
      return plugin.search(text, sensitive);
    },
    search: function(string, sensitive, cb) {
      var activeEditor, cmd, language, path;
      activeEditor = atom.workspace.getActiveTextEditor();
      if (sensitive && activeEditor) {
        path = activeEditor.getPath();
        language = activeEditor.getGrammar().name;
      }
      cmd = this.getCommand(string, path, language);
      return exec(cmd, cb);
    },
    getCommand: function(string, path, language) {
      if (platform === 'win32') {
        return 'cmd.exe /c start "" "' + this.getDashURI(string, path, language) + '"';
      }
      if (platform === 'linux') {
        return this.getZealCommand(string, path, language);
      }
      return 'open -g "' + this.getDashURI(string, path, language) + '"';
    },
    getKeywordString: function(path, language) {
      var filename, filenameConfig, grammarConfig, keys;
      keys = [];
      if (path) {
        filename = basename(path).toLowerCase();
        filenameConfig = atom.config.get('dash.filenames') || {};
        keys = keys.concat(filenameConfig[filename] || filenameMap[filename] || []);
      }
      if (language) {
        grammarConfig = atom.config.get('dash.grammars') || {};
        keys = keys.concat(grammarConfig[language] || grammarMap[language] || []);
      }
      if (keys.length) {
        return keys.map(encodeURIComponent).join(',');
      }
    },
    getDashURI: function(string, path, language) {
      var keywords, link;
      link = 'dash-plugin://query=' + encodeURIComponent(string);
      keywords = this.getKeywordString(path, language);
      if (keywords) {
        link += '&keys=' + keywords;
      }
      return link;
    },
    getZealCommand: function(string, path, language) {
      var keywords, query;
      query = string;
      keywords = this.getKeywordString(path, language);
      if (keywords) {
        query = keywords + ':' + query;
      }
      return 'zeal --query "' + query + '"';
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2Rhc2gvbGliL2Rhc2guY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlEQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxRQUEzQixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUMsSUFEaEMsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsU0FBUixDQUFrQixDQUFDLFFBRjlCLENBQUE7O0FBQUEsRUFHQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FIYixDQUFBOztBQUFBLEVBSUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUpkLENBQUE7O0FBQUEsRUFNQSxNQUFBLEdBQVMsTUFBTSxDQUFDLE9BQVAsR0FHUDtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxVQUFBLEVBQVksRUFEWjtPQURGO0FBQUEsTUFHQSxTQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxVQUFBLEVBQVksRUFEWjtPQUpGO0tBREY7QUFBQSxJQVFBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDO0FBQUEsUUFDcEMsZUFBQSxFQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBTSxLQUFDLENBQUEsUUFBRCxDQUFVLElBQVYsRUFBTjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRG1CO0FBQUEsUUFFcEMsbUJBQUEsRUFBcUIsQ0FB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

//# sourceURL=/Users/sarah/.atom/packages/dash/lib/dash.coffee
