(function() {
  var Emitter, EmitterMixin, Minimap, MinimapPluginGeneratorView, PluginManagement, ViewManagement, deprecate, semver;

  deprecate = require('grim').deprecate;

  EmitterMixin = require('emissary').Emitter;

  Emitter = require('event-kit').Emitter;

  semver = require('semver');

  ViewManagement = require('./mixins/view-management');

  PluginManagement = require('./mixins/plugin-management');

  MinimapPluginGeneratorView = require('./minimap-plugin-generator-view');

  require('../vendor/resizeend');

  Minimap = (function() {
    EmitterMixin.includeInto(Minimap);

    ViewManagement.includeInto(Minimap);

    PluginManagement.includeInto(Minimap);


    /* Public */

    Minimap.prototype.version = require('../package.json').version;

    Minimap.prototype.configDefaults = {
      plugins: {},
      autoToggle: true,
      displayMinimapOnLeft: false,
      displayCodeHighlights: true,
      displayPluginsControls: true,
      minimapScrollIndicator: true,
      useHardwareAcceleration: true,
      charWidth: 1,
      charHeight: 2,
      interline: 1,
      textOpacity: 0.6
    };

    Minimap.prototype.active = false;

    function Minimap() {
      this.emitter = new Emitter;
    }

    Minimap.prototype.activate = function() {
      atom.workspaceView.command('minimap:toggle', (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
      atom.workspaceView.command("minimap:generate-plugin", (function(_this) {
        return function() {
          return _this.generatePlugin();
        };
      })(this));
      if (atom.config.get('minimap.displayPluginsControls')) {
        atom.workspaceView.command('minimap:open-quick-settings', function() {
          return atom.workspaceView.getActivePaneView().find('.minimap .open-minimap-quick-settings').mousedown();
        });
      }
      atom.workspaceView.toggleClass('minimap-on-left', atom.config.get('minimap.displayMinimapOnLeft'));
      atom.config.observe('minimap.displayMinimapOnLeft', function() {
        return atom.workspaceView.toggleClass('minimap-on-left', atom.config.get('minimap.displayMinimapOnLeft'));
      });
      if (atom.config.get('minimap.autoToggle')) {
        return this.toggle();
      }
    };

    Minimap.prototype.deactivate = function() {
      this.destroyViews();
      this.emit('deactivated');
      return this.emitter.emit('did-deactivate');
    };

    Minimap.prototype.versionMatch = function(expectedVersion) {
      return semver.satisfies(this.version, expectedVersion);
    };

    Minimap.prototype.toggle = function() {
      if (this.active) {
        this.active = false;
        return this.deactivate();
      } else {
        this.createViews();
        this.active = true;
        this.emit('activated');
        return this.emitter.emit('did-activate');
      }
    };

    Minimap.prototype.generatePlugin = function() {
      var view;
      return view = new MinimapPluginGeneratorView();
    };

    Minimap.prototype.onDidActivate = function(callback) {
      return this.emitter.on('did-activate', callback);
    };

    Minimap.prototype.onDidDeactivate = function(callback) {
      return this.emitter.on('did-deactivate', callback);
    };

    Minimap.prototype.onDidCreateMinimap = function(callback) {
      return this.emitter.on('did-create-minimap', callback);
    };

    Minimap.prototype.onWillDestroyMinimap = function(callback) {
      return this.emitter.on('will-destroy-minimap', callback);
    };

    Minimap.prototype.onDidDestroyMinimap = function(callback) {
      return this.emitter.on('did-destroy-minimap', callback);
    };

    Minimap.prototype.onDidAddPlugin = function(callback) {
      return this.emitter.on('did-add-plugin', callback);
    };

    Minimap.prototype.onDidRemovePlugin = function(callback) {
      return this.emitter.on('did-remove-plugin', callback);
    };

    Minimap.prototype.onDidActivatePlugin = function(callback) {
      return this.emitter.on('did-activate-plugin', callback);
    };

    Minimap.prototype.onDidDeactivatePlugin = function(callback) {
      return this.emitter.on('did-deactivate-plugin', callback);
    };

    Minimap.prototype.on = function(eventName) {
      switch (eventName) {
        case 'activated':
          deprecate("Use Minimap::onDidActivate instead.");
          break;
        case 'deactivated':
          deprecate("Use Minimap::onDidDeactivate instead.");
          break;
        case 'minimap-view:created':
          deprecate("Use Minimap::onDidCreateMinimap instead.");
          break;
        case 'minimap-view:destroyed':
          deprecate("Use Minimap::onDidDestroyMinimap instead.");
          break;
        case 'minimap-view:will-be-destroyed':
          deprecate("Use Minimap::onWillDestroyMinimap instead.");
          break;
        case 'plugin:added':
          deprecate("Use Minimap::onDidAddPlugin instead.");
          break;
        case 'plugin:removed':
          deprecate("Use Minimap::onDidRemovePlugin instead.");
          break;
        case 'plugin:activated':
          deprecate("Use Minimap::onDidActivatePlugin instead.");
          break;
        case 'plugin:deactivated':
          deprecate("Use Minimap::onDidDeactivatePlugin instead.");
      }
      return EmitterMixin.prototype.on.apply(this, arguments);
    };

    return Minimap;

  })();

  module.exports = new Minimap();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtHQUFBOztBQUFBLEVBQUMsWUFBYSxPQUFBLENBQVEsTUFBUixFQUFiLFNBQUQsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsVUFBUixDQUFtQixDQUFDLE9BRG5DLENBQUE7O0FBQUEsRUFFQyxVQUFXLE9BQUEsQ0FBUSxXQUFSLEVBQVgsT0FGRCxDQUFBOztBQUFBLEVBR0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBSFQsQ0FBQTs7QUFBQSxFQUtBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDBCQUFSLENBTGpCLENBQUE7O0FBQUEsRUFNQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsNEJBQVIsQ0FObkIsQ0FBQTs7QUFBQSxFQU9BLDBCQUFBLEdBQTZCLE9BQUEsQ0FBUSxpQ0FBUixDQVA3QixDQUFBOztBQUFBLEVBU0EsT0FBQSxDQUFRLHFCQUFSLENBVEEsQ0FBQTs7QUFBQSxFQTBCTTtBQUNKLElBQUEsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsT0FBekIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsY0FBYyxDQUFDLFdBQWYsQ0FBMkIsT0FBM0IsQ0FEQSxDQUFBOztBQUFBLElBRUEsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsT0FBN0IsQ0FGQSxDQUFBOztBQUlBO0FBQUEsZ0JBSkE7O0FBQUEsc0JBT0EsT0FBQSxHQUFTLE9BQUEsQ0FBUSxpQkFBUixDQUEwQixDQUFDLE9BUHBDLENBQUE7O0FBQUEsc0JBVUEsY0FBQSxHQUNFO0FBQUEsTUFBQSxPQUFBLEVBQVMsRUFBVDtBQUFBLE1BQ0EsVUFBQSxFQUFZLElBRFo7QUFBQSxNQUVBLG9CQUFBLEVBQXNCLEtBRnRCO0FBQUEsTUFHQSxxQkFBQSxFQUF1QixJQUh2QjtBQUFBLE1BSUEsc0JBQUEsRUFBd0IsSUFK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
//# sourceURL=/Users/sarah/.atom/packages/minimap/lib/minimap.coffee