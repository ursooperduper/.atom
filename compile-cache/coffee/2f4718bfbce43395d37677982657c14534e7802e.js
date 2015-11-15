(function() {
  var ColorScanner, TextEditor;

  ColorScanner = require('../lib/color-scanner');

  TextEditor = require('atom').TextEditor;

  describe('ColorScanner', function() {
    var editor, lastIndex, result, scanner, text, withScannerForTextEditor, withTextEditor, _ref;
    _ref = [], scanner = _ref[0], editor = _ref[1], text = _ref[2], result = _ref[3], lastIndex = _ref[4];
    withTextEditor = function(fixture, block) {
      return describe("with " + fixture + " buffer", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open(fixture);
          });
          return runs(function() {
            editor = atom.workspace.getActiveTextEditor();
            return text = editor.getText();
          });
        });
        afterEach(function() {
          return editor = null;
        });
        return block();
      });
    };
    withScannerForTextEditor = function(fixture, block) {
      return withTextEditor(fixture, function() {
        beforeEach(function() {
          return scanner = new ColorScanner;
        });
        afterEach(function() {
          return scanner = null;
        });
        return block();
      });
    };
    return describe('::search', function() {
      withScannerForTextEditor('html-entities.html', function() {
        beforeEach(function() {
          return result = scanner.search(text);
        });
        return it('returns nothing', function() {
          return expect(result).toBeUndefined();
        });
      });
      withScannerForTextEditor('css-color-with-prefix.less', function() {
        beforeEach(function() {
          return result = scanner.search(text);
        });
        return it('returns nothing', function() {
          return expect(result).toBeUndefined();
        });
      });
      return withScannerForTextEditor('four-variables.styl', function() {
        beforeEach(function() {
          return result = scanner.search(text);
        });
        it('returns the first buffer color match', function() {
          return expect(result).toBeDefined();
        });
        describe('the resulting buffer color', function() {
          it('has a text range', function() {
            return expect(result.range).toEqual([13, 17]);
          });
          it('has a color', function() {
            return expect(result.color).toBeColor('#ffffff');
          });
          it('stores the matched text', function() {
            return expect(result.match).toEqual('#fff');
          });
          it('stores the last index', function() {
            return expect(result.lastIndex).toEqual(17);
          });
          return it('stores match line', function() {
            return expect(result.line).toEqual(0);
          });
        });
        return describe('successive searches', function() {
          it('returns a buffer color for each match and then undefined', function() {
            var doSearch;
            doSearch = function() {
              return result = scanner.search(text, result.lastIndex);
            };
            expect(doSearch()).toBeDefined();
            expect(doSearch()).toBeDefined();
            expect(doSearch()).toBeDefined();
            return expect(doSearch()).toBeUndefined();
          });
          return it('stores the line of successive matches', function() {
            var doSearch;
            doSearch = function() {
              return result = scanner.search(text, result.lastIndex);
            };
            expect(doSearch().line).toEqual(2);
            expect(doSearch().line).toEqual(4);
            return expect(doSearch().line).toEqual(6);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvY29sb3Itc2Nhbm5lci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTs7QUFBQSxFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsc0JBQVIsQ0FBZixDQUFBOztBQUFBLEVBQ0MsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBREQsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUN2QixRQUFBLHdGQUFBO0FBQUEsSUFBQSxPQUE2QyxFQUE3QyxFQUFDLGlCQUFELEVBQVUsZ0JBQVYsRUFBa0IsY0FBbEIsRUFBd0IsZ0JBQXhCLEVBQWdDLG1CQUFoQyxDQUFBO0FBQUEsSUFFQSxjQUFBLEdBQWlCLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTthQUNmLFFBQUEsQ0FBVSxPQUFBLEdBQU8sT0FBUCxHQUFlLFNBQXpCLEVBQW1DLFNBQUEsR0FBQTtBQUNqQyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO21CQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixPQUFwQixFQUFIO1VBQUEsQ0FBaEIsQ0FBQSxDQUFBO2lCQUNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxZQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO21CQUNBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLEVBRko7VUFBQSxDQUFMLEVBRlM7UUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFFBTUEsU0FBQSxDQUFVLFNBQUEsR0FBQTtpQkFBRyxNQUFBLEdBQVMsS0FBWjtRQUFBLENBQVYsQ0FOQSxD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

//# sourceURL=/Users/sarah/.atom/packages/pigments/spec/color-scanner-spec.coffee
