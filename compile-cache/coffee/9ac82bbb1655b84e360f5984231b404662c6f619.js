(function() {
  var Dialog, Project, SaveDialog, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require('./dialog');

  Project = require('./project');

  path = require('path');

  module.exports = SaveDialog = (function(_super) {
    __extends(SaveDialog, _super);

    SaveDialog.prototype.filePath = null;

    function SaveDialog() {
      var firstPath, title;
      firstPath = atom.project.getPaths()[0];
      title = path.basename(firstPath);
      SaveDialog.__super__.constructor.call(this, {
        prompt: 'Enter name of project',
        input: title,
        select: true,
        iconClass: 'icon-arrow-right'
      });
    }

    SaveDialog.prototype.onConfirm = function(title) {
      var project, properties;
      if (title) {
        properties = {
          title: title,
          paths: atom.project.getPaths()
        };
        project = new Project(properties);
        project.save();
        return this.close();
      } else {
        return this.showError('You need to specify a name for the project');
      }
    };

    return SaveDialog;

  })(Dialog);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9saWIvc2F2ZS1kaWFsb2cuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7QUFBQSx5QkFBQSxRQUFBLEdBQVUsSUFBVixDQUFBOztBQUVhLElBQUEsb0JBQUEsR0FBQTtBQUNYLFVBQUEsZ0JBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBcEMsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLElBQUksQ0FBQyxRQUFMLENBQWMsU0FBZCxDQURSLENBQUE7QUFBQSxNQUdBLDRDQUNFO0FBQUEsUUFBQSxNQUFBLEVBQVEsdUJBQVI7QUFBQSxRQUNBLEtBQUEsRUFBTyxLQURQO0FBQUEsUUFFQSxNQUFBLEVBQVEsSUFGUjtBQUFBLFFBR0EsU0FBQSxFQUFXLGtCQUhYO09BREYsQ0FIQSxDQURXO0lBQUEsQ0FGYjs7QUFBQSx5QkFZQSxTQUFBLEdBQVcsU0FBQyxLQUFELEdBQUE7QUFDVCxVQUFBLG1CQUFBO0FBQUEsTUFBQSxJQUFHLEtBQUg7QUFDRSxRQUFBLFVBQUEsR0FDRTtBQUFBLFVBQUEsS0FBQSxFQUFPLEtBQVA7QUFBQSxVQUNBLEtBQUEsRUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQURQO1NBREYsQ0FBQTtBQUFBLFFBSUEsT0FBQSxHQUFjLElBQUEsT0FBQSxDQUFRLFVBQVIsQ0FKZCxDQUFBO0FBQUEsUUFLQSxPQUFPLENBQUMsSUFBUixDQUFBLENBTEEsQ0FBQTtlQU9BLElBQUMsQ0FBQSxLQUFELENBQUEsRUFSRjtPQUFBLE1BQUE7ZUFVRSxJQUFDLENBQUEsU0FBRCxDQUFXLDRDQUFYLEVBVkY7T0FEUztJQUFBLENBWlgsQ0FBQTs7c0JBQUE7O0tBRHVCLE9BTHpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/sarah/.atom/packages/project-manager/lib/save-dialog.coffee
