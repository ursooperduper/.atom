(function() {
  var $, BuildStatusView, GitRepository, TravisCi, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  GitRepository = require('atom').GitRepository;

  TravisCi = require('travis-ci');

  module.exports = BuildStatusView = (function(_super) {
    __extends(BuildStatusView, _super);

    function BuildStatusView() {
      this.repoStatus = __bind(this.repoStatus, this);
      this.update = __bind(this.update, this);
      this.subscribeToRepo = __bind(this.subscribeToRepo, this);
      return BuildStatusView.__super__.constructor.apply(this, arguments);
    }

    BuildStatusView.content = function() {
      return this.div({
        "class": 'travis-ci-status inline-block'
      }, (function(_this) {
        return function() {
          return _this.span({
            "class": 'build-status icon icon-history',
            outlet: 'status',
            tabindex: -1
          }, '');
        };
      })(this));
    };

    BuildStatusView.prototype.initialize = function(nwo, matrix, statusBar) {
      this.nwo = nwo;
      this.matrix = matrix;
      this.statusBar = statusBar;
      atom.commands.add('atom-workspace', 'travis-ci-status:toggle', (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
      this.on('click', (function(_this) {
        return function() {
          return _this.matrix.toggle();
        };
      })(this));
      this.attach();
      this.subscribeToRepo();
      return this.update();
    };

    BuildStatusView.prototype.serialize = function() {};

    BuildStatusView.prototype.attach = function() {
      return this.statusBarTile = this.statusBar.addLeftTile({
        item: this,
        priority: 100
      });
    };

    BuildStatusView.prototype.detach = function() {
      var _ref1;
      return (_ref1 = this.statusBarTile) != null ? _ref1.destroy() : void 0;
    };

    BuildStatusView.prototype.destroy = function() {
      return this.detach();
    };

    BuildStatusView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.detach();
      } else {
        return this.attach();
      }
    };

    BuildStatusView.prototype.getActiveItemPath = function() {
      var _ref1;
      return (_ref1 = this.getActiveItem()) != null ? typeof _ref1.getPath === "function" ? _ref1.getPath() : void 0 : void 0;
    };

    BuildStatusView.prototype.getActiveItem = function() {
      return atom.workspace.getActivePaneItem();
    };

    BuildStatusView.prototype.subscribeToRepo = function() {
      if (this.repo != null) {
        this.unsubscribe(this.repo);
      }
      this.repoPromise = Promise.all(atom.project.getDirectories().map(atom.project.repositoryForDirectory.bind(atom.project)));
      return this.repoPromise.then((function(_this) {
        return function(repos) {
          var name, repo_list;
          name = atom.config.get('travis-ci-status.travisCiRemoteName');
          repo_list = repos.filter(function(r) {
            return /(.)*github\.com/i.test(r.getConfigValue("remote." + name + ".url"));
          });
          _this.repo = repo_list[0];
          console.log("DEBUG: ", _this.repo);
          return _this.repo.onDidChangeStatus(_this.update);
        };
      })(this));
    };

    BuildStatusView.prototype.update = function() {
      var details, token, updateRepo, _ref1;
      console.log(this);
      if (!this.hasParent()) {
        return;
      }
      this.status.addClass('pending');
      details = this.nwo.split('/');
      updateRepo = (function(_this) {
        return function() {
          return atom.travis.repos(details[0], details[1]).get(_this.repoStatus);
        };
      })(this);
      if (((_ref1 = atom.travis) != null ? _ref1.pro : void 0) != null) {
        token = atom.config.get('travis-ci-status.personalAccessToken');
        return atom.travis.authenticate({
          github_token: token
        }, updateRepo);
      } else {
        return updateRepo();
      }
    };

    BuildStatusView.prototype.fallback = function() {
      atom.travis = new TravisCi({
        version: '2.0.0',
        pro: false
      });
      return this.update();
    };

    BuildStatusView.prototype.repoStatus = function(err, data) {
      var _ref1;
      if ((err != null) && (((_ref1 = atom.travis) != null ? _ref1.pro : void 0) != null)) {
        return this.fallback();
      }
      if (data['files'] === 'not found') {
        return;
      }
      if (err != null) {
        return console.log("Error:", err);
      }
      data = data['repo'];
      this.status.removeClass('pending success fail');
      if (data && data['last_build_state'] === "passed") {
        this.matrix.update(data['last_build_id']);
        return this.status.addClass('success');
      } else {
        return this.status.addClass('fail');
      }
    };

    return BuildStatusView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3RyYXZpcy1jaS1zdGF0dXMvbGliL2J1aWxkLXN0YXR1cy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1REFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosQ0FBQTs7QUFBQSxFQUNDLGdCQUFpQixPQUFBLENBQVEsTUFBUixFQUFqQixhQURELENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFdBQVIsQ0FIWCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FFTTtBQUVKLHNDQUFBLENBQUE7Ozs7Ozs7S0FBQTs7QUFBQSxJQUFBLGVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLCtCQUFQO09BQUwsRUFBNkMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDM0MsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLFlBQUEsT0FBQSxFQUFPLGdDQUFQO0FBQUEsWUFBeUMsTUFBQSxFQUFRLFFBQWpEO0FBQUEsWUFBMkQsUUFBQSxFQUFVLENBQUEsQ0FBckU7V0FBTixFQUErRSxFQUEvRSxFQUQyQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdDLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsOEJBUUEsVUFBQSxHQUFZLFNBQUUsR0FBRixFQUFRLE1BQVIsRUFBaUIsU0FBakIsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLE1BQUEsR0FDWixDQUFBO0FBQUEsTUFEaUIsSUFBQyxDQUFBLFNBQUEsTUFDbEIs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

//# sourceURL=/Users/sarah/.atom/packages/travis-ci-status/lib/build-status-view.coffee
