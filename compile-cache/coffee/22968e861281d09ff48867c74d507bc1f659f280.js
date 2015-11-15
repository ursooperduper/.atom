(function() {
  var InsertImageView;

  InsertImageView = require("../../lib/views/insert-image-view");

  describe("InsertImageView", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
    });
    return it('can be initialized', function() {
      var insertImageView;
      return insertImageView = new InsertImageView({});
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL3ZpZXdzL2luc2VydC1pbWFnZS12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGVBQUE7O0FBQUEsRUFBQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxtQ0FBUixDQUFsQixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUEsR0FBQTtBQUMxQixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixnQkFBcEIsRUFBSDtNQUFBLENBQWhCLEVBRFM7SUFBQSxDQUFYLENBQUEsQ0FBQTtXQUdBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsVUFBQSxlQUFBO2FBQUEsZUFBQSxHQUFzQixJQUFBLGVBQUEsQ0FBZ0IsRUFBaEIsRUFEQztJQUFBLENBQXpCLEVBSjBCO0VBQUEsQ0FBNUIsQ0FGQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/spec/views/insert-image-view-spec.coffee
