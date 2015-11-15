(function() {
  var ManageFrontMatterView, ManagePostCategoriesView, config, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  config = require("../config");

  utils = require("../utils");

  ManageFrontMatterView = require("./manage-front-matter-view");

  module.exports = ManagePostCategoriesView = (function(_super) {
    __extends(ManagePostCategoriesView, _super);

    function ManagePostCategoriesView() {
      return ManagePostCategoriesView.__super__.constructor.apply(this, arguments);
    }

    ManagePostCategoriesView.labelName = "Manage Post Categories";

    ManagePostCategoriesView.fieldName = "categories";

    ManagePostCategoriesView.prototype.fetchSiteFieldCandidates = function() {
      var error, succeed, uri;
      uri = config.get("urlForCategories");
      succeed = (function(_this) {
        return function(body) {
          return _this.displaySiteFieldItems(body.categories || []);
        };
      })(this);
      error = (function(_this) {
        return function(err) {
          return _this.error.text((err != null ? err.message : void 0) || ("Error fetching categories from '" + uri + "'"));
        };
      })(this);
      return utils.getJSON(uri, succeed, error);
    };

    return ManagePostCategoriesView;

  })(ManageFrontMatterView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdmlld3MvbWFuYWdlLXBvc3QtY2F0ZWdvcmllcy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4REFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUixDQURSLENBQUE7O0FBQUEsRUFHQSxxQkFBQSxHQUF3QixPQUFBLENBQVEsNEJBQVIsQ0FIeEIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiwrQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSx3QkFBQyxDQUFBLFNBQUQsR0FBWSx3QkFBWixDQUFBOztBQUFBLElBQ0Esd0JBQUMsQ0FBQSxTQUFELEdBQVksWUFEWixDQUFBOztBQUFBLHVDQUdBLHdCQUFBLEdBQTBCLFNBQUEsR0FBQTtBQUN4QixVQUFBLG1CQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sTUFBTSxDQUFDLEdBQVAsQ0FBVyxrQkFBWCxDQUFOLENBQUE7QUFBQSxNQUNBLE9BQUEsR0FBVSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7aUJBQ1IsS0FBQyxDQUFBLHFCQUFELENBQXVCLElBQUksQ0FBQyxVQUFMLElBQW1CLEVBQTFDLEVBRFE7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURWLENBQUE7QUFBQSxNQUdBLEtBQUEsR0FBUSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxHQUFELEdBQUE7aUJBQ04sS0FBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLGdCQUFZLEdBQUcsQ0FBRSxpQkFBTCxJQUFnQixDQUFDLGtDQUFBLEdBQWtDLEdBQWxDLEdBQXNDLEdBQXZDLENBQTVCLEVBRE07UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUhSLENBQUE7YUFLQSxLQUFLLENBQUMsT0FBTixDQUFjLEdBQWQsRUFBbUIsT0FBbkIsRUFBNEIsS0FBNUIsRUFOd0I7SUFBQSxDQUgxQixDQUFBOztvQ0FBQTs7S0FEcUMsc0JBTnZDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/lib/views/manage-post-categories-view.coffee
