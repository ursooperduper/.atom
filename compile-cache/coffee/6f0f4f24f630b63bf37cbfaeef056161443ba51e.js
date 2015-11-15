(function() {
  var ManagePostCategoriesView, ManagePostTagsView;

  ManagePostCategoriesView = require("../../lib/views/manage-post-categories-view");

  ManagePostTagsView = require("../../lib/views/manage-post-tags-view");

  describe("ManageFrontMatterView", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open("front-matter.markdown");
      });
    });
    describe("ManagePostCategoriesView", function() {
      var categoriesView, editor, _ref;
      _ref = [], editor = _ref[0], categoriesView = _ref[1];
      beforeEach(function() {
        return categoriesView = new ManagePostCategoriesView({});
      });
      describe("when editor has malformed front matter", function() {
        return it("does nothing", function() {
          atom.confirm = function() {
            return {};
          };
          editor = atom.workspace.getActiveTextEditor();
          editor.setText("---\ntitle: Markdown Writer (Jekyll)\n----\n---");
          categoriesView.display();
          return expect(categoriesView.panel.isVisible()).toBe(false);
        });
      });
      return describe("when editor has front matter", function() {
        beforeEach(function() {
          editor = atom.workspace.getActiveTextEditor();
          return editor.setText("---\ntitle: Markdown Writer (Jekyll)\ndate: 2015-08-12 23:19\ncategories: Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n\nsome random text 1\nsome random text 2");
        });
        it("display edit panel", function() {
          categoriesView.display();
          return expect(categoriesView.panel.isVisible()).toBe(true);
        });
        return it("updates editor text", function() {
          categoriesView.display();
          categoriesView.saveFrontMatter();
          expect(categoriesView.panel.isVisible()).toBe(false);
          return expect(editor.getText()).toBe("---\ntitle: Markdown Writer (Jekyll)\ndate: '2015-08-12 23:19'\ncategories:\n  - Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n\nsome random text 1\nsome random text 2");
        });
      });
    });
    return describe("ManagePostTagsView", function() {
      var editor, tagsView, _ref;
      _ref = [], editor = _ref[0], tagsView = _ref[1];
      beforeEach(function() {
        return tagsView = new ManagePostTagsView({});
      });
      it("rank tags", function() {
        var fixture, tags;
        fixture = "ab ab cd ab ef gh ef";
        tags = ["ab", "cd", "ef", "ij"].map(function(t) {
          return {
            name: t
          };
        });
        tagsView.rankTags(tags, fixture);
        return expect(tags).toEqual([
          {
            name: "ab",
            count: 3
          }, {
            name: "ef",
            count: 2
          }, {
            name: "cd",
            count: 1
          }, {
            name: "ij",
            count: 0
          }
        ]);
      });
      return it("rank tags with regex escaped", function() {
        var fixture, tags;
        fixture = "c++ c.c^abc $10.0 +abc";
        tags = ["c++", "\\", "^", "$", "+abc"].map(function(t) {
          return {
            name: t
          };
        });
        tagsView.rankTags(tags, fixture);
        return expect(tags).toEqual([
          {
            name: "c++",
            count: 1
          }, {
            name: "^",
            count: 1
          }, {
            name: "$",
            count: 1
          }, {
            name: "+abc",
            count: 1
          }, {
            name: "\\",
            count: 0
          }
        ]);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL3ZpZXdzL21hbmFnZS1mcm9udC1tYXR0ZXItdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0Q0FBQTs7QUFBQSxFQUFBLHdCQUFBLEdBQTJCLE9BQUEsQ0FBUSw2Q0FBUixDQUEzQixDQUFBOztBQUFBLEVBQ0Esa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHVDQUFSLENBRHJCLENBQUE7O0FBQUEsRUFHQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLHVCQUFwQixFQUFIO01BQUEsQ0FBaEIsRUFEUztJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFHQSxRQUFBLENBQVMsMEJBQVQsRUFBcUMsU0FBQSxHQUFBO0FBQ25DLFVBQUEsNEJBQUE7QUFBQSxNQUFBLE9BQTJCLEVBQTNCLEVBQUMsZ0JBQUQsRUFBUyx3QkFBVCxDQUFBO0FBQUEsTUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO2VBQ1QsY0FBQSxHQUFxQixJQUFBLHdCQUFBLENBQXlCLEVBQXpCLEVBRFo7TUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLE1BS0EsUUFBQSxDQUFTLHdDQUFULEVBQW1ELFNBQUEsR0FBQTtlQUNqRCxFQUFBLENBQUcsY0FBSCxFQUFtQixTQUFBLEdBQUE7QUFDakIsVUFBQSxJQUFJLENBQUMsT0FBTCxHQUFlLFNBQUEsR0FBQTttQkFBRyxHQUFIO1VBQUEsQ0FBZixDQUFBO0FBQUEsVUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixD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

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/spec/views/manage-front-matter-view-spec.coffee
