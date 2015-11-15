(function() {
  var CSON, File, Snippet, SnippetExpansion, SnippetsAvailable, async, fs, path, _;

  path = require('path');

  _ = require('underscore-plus');

  async = require('async');

  CSON = require('season');

  File = require('pathwatcher').File;

  fs = require('fs-plus');

  Snippet = require('./snippet');

  SnippetExpansion = require('./snippet-expansion');

  SnippetsAvailable = null;

  module.exports = {
    loaded: false,
    activate: function() {
      atom.workspace.registerOpener((function(_this) {
        return function(uri) {
          if (uri === 'atom://.atom/snippets') {
            return atom.workspaceView.open(_this.getUserSnippetsPath());
          }
        };
      })(this));
      this.loadAll();
      return atom.workspaceView.eachEditorView((function(_this) {
        return function(editorView) {
          if (editorView.attached) {
            return _this.enableSnippetsInEditor(editorView);
          }
        };
      })(this));
    },
    deactivate: function() {
      var _ref, _ref1;
      if ((_ref = this.userSnippetsFile) != null) {
        _ref.off();
      }
      return (_ref1 = this.editorSnippetExpansions) != null ? _ref1.clear() : void 0;
    },
    getUserSnippetsPath: function() {
      var userSnippetsPath;
      userSnippetsPath = CSON.resolve(path.join(atom.getConfigDirPath(), 'snippets'));
      return userSnippetsPath != null ? userSnippetsPath : path.join(atom.getConfigDirPath(), 'snippets.cson');
    },
    loadAll: function() {
      return this.loadBundledSnippets((function(_this) {
        return function() {
          return _this.loadUserSnippets(function() {
            return _this.loadPackageSnippets();
          });
        };
      })(this));
    },
    loadBundledSnippets: function(callback) {
      var bundledSnippetsPath;
      bundledSnippetsPath = CSON.resolve(path.join(__dirname, 'snippets'));
      return this.loadSnippetsFile(bundledSnippetsPath, callback);
    },
    loadUserSnippets: function(callback) {
      var userSnippetsPath, _ref;
      if ((_ref = this.userSnippetsFile) != null) {
        _ref.off();
      }
      userSnippetsPath = this.getUserSnippetsPath();
      return fs.stat(userSnippetsPath, (function(_this) {
        return function(error, stat) {
          if (stat != null ? stat.isFile() : void 0) {
            _this.userSnippetsFile = new File(userSnippetsPath);
            _this.userSnippetsFile.on('moved removed contents-changed', function() {
              atom.syntax.removeProperties(userSnippetsPath);
              return _this.loadUserSnippets();
            });
            return _this.loadSnippetsFile(userSnippetsPath, callback);
          } else {
            return typeof callback === "function" ? callback() : void 0;
          }
        };
      })(this));
    },
    loadPackageSnippets: function() {
      var pack, packages, snippetsDirPaths, _i, _len;
      packages = atom.packages.getLoadedPackages();
      snippetsDirPaths = [];
      for (_i = 0, _len = packages.length; _i < _len; _i++) {
        pack = packages[_i];
        snippetsDirPaths.push(path.join(pack.path, 'snippets'));
      }
      return async.eachSeries(snippetsDirPaths, this.loadSnippetsDirectory.bind(this), this.doneLoading.bind(this));
    },
    doneLoading: function() {
      atom.packages.emit('snippets:loaded');
      return this.loaded = true;
    },
    loadSnippetsDirectory: function(snippetsDirPath, callback) {
      if (!fs.isDirectorySync(snippetsDirPath)) {
        return typeof callback === "function" ? callback() : void 0;
      }
      return fs.readdir(snippetsDirPath, (function(_this) {
        return function(error, entries) {
          var paths;
          if (error != null) {
            console.warn(error);
            return typeof callback === "function" ? callback() : void 0;
          } else {
            paths = entries.map(function(file) {
              return path.join(snippetsDirPath, file);
            });
            return async.eachSeries(paths, _this.loadSnippetsFile.bind(_this), callback);
          }
        };
      })(this));
    },
    loadSnippetsFile: function(filePath, callback) {
      if (!CSON.isObjectPath(filePath)) {
        return typeof callback === "function" ? callback() : void 0;
      }
      return CSON.readFile(filePath, (function(_this) {
        return function(error, object) {
          var _ref;
          if (object == null) {
            object = {};
          }
          if (error != null) {
            console.warn("Error reading snippets file '" + filePath + "': " + ((_ref = error.stack) != null ? _ref : error));
          } else {
            _this.add(filePath, object);
          }
          return typeof callback === "function" ? callback() : void 0;
        };
      })(this));
    },
    add: function(filePath, snippetsBySelector) {
      var attributes, body, bodyTree, name, prefix, selector, snippet, snippetsByName, snippetsByPrefix, _results;
      _results = [];
      for (selector in snippetsBySelector) {
        snippetsByName = snippetsBySelector[selector];
        snippetsByPrefix = {};
        for (name in snippetsByName) {
          attributes = snippetsByName[name];
          prefix = attributes.prefix, body = attributes.body, bodyTree = attributes.bodyTree;
          if (typeof body !== 'string') {
            continue;
          }
          if (bodyTree == null) {
            bodyTree = this.getBodyParser().parse(body);
          }
          snippet = new Snippet({
            name: name,
            prefix: prefix,
            bodyTree: bodyTree,
            bodyText: body
          });
          snippetsByPrefix[snippet.prefix] = snippet;
        }
        _results.push(atom.syntax.addProperties(filePath, selector, {
          snippets: snippetsByPrefix
        }));
      }
      return _results;
    },
    getBodyParser: function() {
      return this.bodyParser != null ? this.bodyParser : this.bodyParser = require('./snippet-body-parser');
    },
    getPrefixText: function(snippets, editor) {
      var cursor, cursors, prefixStart, wordRegex, _i, _len, _results;
      wordRegex = this.wordRegexForSnippets(snippets);
      cursors = editor.getCursors();
      _results = [];
      for (_i = 0, _len = cursors.length; _i < _len; _i++) {
        cursor = cursors[_i];
        prefixStart = cursor.getBeginningOfCurrentWordBufferPosition({
          wordRegex: wordRegex
        });
        _results.push(editor.getTextInRange([prefixStart, cursor.getBufferPosition()]));
      }
      return _results;
    },
    enableSnippetsInEditor: function(editorView) {
      var editor;
      editor = editorView.getEditor();
      this.clearExpansions(editor);
      editorView.command('snippets:expand', (function(_this) {
        return function(event) {
          if (_this.snippetToExpandUnderCursor(editor)) {
            _this.clearExpansions(editor);
            return _this.expandSnippetsUnderCursors(editor);
          } else {
            return event.abortKeyBinding();
          }
        };
      })(this));
      editorView.command('snippets:next-tab-stop', (function(_this) {
        return function(event) {
          if (!_this.goToNextTabStop(editor)) {
            return event.abortKeyBinding();
          }
        };
      })(this));
      editorView.command('snippets:previous-tab-stop', (function(_this) {
        return function(event) {
          if (!_this.goToPreviousTabStop(editor)) {
            return event.abortKeyBinding();
          }
        };
      })(this));
      return editorView.command('snippets:available', (function(_this) {
        return function(event) {
          if (SnippetsAvailable == null) {
            SnippetsAvailable = require('./snippets-available');
          }
          if (_this.availableSnippetsView == null) {
            _this.availableSnippetsView = new SnippetsAvailable(_this);
          }
          return _this.availableSnippetsView.toggle(editor);
        };
      })(this));
    },
    wordRegexForSnippets: function(snippets) {
      var character, prefix, prefixCharacters, prefixes, _i, _len;
      prefixes = {};
      for (prefix in snippets) {
        for (_i = 0, _len = prefix.length; _i < _len; _i++) {
          character = prefix[_i];
          prefixes[character] = true;
        }
      }
      prefixCharacters = Object.keys(prefixes).join('');
      return new RegExp("[" + (_.escapeRegExp(prefixCharacters)) + "]+");
    },
    snippetForPrefix: function(snippets, prefix) {
      var longestPrefixMatch, snippet, snippetPrefix;
      longestPrefixMatch = null;
      for (snippetPrefix in snippets) {
        snippet = snippets[snippetPrefix];
        if (snippetPrefix === prefix) {
          longestPrefixMatch = snippet;
          break;
        } else if (_.endsWith(prefix, snippetPrefix)) {
          if (longestPrefixMatch == null) {
            longestPrefixMatch = snippet;
          }
          if (snippetPrefix.length > longestPrefixMatch.prefix.length) {
            longestPrefixMatch = snippet;
          }
        }
      }
      return longestPrefixMatch;
    },
    getSnippets: function(editor) {
      var properties, scope, snippet, snippetPrefix, snippetProperties, snippets, _i, _len, _ref, _ref1;
      scope = editor.getCursorScopes();
      snippets = {};
      _ref = atom.syntax.propertiesForScope(scope, 'snippets');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        properties = _ref[_i];
        snippetProperties = (_ref1 = _.valueForKeyPath(properties, 'snippets')) != null ? _ref1 : {};
        for (snippetPrefix in snippetProperties) {
          snippet = snippetProperties[snippetPrefix];
          if (snippets[snippetPrefix] == null) {
            snippets[snippetPrefix] = snippet;
          }
        }
      }
      return snippets;
    },
    snippetToExpandUnderCursor: function(editor) {
      var prefix, snippets;
      if (!editor.getSelection().isEmpty()) {
        return false;
      }
      snippets = this.getSnippets(editor);
      if (_.isEmpty(snippets)) {
        return false;
      }
      prefix = this.getPrefixText(snippets, editor);
      if (!(prefix && _.uniq(prefix).length === 1)) {
        return false;
      }
      prefix = prefix[0];
      return this.snippetForPrefix(snippets, prefix);
    },
    expandSnippetsUnderCursors: function(editor) {
      var snippet;
      if (!(snippet = this.snippetToExpandUnderCursor(editor))) {
        return false;
      }
      editor.transact((function(_this) {
        return function() {
          var cursor, cursorPosition, cursors, startPoint, _i, _len, _results;
          cursors = editor.getCursors();
          _results = [];
          for (_i = 0, _len = cursors.length; _i < _len; _i++) {
            cursor = cursors[_i];
            cursorPosition = cursor.getBufferPosition();
            startPoint = cursorPosition.translate([0, -snippet.prefix.length], [0, 0]);
            cursor.selection.setBufferRange([startPoint, cursorPosition]);
            _results.push(_this.insert(snippet, editor, cursor));
          }
          return _results;
        };
      })(this));
      return true;
    },
    goToNextTabStop: function(editor) {
      var expansion, nextTabStopVisited, _i, _len, _ref;
      if (this.snippetToExpandUnderCursor(editor)) {
        return false;
      }
      nextTabStopVisited = false;
      _ref = this.getExpansions(editor);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        expansion = _ref[_i];
        if (expansion != null ? expansion.goToNextTabStop() : void 0) {
          nextTabStopVisited = true;
        }
      }
      return nextTabStopVisited;
    },
    goToPreviousTabStop: function(editor) {
      var expansion, previousTabStopVisited, _i, _len, _ref;
      previousTabStopVisited = false;
      _ref = this.getExpansions(editor);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        expansion = _ref[_i];
        if (expansion != null ? expansion.goToPreviousTabStop() : void 0) {
          previousTabStopVisited = true;
        }
      }
      return previousTabStopVisited;
    },
    getExpansions: function(editor) {
      var _ref, _ref1;
      return (_ref = (_ref1 = this.editorSnippetExpansions) != null ? _ref1.get(editor) : void 0) != null ? _ref : [];
    },
    clearExpansions: function(editor) {
      if (this.editorSnippetExpansions == null) {
        this.editorSnippetExpansions = new WeakMap();
      }
      return this.editorSnippetExpansions.set(editor, []);
    },
    addExpansion: function(editor, snippetExpansion) {
      return this.getExpansions(editor).push(snippetExpansion);
    },
    insert: function(snippet, editor, cursor) {
      var bodyTree;
      if (editor == null) {
        editor = atom.workspace.getActiveEditor();
      }
      if (cursor == null) {
        cursor = editor.getCursor();
      }
      if (typeof snippet === 'string') {
        bodyTree = this.getBodyParser().parse(snippet);
        snippet = new Snippet({
          name: '__anonymous',
          prefix: '',
          bodyTree: bodyTree,
          bodyText: snippet
        });
      }
      return new SnippetExpansion(snippet, editor, cursor, this);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRFQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FGSixDQUFBOztBQUFBLEVBR0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBSFIsQ0FBQTs7QUFBQSxFQUlBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQUpQLENBQUE7O0FBQUEsRUFLQyxPQUFRLE9BQUEsQ0FBUSxhQUFSLEVBQVIsSUFMRCxDQUFBOztBQUFBLEVBTUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBTkwsQ0FBQTs7QUFBQSxFQVFBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQVJWLENBQUE7O0FBQUEsRUFTQSxnQkFBQSxHQUFtQixPQUFBLENBQVEscUJBQVIsQ0FUbkIsQ0FBQTs7QUFBQSxFQVVBLGlCQUFBLEdBQW9CLElBVnBCLENBQUE7O0FBQUEsRUFZQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQVEsS0FBUjtBQUFBLElBRUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQThCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEdBQUQsR0FBQTtBQUM1QixVQUFBLElBQUcsR0FBQSxLQUFPLHVCQUFWO21CQUNFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBbkIsQ0FBd0IsS0FBQyxDQUFBLG1CQUFELENBQUEsQ0FBeEIsRUFERjtXQUQ0QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCLENBQUEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUpBLENB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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-clang/node_modules/snippets/lib/snippets.coffee