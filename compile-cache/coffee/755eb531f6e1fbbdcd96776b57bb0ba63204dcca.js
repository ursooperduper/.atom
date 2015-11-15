(function() {
  var FormatText;

  FormatText = require("../../lib/commands/format-text");

  describe("FormatText", function() {
    var editor, formatText, _ref;
    _ref = [], editor = _ref[0], formatText = _ref[1];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
      return runs(function() {
        return editor = atom.workspace.getActiveTextEditor();
      });
    });
    describe("correctOrderListNumbers", function() {
      beforeEach(function() {
        return formatText = new FormatText("correct-order-list-numbers");
      });
      it("does nothing if it is not an order list", function() {
        editor.setText("text is a long paragraph\ntext is a long paragraph");
        editor.setCursorBufferPosition([0, 3]);
        formatText.trigger();
        return expect(editor.getText()).toBe("text is a long paragraph\ntext is a long paragraph");
      });
      return it("correct order list numbers", function() {
        editor.setText("text before\n\n3. aaa\n9. bbb\n0. ccc\n  9. aaa\n    - aaa\n  1. bbb\n  1. ccc\n    0. aaa\n      7. aaa\n        - aaa\n        - bbb\n    9. bbb\n  4. ddd\n7. ddd\n7. eee\n\ntext after");
        editor.setCursorBufferPosition([5, 3]);
        formatText.trigger();
        return expect(editor.getText()).toBe("text before\n\n1. aaa\n2. bbb\n3. ccc\n  1. aaa\n    - aaa\n  2. bbb\n  3. ccc\n    1. aaa\n      1. aaa\n        - aaa\n        - bbb\n    2. bbb\n  4. ddd\n4. ddd\n5. eee\n\ntext after");
      });
    });
    return describe("formatTable", function() {
      beforeEach(function() {
        return formatText = new FormatText("format-table");
      });
      it("does nothing if it is not a table", function() {
        editor.setText("text is a long paragraph\ntext is a long paragraph");
        editor.setCursorBufferPosition([0, 3]);
        formatText.trigger();
        return expect(editor.getText()).toBe("text is a long paragraph\ntext is a long paragraph");
      });
      it("format table without alignment", function() {
        var expected;
        editor.setText("text before\n\nh1| h21|h1233|h343\n-|-\n|||\nt123           | t2\n |t12|\n\ntext after");
        expected = "text before\n\nh1   | h21 | h1233 | h343\n-----|-----|-------|-----\n     |     |       |\nt123 | t2  |       |\n     | t12 |       |\n\ntext after";
        editor.setCursorBufferPosition([4, 3]);
        formatText.trigger();
        editor.setCursorBufferPosition([4, 3]);
        formatText.trigger();
        return expect(editor.getText()).toBe(expected);
      });
      return it("format table with alignment", function() {
        var expected;
        editor.setText("text before\n\n|h1-3   | h2-1|h3-2|\n|:-|:-:|--:|:-:|\n| | t2\n|t1| |t3\n|t     |t|    t\n\ntext after");
        expected = "text before\n\n| h1-3 | h2-1 | h3-2 |   |\n|:-----|:----:|-----:|:-:|\n|      |  t2  |      |   |\n| t1   |      |   t3 |   |\n| t    |  t   |    t |   |\n\ntext after";
        editor.setCursorBufferPosition([4, 3]);
        formatText.trigger();
        editor.setCursorBufferPosition([4, 3]);
        formatText.trigger();
        return expect(editor.getText()).toBe(expected);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL2NvbW1hbmRzL2Zvcm1hdC10ZXh0LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGdDQUFSLENBQWIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxZQUFULEVBQXVCLFNBQUEsR0FBQTtBQUNyQixRQUFBLHdCQUFBO0FBQUEsSUFBQSxPQUF1QixFQUF2QixFQUFDLGdCQUFELEVBQVMsb0JBQVQsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsZ0JBQXBCLEVBQUg7TUFBQSxDQUFoQixDQUFBLENBQUE7YUFDQSxJQUFBLENBQUssU0FBQSxHQUFBO2VBQUcsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxFQUFaO01BQUEsQ0FBTCxFQUZTO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQU1BLFFBQUEsQ0FBUyx5QkFBVCxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2VBQUcsVUFBQSxHQUFpQixJQUFBLFVBQUEsQ0FBVyw0QkFBWCxFQUFwQjtNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFFQSxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQSxHQUFBO0FBQzVDLFFBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxvREFBZixDQUFBLENBQUE7QUFBQSxRQUlBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBSkEsQ0FBQTtB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

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/spec/commands/format-text-spec.coffee
