(function() {
  var LineMeta;

  LineMeta = require("../../lib/helpers/line-meta");

  describe("LineMeta", function() {
    describe(".isList", function() {
      it("is not list", function() {
        return expect(LineMeta.isList("normal line")).toBe(false);
      });
      it("is not list, blockquote", function() {
        return expect(LineMeta.isList("> blockquote")).toBe(false);
      });
      it("is unordered list", function() {
        return expect(LineMeta.isList("- list")).toBe(true);
      });
      it("is unordered task list", function() {
        return expect(LineMeta.isList("- [ ]list")).toBe(true);
      });
      it("is unordered task list", function() {
        return expect(LineMeta.isList("- [ ] list")).toBe(true);
      });
      it("is ordered list", function() {
        return expect(LineMeta.isList("12. list")).toBe(true);
      });
      it("is ordered task list", function() {
        return expect(LineMeta.isList("12. [ ]list")).toBe(true);
      });
      return it("is ordered task list", function() {
        return expect(LineMeta.isList("12. [ ] list")).toBe(true);
      });
    });
    describe("normal line", function() {
      return it("is not continuous", function() {
        return expect(new LineMeta("normal line").isContinuous()).toBe(false);
      });
    });
    describe("unordered task list line", function() {
      var lineMeta;
      lineMeta = new LineMeta("- [X] line");
      it("is list", function() {
        return expect(lineMeta.isList()).toBe(true);
      });
      it("is ul list", function() {
        return expect(lineMeta.isList("ul")).toBe(true);
      });
      it("is not ol list", function() {
        return expect(lineMeta.isList("ol")).toBe(false);
      });
      it("is task list", function() {
        return expect(lineMeta.isTaskList()).toBe(true);
      });
      it("is continuous", function() {
        return expect(lineMeta.isContinuous()).toBe(true);
      });
      it("is not empty body", function() {
        return expect(lineMeta.isEmptyBody()).toBe(false);
      });
      it("has body", function() {
        return expect(lineMeta.body).toBe("line");
      });
      it("has head", function() {
        return expect(lineMeta.head).toBe("-");
      });
      return it("has nextLine", function() {
        return expect(lineMeta.nextLine).toBe("- [ ] ");
      });
    });
    describe("unordered list line", function() {
      var lineMeta;
      lineMeta = new LineMeta("- line");
      it("is list", function() {
        return expect(lineMeta.isList()).toBe(true);
      });
      it("is continuous", function() {
        return expect(lineMeta.isContinuous()).toBe(true);
      });
      it("is not empty body", function() {
        return expect(lineMeta.isEmptyBody()).toBe(false);
      });
      it("has body", function() {
        return expect(lineMeta.body).toBe("line");
      });
      it("has head", function() {
        return expect(lineMeta.head).toBe("-");
      });
      return it("has nextLine", function() {
        return expect(lineMeta.nextLine).toBe("- ");
      });
    });
    describe("ordered task list line", function() {
      var lineMeta;
      lineMeta = new LineMeta("99. [X] line");
      it("is list", function() {
        return expect(lineMeta.isList()).toBe(true);
      });
      it("is ol list", function() {
        return expect(lineMeta.isList("ol")).toBe(true);
      });
      it("is not ul list", function() {
        return expect(lineMeta.isList("ul")).toBe(false);
      });
      it("is task list", function() {
        return expect(lineMeta.isTaskList()).toBe(true);
      });
      it("is continuous", function() {
        return expect(lineMeta.isContinuous()).toBe(true);
      });
      it("is not empty body", function() {
        return expect(lineMeta.isEmptyBody()).toBe(false);
      });
      it("has body", function() {
        return expect(lineMeta.body).toBe("line");
      });
      it("has head", function() {
        return expect(lineMeta.head).toBe("99");
      });
      return it("has nextLine", function() {
        return expect(lineMeta.nextLine).toBe("100. [ ] ");
      });
    });
    describe("ordered list line", function() {
      var lineMeta;
      lineMeta = new LineMeta("3. line");
      it("is list", function() {
        return expect(lineMeta.isList()).toBe(true);
      });
      it("is continuous", function() {
        return expect(lineMeta.isContinuous()).toBe(true);
      });
      it("is not empty body", function() {
        return expect(lineMeta.isEmptyBody()).toBe(false);
      });
      it("has body", function() {
        return expect(lineMeta.body).toBe("line");
      });
      it("has head", function() {
        return expect(lineMeta.head).toBe("3");
      });
      return it("has nextLine", function() {
        return expect(lineMeta.nextLine).toBe("4. ");
      });
    });
    describe("empty list line", function() {
      var lineMeta;
      lineMeta = new LineMeta("3.     ");
      it("is list", function() {
        return expect(lineMeta.isList()).toBe(true);
      });
      it("is continuous", function() {
        return expect(lineMeta.isContinuous()).toBe(true);
      });
      it("is not empty body", function() {
        return expect(lineMeta.isEmptyBody()).toBe(true);
      });
      it("has body", function() {
        return expect(lineMeta.body).toBe("");
      });
      it("has head", function() {
        return expect(lineMeta.head).toBe("3");
      });
      return it("has nextLine", function() {
        return expect(lineMeta.nextLine).toBe("4. ");
      });
    });
    return describe("blockquote", function() {
      var lineMeta;
      lineMeta = new LineMeta("  > blockquote");
      it("is list", function() {
        return expect(lineMeta.isList()).toBe(false);
      });
      it("is continuous", function() {
        return expect(lineMeta.isContinuous()).toBe(true);
      });
      it("is not empty body", function() {
        return expect(lineMeta.isEmptyBody()).toBe(false);
      });
      it("has body", function() {
        return expect(lineMeta.body).toBe("blockquote");
      });
      it("has head", function() {
        return expect(lineMeta.head).toBe(">");
      });
      return it("has nextLine", function() {
        return expect(lineMeta.nextLine).toBe("  > ");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL2hlbHBlcnMvbGluZS1tZXRhLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLDZCQUFSLENBQVgsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUVuQixJQUFBLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUEsR0FBQTtBQUNsQixNQUFBLEVBQUEsQ0FBRyxhQUFILEVBQWtCLFNBQUEsR0FBQTtlQUFHLE1BQUEsQ0FBTyxRQUFRLENBQUMsTUFBVCxDQUFnQixhQUFoQixDQUFQLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsS0FBNUMsRUFBSDtNQUFBLENBQWxCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsRUFBQSxDQUFHLHlCQUFILEVBQThCLFNBQUEsR0FBQTtlQUFHLE1BQUEsQ0FBTyxRQUFRLENBQUMsTUFBVCxDQUFnQixjQUFoQixDQUFQLENBQXVDLENBQUMsSUFBeEMsQ0FBNkMsS0FBN0MsRUFBSDtNQUFBLENBQTlCLENBREEsQ0FBQTtBQUFBLE1BRUEsRUFBQSxDQUFHLG1CQUFILEVBQXdCLFNBQUEsR0FBQTtlQUFHLE1BQUEsQ0FBTyxRQUFRLENBQUMsTUFBVCxDQUFnQixRQUFoQixDQUFQLENBQWlDLENBQUMsSUFBbEMsQ0FBdUMsSUFBdkMsRUFBSDtNQUFBLENBQXhCLENBRkEsQ0FBQTtBQUFBLE1BR0EsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUEsR0FBQTtlQUFHLE1BQUEsQ0FBTyxRQUFRLENBQUMsTUFBVCxDQUFnQixXQUFoQixDQUFQLENBQW9DLENBQUMsSUFBckMsQ0FBMEMsSUFBMUMsRUFBSDtNQUFBLENB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

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/spec/helpers/line-meta-spec.coffee
