(function() {
  var NewDraftView, NewFileView, NewPostView;

  NewFileView = require("../../lib/views/new-file-view");

  NewDraftView = require("../../lib/views/new-draft-view");

  NewPostView = require("../../lib/views/new-post-view");

  describe("NewFileView", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
    });
    describe("NewFileView", function() {
      var newFileView;
      newFileView = null;
      beforeEach(function() {
        return newFileView = new NewFileView({});
      });
      describe('.getFileName', function() {
        return it("get filename in hexo format", function() {
          atom.config.set("markdown-writer.newFileFileName", "file-{title}{extension}");
          atom.config.set("markdown-writer.fileExtension", ".md");
          newFileView.titleEditor.setText("Hexo format");
          newFileView.dateEditor.setText("2014-11-19");
          return expect(newFileView.getFileName()).toBe("file-hexo-format.md");
        });
      });
      return describe('.generateFrontMatter', function() {
        it("generate correctly", function() {
          var frontMatter;
          frontMatter = {
            layout: "test",
            title: "the actual title",
            date: "2014-11-19"
          };
          return expect(newFileView.generateFrontMatter(frontMatter)).toBe("---\nlayout: test\ntitle: \"the actual title\"\ndate: \"2014-11-19\"\n---");
        });
        return it("generate based on setting", function() {
          var frontMatter;
          frontMatter = {
            layout: "test",
            title: "the actual title",
            date: "2014-11-19"
          };
          atom.config.set("markdown-writer.frontMatter", "title: <title>");
          return expect(newFileView.generateFrontMatter(frontMatter)).toBe("title: the actual title");
        });
      });
    });
    describe("NewDraftView", function() {
      var newDraftView;
      newDraftView = null;
      beforeEach(function() {
        return newDraftView = new NewDraftView({});
      });
      describe("class methods", function() {
        return it("override correctly", function() {
          expect(NewDraftView.fileType).toBe("Draft");
          expect(NewDraftView.pathConfig).toBe("siteDraftsDir");
          return expect(NewDraftView.fileNameConfig).toBe("newDraftFileName");
        });
      });
      describe(".display", function() {
        return it('display correct message', function() {
          newDraftView.display();
          newDraftView.dateEditor.setText("2015-08-23");
          newDraftView.titleEditor.setText("Draft Title");
          return expect(newDraftView.message.text()).toBe("Site Directory: /config/your/local/directory/in/settings/\nCreate Draft At: _drafts/draft-title.markdown");
        });
      });
      return describe(".getFrontMatter", function() {
        return it("get the correct front matter", function() {
          var frontMatter;
          newDraftView.dateEditor.setText("2015-08-23");
          newDraftView.titleEditor.setText("Draft Title");
          frontMatter = newDraftView.getFrontMatter();
          expect(frontMatter.layout).toBe("post");
          expect(frontMatter.published).toBe(false);
          expect(frontMatter.title).toBe("Draft Title");
          return expect(frontMatter.slug).toBe("draft-title");
        });
      });
    });
    return describe("NewPostView", function() {
      var newPostView;
      newPostView = null;
      beforeEach(function() {
        return newPostView = new NewPostView({});
      });
      describe("class methods", function() {
        return it("override correctly", function() {
          expect(NewPostView.fileType).toBe("Post");
          expect(NewPostView.pathConfig).toBe("sitePostsDir");
          return expect(NewPostView.fileNameConfig).toBe("newPostFileName");
        });
      });
      describe(".display", function() {
        return it('display correct message', function() {
          newPostView.display();
          newPostView.dateEditor.setText("2015-08-23");
          newPostView.titleEditor.setText("Post's Title");
          return expect(newPostView.message.text()).toBe("Site Directory: /config/your/local/directory/in/settings/\nCreate Post At: _posts/2015/2015-08-23-posts-title.markdown");
        });
      });
      return describe(".getFrontMatter", function() {
        return it("get the correct front matter", function() {
          var frontMatter;
          newPostView.dateEditor.setText("2015-08-24");
          newPostView.titleEditor.setText("Post's Title: Subtitle");
          frontMatter = newPostView.getFrontMatter();
          expect(frontMatter.layout).toBe("post");
          expect(frontMatter.published).toBe(true);
          expect(frontMatter.title).toBe("Post's Title: Subtitle");
          return expect(frontMatter.slug).toBe("posts-title-subtitle");
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL3ZpZXdzL25ldy1maWxlLXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0NBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLCtCQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsZ0NBQVIsQ0FEZixDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSwrQkFBUixDQUZkLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsZ0JBQXBCLEVBQUg7TUFBQSxDQUFoQixFQURTO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQUdBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixVQUFBLFdBQUE7QUFBQSxNQUFBLFdBQUEsR0FBYyxJQUFkLENBQUE7QUFBQSxNQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxXQUFBLEdBQWtCLElBQUEsV0FBQSxDQUFZLEVBQVosRUFEVDtNQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsTUFLQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7ZUFDdkIsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxVQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQ0FBaEIsRUFBbUQseUJBQW5ELENBQUEsQ0FBQTtBQUFBLFVBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENB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

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/spec/views/new-file-view-spec.coffee
