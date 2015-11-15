(function() {
  var dash;

  dash = require('../lib/dash');

  describe("dash", function() {
    return it("should open dash", function() {
      return waitsForPromise(function() {
        return atom.workspace.open('test.hs').then(function(editor) {
          var view;
          view = atom.views.getView(editor);
          editor.setCursorBufferPosition({
            row: 1,
            column: 6
          });
          return new Promise(function(resolve, reject) {
            dash.exec = function(cmd) {
              expect(cmd).toEqual('open -g "dash-plugin://query=.SetFlags"');
              return resolve();
            };
            return dash.shortcut(true);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2Rhc2gvc3BlYy9kYXNoLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLElBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGFBQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLE1BQVQsRUFBaUIsU0FBQSxHQUFBO1dBQ2YsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUEsR0FBQTthQUNyQixlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixTQUFwQixDQUE4QixDQUFDLElBQS9CLENBQW9DLFNBQUMsTUFBRCxHQUFBO0FBQ2xDLGNBQUEsSUFBQTtBQUFBLFVBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQixDQUFQLENBQUE7QUFBQSxVQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQjtBQUFBLFlBQUUsR0FBQSxFQUFLLENBQVA7QUFBQSxZQUFVLE1BQUEsRUFBUSxDQUFsQjtXQUEvQixDQUZBLENBQUE7aUJBSUksSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBQ1YsWUFBQSxJQUFJLENBQUMsSUFBTCxHQUFZLFNBQUMsR0FBRCxHQUFBO0FBQ1YsY0FBQSxNQUFBLENBQU8sR0FBUCxDQUFXLENBQUMsT0FBWixDQUFvQix5Q0FBcEIsQ0FBQSxDQUFBO3FCQUNBLE9BQUEsQ0FBQSxFQUZVO1lBQUEsQ0FBWixDQUFBO21CQUlBLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBZCxFQUxVO1VBQUEsQ0FBUixFQUw4QjtRQUFBLENBQXBDLEVBRGM7TUFBQSxDQUFoQixFQURxQjtJQUFBLENBQXZCLEVBRGU7RUFBQSxDQUFqQixDQUZBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/sarah/.atom/packages/dash/spec/dash-spec.coffee
