(function() {
  var Builder, StaticServer, path;

  path = require('path');

  Builder = require('./build');

  StaticServer = require('static-server');

  module.exports = {
    server: null,
    disposables: [],
    toggle: function() {
      if (this.server === null) {
        return this.start();
      } else {
        return this.stop();
      }
    },
    start: function() {
      Builder.build();
      this.server = new StaticServer({
        rootPath: path.join(atom.project.getPaths()[0], atom.config.get('jekyll.siteDir')),
        name: 'jekyll-atom',
        port: atom.config.get('jekyll.serverPort')
      });
      this.server.start((function(_this) {
        return function() {
          return _this.serverStarted();
        };
      })(this));
      return this.disposables.push(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.didOpenFile(editor);
        };
      })(this)));
    },
    stop: function() {
      var disposable, _i, _len, _ref;
      this.server.stop();
      this.server = null;
      _ref = this.disposables;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        disposable = _ref[_i];
        disposable.dispose();
      }
      return atom.notifications.addInfo('Jekyll server stopped');
    },
    serverStarted: function() {
      var editor, _i, _len, _ref, _results;
      atom.notifications.addSuccess('Jekyll site avliable at http://localhost:' + atom.config.get('jekyll.serverPort'));
      _ref = atom.workspace.getTextEditors();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        editor = _ref[_i];
        _results.push(this.didOpenFile(editor));
      }
      return _results;
    },
    didOpenFile: function(editor) {
      return this.disposables.push(editor.buffer.emitter.on('did-save', function() {
        return Builder.build();
      }));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2pla3lsbC9saWIvc2VydmVyL3NlcnZlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkJBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBRlYsQ0FBQTs7QUFBQSxFQUdBLFlBQUEsR0FBZSxPQUFBLENBQVEsZUFBUixDQUhmLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQVEsSUFBUjtBQUFBLElBQ0EsV0FBQSxFQUFhLEVBRGI7QUFBQSxJQUdBLE1BQUEsRUFBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQUcsSUFBQyxDQUFBLE1BQUQsS0FBVyxJQUFkO2VBQ0UsSUFBQyxDQUFBLEtBQUQsQ0FBQSxFQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxJQUFELENBQUEsRUFIRjtPQURNO0lBQUEsQ0FIUjtBQUFBLElBVUEsS0FBQSxFQUFPLFNBQUEsR0FBQTtBQUNMLE1BQUEsT0FBTyxDQUFDLEtBQVIsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxZQUFBLENBQWE7QUFBQSxRQUN6QixRQUFBLEVBQVUsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdCQUFoQixDQUF0QyxDQURlO0FBQUEsUUFFekIsSUFBQSxFQUFNLGFBRm1CO0FBQUEsUUFHekIsSUFBQSxFQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQkFBaEIsQ0FIbUI7T0FBYixDQURkLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixDQUFjLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLGFBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZCxDQVBBLENBQUE7YUFTQSxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7aUJBQVksS0FBQyxDQUFBLFdBQUQsQ0FBYSxNQUFiLEVBQVo7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxDQUFsQixFQVZLO0lBQUEsQ0FWUDtBQUFBLElBc0JBLElBQUEsRUFBTSxTQUFBLEdBQUE7QUFDSixVQUFBLDBCQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFEVixDQUFBO0FBRUE7QUFBQSxXQUFBLDJDQUFBOzhCQUFBO0FBQ0UsUUFBQSxVQUFVLENBQUMsT0FBWCxDQUFBLENBQUEsQ0FERjtBQUFBLE9BRkE7YUFLQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLHVCQUEzQixFQU5JO0lBQUEsQ0F0Qk47QUFBQSxJQThCQSxhQUFBLEVBQWUsU0FBQSxHQUFBO0FBQ2IsVUFBQSxnQ0FBQTtBQUFBLE1BQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFuQixDQUE4QiwyQ0FBQSxHQUE4QyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCLENBQTVFLENBQUEsQ0FBQTtBQUVBO0FBQUE7V0FBQSwyQ0FBQTswQkFBQTtBQUNFLHNCQUFBLElBQUMsQ0FBQSxXQUFELENBQWEsTUFBYixFQUFBLENBREY7QUFBQTtzQkFIYTtJQUFBLENBOUJmO0FBQUEsSUFvQ0EsV0FBQSxFQUFhLFNBQUMsTUFBRCxHQUFBO2FBQ1gsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQXRCLENBQXlCLFVBQXpCLEVBQXFDLFNBQUEsR0FBQTtlQUNyRCxPQUFPLENBQUMsS0FBUixDQUFBLEVBRHFEO01BQUEsQ0FBckMsQ0FBbEIsRUFEVztJQUFBLENBcENiO0dBTkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/sarah/.atom/packages/jekyll/lib/server/server.coffee
