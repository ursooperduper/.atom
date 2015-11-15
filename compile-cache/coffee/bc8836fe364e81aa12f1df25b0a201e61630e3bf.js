(function() {
  var $, Minimap, MinimapPluginsDropdownView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  $ = View.__super__.constructor;

  Minimap = require('./minimap');

  module.exports = MinimapPluginsDropdownView = (function(_super) {
    __extends(MinimapPluginsDropdownView, _super);

    function MinimapPluginsDropdownView() {
      this.selectPreviousItem = __bind(this.selectPreviousItem, this);
      this.selectNextItem = __bind(this.selectNextItem, this);
      this.toggleSelectedItem = __bind(this.toggleSelectedItem, this);
      this.destroy = __bind(this.destroy, this);
      return MinimapPluginsDropdownView.__super__.constructor.apply(this, arguments);
    }

    MinimapPluginsDropdownView.content = function() {
      return this.div({
        "class": 'select-list popover-list minimap-plugins-list'
      }, (function(_this) {
        return function() {
          _this.input({
            type: 'text',
            "class": 'hidden-input',
            outlet: 'hiddenInput'
          });
          return _this.ol({
            "class": 'list-group mark-active',
            outlet: 'list'
          });
        };
      })(this));
    };

    MinimapPluginsDropdownView.prototype.selectedItem = null;

    MinimapPluginsDropdownView.prototype.initialize = function() {
      this.plugins = {};
      this.subscribe(Minimap, 'plugin:added', (function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.addItemFor(name, plugin);
        };
      })(this));
      this.subscribe(Minimap, 'plugin:removed', (function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.removeItemFor(name, plugin);
        };
      })(this));
      this.subscribe(Minimap, 'plugin:activated', (function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.activateItem(name, plugin);
        };
      })(this));
      this.subscribe(Minimap, 'plugin:deactivated', (function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.deactivateItem(name, plugin);
        };
      })(this));
      this.on('core:move-up', this.selectPreviousItem);
      this.on('core:move-down', this.selectNextItem);
      this.on('core:cancel', this.destroy);
      this.on('core:validate', this.toggleSelectedItem);
      this.hiddenInput.on('focusout', this.destroy);
      return this.initList();
    };

    MinimapPluginsDropdownView.prototype.attach = function() {
      atom.workspaceView.append(this);
      return this.hiddenInput.focus();
    };

    MinimapPluginsDropdownView.prototype.destroy = function() {
      this.trigger('minimap:plugins-dropdown-destroyed');
      this.off();
      this.hiddenInput.off();
      this.unsubscribe();
      return this.detach();
    };

    MinimapPluginsDropdownView.prototype.initList = function() {
      var name, plugin, _ref, _results;
      _ref = Minimap.plugins;
      _results = [];
      for (name in _ref) {
        plugin = _ref[name];
        _results.push(this.addItemFor(name, plugin));
      }
      return _results;
    };

    MinimapPluginsDropdownView.prototype.toggleSelectedItem = function() {
      return this.selectedItem.mousedown();
    };

    MinimapPluginsDropdownView.prototype.selectNextItem = function() {
      this.selectedItem.removeClass('selected');
      if (this.selectedItem.index() !== this.list.children().length - 1) {
        this.selectedItem = this.selectedItem.next();
      } else {
        this.selectedItem = this.list.children().first();
      }
      return this.selectedItem.addClass('selected');
    };

    MinimapPluginsDropdownView.prototype.selectPreviousItem = function() {
      this.selectedItem.removeClass('selected');
      if (this.selectedItem.index() !== 0) {
        this.selectedItem = this.selectedItem.prev();
      } else {
        this.selectedItem = this.list.children().last();
      }
      return this.selectedItem.addClass('selected');
    };

    MinimapPluginsDropdownView.prototype.addItemFor = function(name, plugin) {
      var cls, item;
      cls = plugin.isActive() ? 'active' : '';
      item = $("<li class='" + cls + "'>" + name + "</li>");
      item.on('mousedown', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.trigger("minimap:toggle-" + name);
        };
      })(this));
      this.plugins[name] = item;
      this.list.append(item);
      if (this.selectedItem == null) {
        this.selectedItem = item;
        return this.selectedItem.addClass('selected');
      }
    };

    MinimapPluginsDropdownView.prototype.removeItemFor = function(name, plugin) {
      this.list.remove(this.plugins[name]);
      return delete this.plugins[name];
    };

    MinimapPluginsDropdownView.prototype.activateItem = function(name, plugin) {
      return this.plugins[name].addClass('active');
    };

    MinimapPluginsDropdownView.prototype.deactivateItem = function(name, plugin) {
      return this.plugins[name].removeClass('active');
    };

    return MinimapPluginsDropdownView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsTUFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBRG5CLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FIVixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGlEQUFBLENBQUE7Ozs7Ozs7O0tBQUE7O0FBQUEsSUFBQSwwQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sK0NBQVA7T0FBTCxFQUE2RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzNELFVBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTztBQUFBLFlBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxZQUFjLE9BQUEsRUFBTyxjQUFyQjtBQUFBLFlBQXFDLE1BQUEsRUFBUSxhQUE3QztXQUFQLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsWUFBQSxPQUFBLEVBQU8sd0JBQVA7QUFBQSxZQUFpQyxNQUFBLEVBQVEsTUFBekM7V0FBSixFQUYyRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdELEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEseUNBS0EsWUFBQSxHQUFjLElBTGQsQ0FBQTs7QUFBQSx5Q0FPQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxPQUFYLEVB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
//# sourceURL=/Users/sarah/.atom/packages/minimap/lib/minimap-plugins-dropdown-view.coffee