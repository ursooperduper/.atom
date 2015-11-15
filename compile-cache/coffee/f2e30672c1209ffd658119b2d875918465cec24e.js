(function() {
  var NewDraftView, NewFileView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  NewFileView = require("./new-file-view");

  module.exports = NewDraftView = (function(_super) {
    __extends(NewDraftView, _super);

    function NewDraftView() {
      return NewDraftView.__super__.constructor.apply(this, arguments);
    }

    NewDraftView.fileType = "Draft";

    NewDraftView.pathConfig = "siteDraftsDir";

    NewDraftView.fileNameConfig = "newDraftFileName";

    return NewDraftView;

  })(NewFileView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdmlld3MvbmV3LWRyYWZ0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGlCQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixtQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxZQUFDLENBQUEsUUFBRCxHQUFZLE9BQVosQ0FBQTs7QUFBQSxJQUNBLFlBQUMsQ0FBQSxVQUFELEdBQWMsZUFEZCxDQUFBOztBQUFBLElBRUEsWUFBQyxDQUFBLGNBQUQsR0FBa0Isa0JBRmxCLENBQUE7O3dCQUFBOztLQUR5QixZQUgzQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/lib/views/new-draft-view.coffee
