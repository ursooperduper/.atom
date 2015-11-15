(function() {
  var findClosingIndex, split, _ref;

  _ref = require('../lib/utils'), findClosingIndex = _ref.findClosingIndex, split = _ref.split;

  describe('split', function() {
    return it('does not fail when there is parenthesis after', function() {
      var res, string;
      string = "a,)(";
      res = split(string);
      return expect(res).toEqual(['a', '']);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvdXRpbHMtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkJBQUE7O0FBQUEsRUFBQSxPQUE0QixPQUFBLENBQVEsY0FBUixDQUE1QixFQUFDLHdCQUFBLGdCQUFELEVBQW1CLGFBQUEsS0FBbkIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxPQUFULEVBQWtCLFNBQUEsR0FBQTtXQUNoQixFQUFBLENBQUcsK0NBQUgsRUFBb0QsU0FBQSxHQUFBO0FBQ2xELFVBQUEsV0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLE1BQVQsQ0FBQTtBQUFBLE1BRUEsR0FBQSxHQUFNLEtBQUEsQ0FBTSxNQUFOLENBRk4sQ0FBQTthQUlBLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxPQUFaLENBQW9CLENBQUMsR0FBRCxFQUFLLEVBQUwsQ0FBcEIsRUFMa0Q7SUFBQSxDQUFwRCxFQURnQjtFQUFBLENBQWxCLENBRkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/sarah/.atom/packages/pigments/spec/utils-spec.coffee
