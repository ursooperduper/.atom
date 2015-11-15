(function() {
  var PublishDraft;

  PublishDraft = require("../../lib/commands/publish-draft");

  describe("PublishDraft", function() {
    var editor, publishDraft, _ref;
    _ref = [], editor = _ref[0], publishDraft = _ref[1];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
      return runs(function() {
        return editor = atom.workspace.getActiveTextEditor();
      });
    });
    describe(".trigger", function() {
      return it("abort publish draft when not confirm publish", function() {
        publishDraft = new PublishDraft({});
        publishDraft.confirmPublish = function() {
          return {};
        };
        publishDraft.trigger();
        expect(publishDraft.draftPath).toMatch("fixtures/empty.markdown");
        return expect(publishDraft.postPath).toMatch(/\/\d{4}\/\d{4}-\d\d-\d\d-empty\.markdown/);
      });
    });
    describe(".getPostTile", function() {
      it("get title from front matter by config", function() {
        atom.config.set("markdown-writer.publishRenameBasedOnTitle", true);
        editor.setText("---\ntitle: Markdown Writer\n---");
        publishDraft = new PublishDraft({});
        return expect(publishDraft._getPostTitle()).toBe("markdown-writer");
      });
      it("get title from front matter if no draft path", function() {
        editor.setText("---\ntitle: Markdown Writer (New Post)\n---");
        publishDraft = new PublishDraft({});
        return expect(publishDraft._getPostTitle()).toBe("markdown-writer-new-post");
      });
      it("get title from draft path", function() {
        publishDraft = new PublishDraft({});
        publishDraft.draftPath = "test/name-of-post.md";
        return expect(publishDraft._getPostTitle()).toBe("name-of-post");
      });
      return it("get new-post when no front matter/draft path", function() {
        publishDraft = new PublishDraft({});
        return expect(publishDraft._getPostTitle()).toBe("new-post");
      });
    });
    return describe(".getPostExtension", function() {
      beforeEach(function() {
        return publishDraft = new PublishDraft({});
      });
      it("get draft path extname by config", function() {
        atom.config.set("markdown-writer.publishKeepFileExtname", true);
        publishDraft.draftPath = "test/name.md";
        return expect(publishDraft._getPostExtension()).toBe(".md");
      });
      return it("get default extname", function() {
        publishDraft.draftPath = "test/name.md";
        return expect(publishDraft._getPostExtension()).toBe(".markdown");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL2NvbW1hbmRzL3B1Ymxpc2gtZHJhZnQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsWUFBQTs7QUFBQSxFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsa0NBQVIsQ0FBZixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFFBQUEsMEJBQUE7QUFBQSxJQUFBLE9BQXlCLEVBQXpCLEVBQUMsZ0JBQUQsRUFBUyxzQkFBVCxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixnQkFBcEIsRUFBSDtNQUFBLENBQWhCLENBQUEsQ0FBQTthQUNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7ZUFBRyxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLEVBQVo7TUFBQSxDQUFMLEVBRlM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBTUEsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO2FBQ25CLEVBQUEsQ0FBRyw4Q0FBSCxFQUFtRCxTQUFBLEdBQUE7QUFDakQsUUFBQSxZQUFBLEdBQW1CLElBQUEsWUFBQSxDQUFhLEVBQWIsQ0FBbkIsQ0FBQTtBQUFBLFFBQ0EsWUFBWSxDQUFDLGNBQWIsR0FBOEIsU0FBQSxHQUFBO2lCQUFHLEdBQUg7UUFBQSxDQUQ5QixDQUFBO0FBQUEsUUFHQSxZQUFZLENBQUMsT0FBYixDQUFBLENBSEEsQ0FBQTtBQUFBLFFBS0EsTUFBQSxDQUFPLFlBQVksQ0FBQyxTQUFwQixDQUE4QixDQUFDLE9BQS9C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

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/spec/commands/publish-draft-spec.coffee
