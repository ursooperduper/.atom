(function() {
  var $, Emitter, JekyllManagerView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Emitter = require('atom').Emitter;

  _ref = require('space-pen'), $ = _ref.$, View = _ref.View;

  module.exports = JekyllManagerView = (function(_super) {
    __extends(JekyllManagerView, _super);

    function JekyllManagerView() {
      return JekyllManagerView.__super__.constructor.apply(this, arguments);
    }

    JekyllManagerView.content = function() {
      return this.div({
        tabindex: -1,
        "class": 'jekyll-manager-panel'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'block'
          }, function() {
            _this.p(function() {
              _this.span({
                id: 'jekyllVersion',
                outlet: 'jekyllVersion'
              }, 'Jekyll 0.0.0');
              return _this.span({
                id: 'jekyllPWD',
                outlet: 'jekyllPWD'
              }, ' in ' + atom.project.getPaths()[0]);
            });
            return _this.div({
              "class": 'buttons'
            }, function() {
              return _this.div({
                "class": 'btn-group'
              }, function() {
                _this.button({
                  "class": 'btn',
                  id: 'toggleButton',
                  outlet: 'toggleButton',
                  click: 'toggleServer'
                }, 'Start/Stop Server');
                return _this.button({
                  "class": 'btn',
                  click: 'hidePanel'
                }, 'Close');
              });
            });
          });
        };
      })(this));
    };

    JekyllManagerView.prototype.initialize = function(emitter) {
      this.emitter = emitter;
      return this.getVersion();
    };

    JekyllManagerView.prototype.setPanel = function(panel) {
      return this.panel = panel;
    };

    JekyllManagerView.prototype.hidePanel = function() {
      return this.panel.hide();
    };

    JekyllManagerView.prototype.refresh = function(server) {};

    JekyllManagerView.prototype.getVersion = function() {
      this.emitter.emit('jekyll:version');
      return this.emitter.on('jekyll:version-reply', function(data) {
        return $('#jekyllVersion').html(data);
      });
    };

    JekyllManagerView.prototype.toggleServer = function(event, element) {
      return atom.packages.getActivePackage('jekyll').mainModule.toggleServer();
    };

    return JekyllManagerView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2pla3lsbC9saWIvdG9vbGJhci12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5Q0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQVksT0FBQSxDQUFRLFdBQVIsQ0FBWixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFESixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNKLHdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGlCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLFFBQUEsRUFBVSxDQUFBLENBQVY7QUFBQSxRQUFjLE9BQUEsRUFBTyxzQkFBckI7T0FBTCxFQUFrRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUVoRCxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sT0FBUDtXQUFMLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixZQUFBLEtBQUMsQ0FBQSxDQUFELENBQUcsU0FBQSxHQUFBO0FBQ0QsY0FBQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsZ0JBQUEsRUFBQSxFQUFJLGVBQUo7QUFBQSxnQkFBcUIsTUFBQSxFQUFRLGVBQTdCO2VBQU4sRUFBb0QsY0FBcEQsQ0FBQSxDQUFBO3FCQUNBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxnQkFBQSxFQUFBLEVBQUksV0FBSjtBQUFBLGdCQUFpQixNQUFBLEVBQVEsV0FBekI7ZUFBTixFQUE0QyxNQUFBLEdBQVMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQTdFLEVBRkM7WUFBQSxDQUFILENBQUEsQ0FBQTttQkFHQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sU0FBUDthQUFMLEVBQXVCLFNBQUEsR0FBQTtxQkFDckIsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGdCQUFBLE9BQUEsRUFBTyxXQUFQO2VBQUwsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLGdCQUFBLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxrQkFBQSxPQUFBLEVBQU8sS0FBUDtBQUFBLGtCQUFjLEVBQUEsRUFBSSxjQUFsQjtBQUFBLGtCQUFrQyxNQUFBLEVBQVEsY0FBMUM7QUFBQSxrQkFBMEQsS0FBQSxFQUFPLGNBQWpFO2lCQUFSLEVBQXlGLG1CQUF6RixDQUFBLENBQUE7dUJBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGtCQUFBLE9BQUEsRUFBTyxLQUFQO0FBQUEsa0JBQWMsS0FBQSxFQUFPLFdBQXJCO2lCQUFSLEVBQTBDLE9BQTFDLEVBRnVCO2NBQUEsQ0FBekIsRUFEcUI7WUFBQSxDQUF2QixFQUptQjtVQUFBLENBQXJCLEVBRmdEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEQsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSxnQ0FZQSxVQUFBLEdBQVksU0FBQyxPQUFELEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsT0FBWCxDQUFBO2FBRUEsSUFBQyxDQUFBLFVBQUQsQ0FBQSxFQUhVO0lBQUEsQ0FaWixDQUFBOztBQUFBLGdDQWlCQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7YUFDUixJQUFDLENBQUEsS0FBRCxHQUFTLE1BREQ7SUFBQSxDQWpCVixDQUFBOztBQUFBLGdDQW9CQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQ1QsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUEsRUFEUztJQUFBLENBcEJYLENBQUE7O0FBQUEsZ0NBdUJBLE9BQUEsR0FBUyxTQUFDLE1BQUQsR0FBQSxDQXZCVCxDQUFBOztBQUFBLGdDQXlCQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxnQkFBZCxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxzQkFBWixFQUFvQyxTQUFDLElBQUQsR0FBQTtlQUNsQyxDQUFBLENBQUUsZ0JBQUYsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixJQUF6QixFQURrQztNQUFBLENBQXBDLEVBRlU7SUFBQSxDQXpCWixDQUFBOztBQUFBLGdDQThCQSxZQUFBLEdBQWMsU0FBQyxLQUFELEVBQVEsT0FBUixHQUFBO2FBQ1osSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixRQUEvQixDQUF3QyxDQUFDLFVBQVUsQ0FBQyxZQUFwRCxDQUFBLEVBRFk7SUFBQSxDQTlCZCxDQUFBOzs2QkFBQTs7S0FEOEIsS0FKbEMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/sarah/.atom/packages/jekyll/lib/toolbar-view.coffee
