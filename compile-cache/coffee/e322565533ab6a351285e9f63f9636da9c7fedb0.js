(function() {
  var Emitter, EmitterMixin, Minimap, PluginManagement, ViewManagement, deprecate, semver;

  deprecate = require('grim').deprecate;

  EmitterMixin = require('emissary').Emitter;

  Emitter = require('event-kit').Emitter;

  semver = require('semver');

  ViewManagement = require('./mixins/view-management');

  PluginManagement = require('./mixins/plugin-management');

  require('../vendor/resizeend');

  Minimap = (function() {
    EmitterMixin.includeInto(Minimap);

    ViewManagement.includeInto(Minimap);

    PluginManagement.includeInto(Minimap);


    /* Public */

    Minimap.prototype.version = require('../package.json').version;

    Minimap.prototype.configDefaults = {
      plugins: {},
      autoToggle: false,
      displayMinimapOnLeft: false,
      displayCodeHighlights: true,
      displayPluginsControls: true,
      minimapScrollIndicator: true,
      useHardwareAcceleration: true,
      charWidth: 1,
      charHeight: 2,
      lineHeight: 3,
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1GQUFBOztBQUFBLEVBQUMsWUFBYSxPQUFBLENBQVEsTUFBUixFQUFiLFNBQUQsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsVUFBUixDQUFtQixDQUFDLE9BRG5DLENBQUE7O0FBQUEsRUFFQyxVQUFXLE9BQUEsQ0FBUSxXQUFSLEVBQVgsT0FGRCxDQUFBOztBQUFBLEVBR0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBSFQsQ0FBQTs7QUFBQSxFQUtBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDBCQUFSLENBTGpCLENBQUE7O0FBQUEsRUFNQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsNEJBQVIsQ0FObkIsQ0FBQTs7QUFBQSxFQVFBLE9BQUEsQ0FBUSxxQkFBUixDQVJBLENBQUE7O0FBQUEsRUF5Qk07QUFDSixJQUFBLFlBQVksQ0FBQyxXQUFiLENBQXlCLE9BQXpCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLGNBQWMsQ0FBQyxXQUFmLENBQTJCLE9BQTNCLENBREEsQ0FBQTs7QUFBQSxJQUVBLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLE9BQTdCLENBRkEsQ0FBQTs7QUFJQTtBQUFBLGdCQUpBOztBQUFBLHNCQU9BLE9BQUEsR0FBUyxPQUFBLENBQVEsaUJBQVIsQ0FBMEIsQ0FBQyxPQVBwQyxDQUFBOztBQUFBLHNCQVVBLGNBQUEsR0FDRTtBQUFBLE1BQUEsT0FBQSxFQUFTLEVBQVQ7QUFBQSxNQUNBLFVBQUEsRUFBWSxLQURaO0FBQUEsTUFFQSxvQkFBQSxFQUFzQixLQUZ0QjtBQUFBLE1BR0EscUJBQUEsRUFBdUIsSUFIdkI7QUFBQSxNQUlBLHNCQUFBLEVBQXdCLElBSnhCO0FBQUEsTUFLQSxzQkFBQSxFQUF3QixJQUx4QjtBQUFBLE1BTUEsdUJBQUEsRUFB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
//# sourceURL=/Users/sarah/.atom/packages/minimap/lib/minimap.coffee