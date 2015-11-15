(function() {
  var ManageFrontMatterView, ManagePostTagsView, config, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  config = require("../config");

  utils = require("../utils");

  ManageFrontMatterView = require("./manage-front-matter-view");

  module.exports = ManagePostTagsView = (function(_super) {
    __extends(ManagePostTagsView, _super);

    function ManagePostTagsView() {
      return ManagePostTagsView.__super__.constructor.apply(this, arguments);
    }

    ManagePostTagsView.labelName = "Manage Post Tags";

    ManagePostTagsView.fieldName = "tags";

    ManagePostTagsView.prototype.fetchSiteFieldCandidates = function() {
      var error, succeed, uri;
      uri = config.get("urlForTags");
      succeed = (function(_this) {
        return function(body) {
          var tags;
          tags = body.tags.map(function(tag) {
            return {
              name: tag,
              count: 0
            };
          });
          _this.rankTags(tags, _this.editor.getText());
          return _this.displaySiteFieldItems(tags.map(function(tag) {
            return tag.name;
          }));
        };
      })(this);
      error = (function(_this) {
        return function(err) {
          return _this.error.text((err != null ? err.message : void 0) || ("Error fetching tags from '" + uri + "'"));
        };
      })(this);
      return utils.getJSON(uri, succeed, error);
    };

    ManagePostTagsView.prototype.rankTags = function(tags, content) {
      tags.forEach(function(tag) {
        var tagRegex, _ref;
        tagRegex = RegExp("" + (utils.regexpEscape(tag.name)), "ig");
        return tag.count = ((_ref = content.match(tagRegex)) != null ? _ref.length : void 0) || 0;
      });
      return tags.sort(function(t1, t2) {
        return t2.count - t1.count;
      });
    };

    return ManagePostTagsView;

  })(ManageFrontMatterView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdmlld3MvbWFuYWdlLXBvc3QtdGFncy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3REFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUixDQURSLENBQUE7O0FBQUEsRUFHQSxxQkFBQSxHQUF3QixPQUFBLENBQVEsNEJBQVIsQ0FIeEIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSix5Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxrQkFBQyxDQUFBLFNBQUQsR0FBWSxrQkFBWixDQUFBOztBQUFBLElBQ0Esa0JBQUMsQ0FBQSxTQUFELEdBQVksTUFEWixDQUFBOztBQUFBLGlDQUdBLHdCQUFBLEdBQTBCLFNBQUEsR0FBQTtBQUN4QixVQUFBLG1CQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sTUFBTSxDQUFDLEdBQVAsQ0FBVyxZQUFYLENBQU4sQ0FBQTtBQUFBLE1BQ0EsT0FBQSxHQUFVLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtBQUNSLGNBQUEsSUFBQTtBQUFBLFVBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBVixDQUFjLFNBQUMsR0FBRCxHQUFBO21CQUFTO0FBQUEsY0FBQSxJQUFBLEVBQU0sR0FBTjtBQUFBLGNBQVcsS0FBQSxFQUFPLENBQWxCO2NBQVQ7VUFBQSxDQUFkLENBQVAsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLFFBQUQsQ0FBVSxJQUFWLEVBQWdCLEtBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLENBQWhCLENBREEsQ0FBQTtpQkFFQSxLQUFDLENBQUEscUJBQUQsQ0FBdUIsSUFBSSxDQUFDLEdBQUwsQ0FBUyxTQUFDLEdBQUQsR0FBQTttQkFBUyxHQUFHLENBQUMsS0FBYjtVQUFBLENBQVQsQ0FBdkIsRUFIUTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFYsQ0FBQTtBQUFBLE1BS0EsS0FBQSxHQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEdBQUQsR0FBQTtpQkFDTixLQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsZ0JBQVksR0FBRyxDQUFFLGlCQUFMLElBQWdCLENBQUMsNEJBQUEsR0FBNEIsR0FBNUIsR0FBZ0MsR0FBakMsQ0FBNUIsRUFETTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTFIsQ0FBQTthQU9BLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBZCxFQUFtQixPQUFuQixFQUE0QixLQUE1QixFQVJ3QjtJQUFBLENBSDFCLENBQUE7O0FBQUEsaUNBY0EsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLE9BQVAsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFDLEdBQUQsR0FBQTtBQUNYLFlBQUEsY0FBQTtBQUFBLFFBQUEsUUFBQSxHQUFXLE1BQUEsQ0FBQSxFQUFBLEdBQUssQ0FBQyxLQUFLLENBQUMsWUFBTixDQUFtQixHQUFHLENBQUMsSUFBdkIsQ0FBRCxDQUFMLEVBQXVDLElBQXZDLENBQVgsQ0FBQTtlQUNBLEdBQUcsQ0FBQyxLQUFKLG1EQUFtQyxDQUFFLGdCQUF6QixJQUFtQyxFQUZwQztNQUFBLENBQWIsQ0FBQSxDQUFBO2FBR0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFDLEVBQUQsRUFBSyxFQUFMLEdBQUE7ZUFBWSxFQUFFLENBQUMsS0FBSCxHQUFXLEVBQUUsQ0FBQyxNQUExQjtNQUFBLENBQVYsRUFKUTtJQUFBLENBZFYsQ0FBQTs7OEJBQUE7O0tBRCtCLHNCQU5qQyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/lib/views/manage-post-tags-view.coffee
