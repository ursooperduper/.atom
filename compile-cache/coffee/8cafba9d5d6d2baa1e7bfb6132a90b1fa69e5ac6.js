(function() {
  var Builder, Emitter, JekyllEmitter, JekyllNewPostView, JekyllToolbarView, Server, fs;

  fs = require('fs-plus');

  Emitter = require('atom').Emitter;

  JekyllEmitter = new Emitter;

  JekyllNewPostView = require('./new-post-view');

  JekyllToolbarView = require('./toolbar-view');

  Builder = require('./server/build');

  Server = require('./server/server');

  module.exports = {
    jekyllNewPostView: null,
    config: {
      layoutsDir: {
        type: 'string',
        "default": '_layouts/'
      },
      layoutsType: {
        type: 'string',
        "default": '.html'
      },
      postsDir: {
        type: 'string',
        "default": '_posts/'
      },
      postsType: {
        type: 'string',
        "default": '.markdown'
      },
      includesDir: {
        type: 'string',
        "default": '_includes/'
      },
      dataDir: {
        type: 'string',
        "default": '_data/'
      },
      draftByDefault: {
        type: 'boolean',
        "default": false
      },
      draftsDir: {
        type: 'string',
        "default": '_drafts/'
      },
      serverPort: {
        type: 'integer',
        "default": 3000
      },
      buildCommand: {
        type: 'array',
        "default": ['jekyll', 'build'],
        items: {
          type: 'string'
        }
      },
      siteDir: {
        type: 'string',
        "default": '_site/'
      }
    },
    activate: function() {
      var _ref;
      atom.commands.add('atom-workspace', "jekyll:open-layout", (function(_this) {
        return function() {
          return _this.openLayout();
        };
      })(this));
      atom.commands.add('atom-workspace', "jekyll:open-config", (function(_this) {
        return function() {
          return _this.openConfig();
        };
      })(this));
      atom.commands.add('atom-workspace', "jekyll:open-include", (function(_this) {
        return function() {
          return _this.openInclude();
        };
      })(this));
      atom.commands.add('atom-workspace', "jekyll:open-data", (function(_this) {
        return function() {
          return _this.openData();
        };
      })(this));
      atom.commands.add('atom-workspace', "jekyll:toolbar", (function(_this) {
        return function() {
          return _this.toolbar();
        };
      })(this));
      atom.commands.add('atom-workspace', "jekyll:toggle-server", (function(_this) {
        return function() {
          return _this.toggleServer();
        };
      })(this));
      atom.commands.add('atom-workspace', 'jekyll:new-post', (function(_this) {
        return function() {
          return _this.newPost();
        };
      })(this));
      atom.commands.add('atom-workspace', 'jekyll:build-site', (function(_this) {
        return function() {
          return _this.buildSite();
        };
      })(this));
      atom.commands.add('atom-workspace', 'jekyll:publish-draft', (function(_this) {
        return function() {
          return _this.publishDraft();
        };
      })(this));
      this.jekyllNewPostView = new JekyllNewPostView();
      if (typeof this.toolbarView === 'undefined') {
        this.toolbarView = new JekyllToolbarView(JekyllEmitter);
      }
      this.toolbarPanel = atom.workspace.addBottomPanel({
        item: this.toolbarView,
        visible: false,
        className: 'tool-panel panel-bottom'
      });
      this.toolbarView.setPanel(this.toolbarPanel);
      return (_ref = atom.workspace.statusBar) != null ? _ref.appendRight(new JekyllStatusBar(JekyllEmitter)) : void 0;
    },
    deactivate: function() {
      return Server.stop();
    },
    serialize: function() {
      return Server.stop();
    },
    showError: function(message) {
      return console.log(message);
    },
    openLayout: function() {
      var activeEditor, contents, error, layout;
      activeEditor = atom.workspace.getActiveTextEditor();
      contents = activeEditor.getText();
      try {
        layout = this.scan(contents, /layout: (.*?)[\r\n|\n\r|\r|\n]/g)[0][0];
        return atom.workspace.open(atom.config.get('jekyll.layoutsDir') + layout + atom.config.get('jekyll.layoutsType'));
      } catch (_error) {
        error = _error;
        return this.showError(error.message);
      }
    },
    openInclude: function() {
      var activeEditor, error, include, line;
      activeEditor = atom.workspace.getActiveTextEditor();
      line = activeEditor.getCursor().getCurrentBufferLine();
      try {
        include = this.scan(line, /{% include (.*?)%}/g)[0][0].split(" ")[0];
        return atom.workspace.open(atom.config.get('jekyll.includesDir') + include);
      } catch (_error) {
        error = _error;
        return this.showError(error.message);
      }
    },
    openConfig: function() {
      return atom.workspace.open("_config.yml");
    },
    openData: function() {
      var activeEditor, data, error, line;
      activeEditor = atom.workspace.getActiveTextEditor();
      line = activeEditor.getCursor().getCurrentBufferLine();
      try {
        data = this.scan(line, /site\.data\.(.*?) /g)[0][0].split(" ")[0];
        return atom.workspace.open(atom.config.get('jekyll.dataDir') + data + ".yml");
      } catch (_error) {
        error = _error;
        return this.showError(error.message);
      }
    },
    manage: function() {
      return atom.workspace.open('atom://jekyll');
    },
    toolbar: function() {
      this.toolbarPanel.show();
      return this.toolbarView.refresh(Server);
    },
    scan: function(string, pattern) {
      var matches, results;
      matches = [];
      results = [];
      while (matches = pattern.exec(string)) {
        matches.shift();
        results.push(matches);
      }
      return results;
    },
    toggleServer: function() {
      return Server.toggle();
    },
    newPost: function() {
      this.jekyllNewPostView.attach();
      return this.jekyllNewPostView.miniEditor.focus();
    },
    buildSite: function() {
      return Builder.build();
    },
    publishDraft: function() {
      var activeEditor, contents, currentFileName, currentFilePath, newContents, newFileName, newFilePath, _ref, _ref1;
      activeEditor = atom.workspace.getActiveTextEditor();
      activeEditor.save();
      currentFilePath = activeEditor != null ? (_ref = activeEditor.buffer) != null ? (_ref1 = _ref.file) != null ? _ref1.path : void 0 : void 0 : void 0;
      currentFileName = currentFilePath.split("/").reverse()[0];
      newFileName = this.generateFileName(this.getPostTitle(activeEditor));
      newFilePath = currentFilePath.replace(atom.config.get('jekyll.draftsDir') + currentFileName, atom.config.get('jekyll.postsDir') + newFileName) + atom.config.get('jekyll.postsType');
      contents = activeEditor.getText();
      newContents = contents.replace(/date: "[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}"/, "date: \"" + (this.generateDateString()) + "\"");
      fs.writeFileSync(newFilePath, newContents);
      fs.unlinkSync(currentFilePath);
      atom.workspace.open(newFilePath);
      return activeEditor.destroy();
    },
    getPostTitle: function(editor) {
      var contents, title;
      contents = editor.getText();
      return title = this.scan(contents, /title: (.*?)[\r\n|\n\r|\r|\n]/g)[0][0];
    },
    generateFileName: function(title) {
      var titleString;
      titleString = title.toLowerCase().replace(/[^\w\s]|_/g, "").replace(RegExp(" ", 'g'), "-");
      return this.generateDateString() + '-' + titleString;
    },
    generateDateString: function(currentTime) {
      if (currentTime == null) {
        currentTime = new Date();
      }
      return currentTime.getFullYear() + "-" + ("0" + (currentTime.getMonth() + 1)).slice(-2) + "-" + ("0" + currentTime.getDate()).slice(-2);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2pla3lsbC9saWIvamVreWxsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpRkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUFMLENBQUE7O0FBQUEsRUFFQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FGRCxDQUFBOztBQUFBLEVBR0EsYUFBQSxHQUFnQixHQUFBLENBQUEsT0FIaEIsQ0FBQTs7QUFBQSxFQUtBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSxpQkFBUixDQUxwQixDQUFBOztBQUFBLEVBTUEsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLGdCQUFSLENBTnBCLENBQUE7O0FBQUEsRUFRQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGdCQUFSLENBUlYsQ0FBQTs7QUFBQSxFQVNBLE1BQUEsR0FBUyxPQUFBLENBQVEsaUJBQVIsQ0FUVCxDQUFBOztBQUFBLEVBV0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsaUJBQUEsRUFBbUIsSUFBbkI7QUFBQSxJQUVBLE1BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLFdBRFQ7T0FERjtBQUFBLE1BR0EsV0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLE9BRFQ7T0FKRjtBQUFBLE1BTUEsUUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLFNBRFQ7T0FQRjtBQUFBLE1BU0EsU0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLFdBRFQ7T0FWRjtBQUFBLE1BWUEs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

//# sourceURL=/Users/sarah/.atom/packages/jekyll/lib/jekyll.coffee
