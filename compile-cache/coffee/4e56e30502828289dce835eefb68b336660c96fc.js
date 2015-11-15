(function() {
  var NewFileView, NewPostView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  NewFileView = require("./new-file-view");

  module.exports = NewPostView = (function(_super) {
    __extends(NewPostView, _super);

    function NewPostView() {
      return NewPostView.__super__.constructor.apply(this, arguments);
    }

    NewPostView.fileType = "Post";

    NewPostView.pathConfig = "sitePostsDir";

    NewPostView.fileNameConfig = "newPostFileName";

    return NewPostView;

  })(NewFileView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdmlld3MvbmV3LXBvc3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0JBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsaUJBQVIsQ0FBZCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGtDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFdBQUMsQ0FBQSxRQUFELEdBQVksTUFBWixDQUFBOztBQUFBLElBQ0EsV0FBQyxDQUFBLFVBQUQsR0FBYyxjQURkLENBQUE7O0FBQUEsSUFFQSxXQUFDLENBQUEsY0FBRCxHQUFrQixpQkFGbEIsQ0FBQTs7dUJBQUE7O0tBRHdCLFlBSDFCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/lib/views/new-post-view.coffee
