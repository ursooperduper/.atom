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
    exec: exec,
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
      var currentScope, cursor, displayBufferRange, editor, range, scopes, selection, text;
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
      displayBufferRange = editor.displayBuffer.bufferRangeForScopeAtPosition(currentScope, cursor.getScreenPosition());
      if (displayBufferRange) {
        range = editor.displayBuffer.bufferRangeForScreenRange(displayBufferRange);
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
      return plugin.exec(cmd, cb);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2Rhc2gvbGliL2Rhc2guY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlEQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxRQUEzQixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUMsSUFEaEMsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsU0FBUixDQUFrQixDQUFDLFFBRjlCLENBQUE7O0FBQUEsRUFHQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FIYixDQUFBOztBQUFBLEVBSUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUpkLENBQUE7O0FBQUEsRUFNQSxNQUFBLEdBQVMsTUFBTSxDQUFDLE9BQVAsR0FHUDtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxVQUFBLEVBQVksRUFEWjtPQURGO0FBQUEsTUFHQSxTQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxVQUFBLEVBQVksRUFEWjtPQUpGO0tBREY7QUFBQSxJQVNBLElBQUEsRUFBTSxJQVROO0FBQUEsSUFXQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQztBQUFBLFFBQ3BDLGVBQUEsRUFBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQU0sS0FBQyxDQUFBLFFBQUQsQ0FBVSxJQUFWLEVBQU47VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURtQjtB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

//# sourceURL=/Users/sarah/.atom/packages/dash/lib/dash.coffee
