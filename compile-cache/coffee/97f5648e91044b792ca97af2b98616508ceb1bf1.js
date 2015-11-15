(function() {
  var MinimapOpenPluginsListView, MinimapPluginsDropdownView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  MinimapPluginsDropdownView = require('./minimap-plugins-dropdown-view');

  module.exports = MinimapOpenPluginsListView = (function(_super) {
    __extends(MinimapOpenPluginsListView, _super);

    function MinimapOpenPluginsListView() {
      return MinimapOpenPluginsListView.__super__.constructor.apply(this, arguments);
    }

    MinimapOpenPluginsListView.content = function() {
      return this.div({
        "class": 'open-minimap-plugins-list'
      });
    };

    MinimapOpenPluginsListView.prototype.dropdown = null;

    MinimapOpenPluginsListView.prototype.initialize = function() {
      return this.on('mousedown', (function(_this) {
        return function(e) {
          var css, minimap, offset;
          e.preventDefault();
          e.stopPropagation();
          if (_this.dropdown != null) {
            return _this.dropdown.destroy();
          } else {
            minimap = _this.parent();
            offset = minimap.offset();
            _this.dropdown = new MinimapPluginsDropdownView;
            css = {
              top: offset.top
            };
            if (atom.config.get('minimap.displayMinimapOnLeft')) {
              css.left = offset.left + minimap.width();
            } else {
              css.right = window.innerWidth - offset.left;
            }
            _this.dropdown.css(css).attach();
            return _this.dropdown.on('minimap:plugins-dropdown-destroyed', function() {
              _this.dropdown.off();
              return _this.dropdown = null;
            });
          }
        };
      })(this));
    };

    return MinimapOpenPluginsListView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDREQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0EsMEJBQUEsR0FBNkIsT0FBQSxDQUFRLGlDQUFSLENBRDdCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaURBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsMEJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLDJCQUFQO09BQUwsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSx5Q0FHQSxRQUFBLEdBQVUsSUFIVixDQUFBOztBQUFBLHlDQUtBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsRUFBRCxDQUFJLFdBQUosRUFBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQ2YsY0FBQSxvQkFBQTtBQUFBLFVBQUEsQ0FBQyxDQUFDLGNBQUYsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUNBLENBQUMsQ0FBQyxlQUFGLENBQUEsQ0FEQSxDQUFBO0FBR0EsVUFBQSxJQUFHLHNCQUFIO21CQUNFLEtBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFBLEVBREY7V0FBQSxNQUFBO0FBR0UsWUFBQSxPQUFBLEdBQVUsS0FBQyxDQUFBLE1BQUQsQ0FBQSxDQUFWLENBQUE7QUFBQSxZQUNBLE1BQUEsR0FBUyxPQUFPLENBQUMsTUFBUixDQUFBLENBRFQsQ0FBQTtBQUFBLFlBRUEsS0FBQyxDQUFBLFFBQUQsR0FBWSxHQUFBLENBQUEsMEJBRlosQ0FBQTtBQUFBLFlBSUEsR0FBQSxHQUFNO0FBQUEsY0FBQSxHQUFBLEVBQUssTUFBTSxDQUFDLEdBQVo7YUFKTixDQUFBO0FBS0EsWUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4QkFBaEIsQ0FBSDtBQUNFLGNBQUEsR0FBRyxDQUFDLElBQUosR0FBVyxNQUFNLENBQUMsSUFBUCxHQUFjLE9BQU8sQ0FBQyxLQUFSLENBQUEsQ0FBekIsQ0FERjthQUFBLE1BQUE7QUFHRSxjQUFBLEdBQUcsQ0FBQyxLQUFKLEdBQWEsTUFBTSxDQUFDLFVBQVAsR0FBb0IsTUFBTSxDQUFDLElBQXhDLENBSEY7YUFMQTtBQUFBLFlBVUEsS0FBQyxDQUFBLFFBQVEsQ0FBQyxHQUFWLENBQWMsR0FBZCxDQUFrQixDQUFDLE1BQW5CLENBQUEsQ0FWQSxDQUFBO21CQVlBLEtBQUMsQ0FBQSxRQUFRLENBQUMsRUFBVixDQUFhLG9DQUFiLEVBQW1ELFNBQUEsR0FBQTtBQUNqRCxjQUFBLEtBQUMsQ0FBQSxRQUFRLENBQUMsR0FBVixDQUFBLENBQUEsQ0FBQTtxQkFDQSxLQUFDLENBQUEsUUFBRCxHQUFZLEtBRnFDO1lBQUEsQ0FBbkQsRUFmRjtXQUplO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakIsRUFEVTtJQUFBLENBTFosQ0FBQTs7c0NBQUE7O0tBRHVDLEtBSnpDLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/sarah/.atom/packages/minimap/lib/minimap-open-plugins-list-view.coffee