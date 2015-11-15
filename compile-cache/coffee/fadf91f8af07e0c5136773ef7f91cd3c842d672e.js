(function() {
  var InsertTableView;

  InsertTableView = require("../../lib/views/insert-table-view");

  describe("InsertTableView", function() {
    var insertTableView;
    insertTableView = null;
    beforeEach(function() {
      return insertTableView = new InsertTableView({});
    });
    it("validates table rows/columns", function() {
      expect(insertTableView.isValidRange(1, 1)).toBe(false);
      return expect(insertTableView.isValidRange(2, 2)).toBe(true);
    });
    describe("tableExtraPipes disabled", function() {
      it("create correct (2,2) table", function() {
        var table;
        table = insertTableView.createTable(2, 2);
        return expect(table).toEqual(["  |  ", "--|--", "  |  "].join("\n"));
      });
      return it("create correct (3,4) table", function() {
        var table;
        table = insertTableView.createTable(3, 4);
        return expect(table).toEqual(["  |   |   |  ", "--|---|---|--", "  |   |   |  ", "  |   |   |  "].join("\n"));
      });
    });
    describe("tableExtraPipes enabled", function() {
      beforeEach(function() {
        return atom.config.set("markdown-writer.tableExtraPipes", true);
      });
      it("create correct (2,2) table", function() {
        var table;
        table = insertTableView.createTable(2, 2);
        return expect(table).toEqual(["|   |   |", "|---|---|", "|   |   |"].join("\n"));
      });
      return it("create correct (3,4) table", function() {
        var table;
        table = insertTableView.createTable(3, 4);
        return expect(table).toEqual(["|   |   |   |   |", "|---|---|---|---|", "|   |   |   |   |", "|   |   |   |   |"].join("\n"));
      });
    });
    return describe("tableAlignment has set", function() {
      it("create correct (2,2) table (center)", function() {
        var table;
        atom.config.set("markdown-writer.tableAlignment", "center");
        table = insertTableView.createTable(2, 2);
        return expect(table).toEqual(["  |  ", "::|::", "  |  "].join("\n"));
      });
      it("create correct (2,2) table (left)", function() {
        var table;
        atom.config.set("markdown-writer.tableExtraPipes", true);
        atom.config.set("markdown-writer.tableAlignment", "left");
        table = insertTableView.createTable(2, 2);
        return expect(table).toEqual(["|   |   |", "|:--|:--|", "|   |   |"].join("\n"));
      });
      return it("create correct (2,2) table (right)", function() {
        var table;
        atom.config.set("markdown-writer.tableExtraPipes", true);
        atom.config.set("markdown-writer.tableAlignment", "right");
        table = insertTableView.createTable(2, 2);
        return expect(table).toEqual(["|   |   |", "|--:|--:|", "|   |   |"].join("\n"));
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9zcGVjL3ZpZXdzL2luc2VydC10YWJsZS12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGVBQUE7O0FBQUEsRUFBQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxtQ0FBUixDQUFsQixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUEsR0FBQTtBQUMxQixRQUFBLGVBQUE7QUFBQSxJQUFBLGVBQUEsR0FBa0IsSUFBbEIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUFHLGVBQUEsR0FBc0IsSUFBQSxlQUFBLENBQWdCLEVBQWhCLEVBQXpCO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQUlBLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsTUFBQSxNQUFBLENBQU8sZUFBZSxDQUFDLFlBQWhCLENBQTZCLENBQTdCLEVBQWdDLENBQWhDLENBQVAsQ0FBMEMsQ0FBQyxJQUEzQyxDQUFnRCxLQUFoRCxDQUFBLENBQUE7YUFDQSxNQUFBLENBQU8sZUFBZSxDQUFDLFlBQWhCLENBQTZCLENBQTdCLEVBQWdDLENBQWhDLENBQVAsQ0FBMEMsQ0FBQyxJQUEzQyxDQUFnRCxJQUFoRCxFQUZpQztJQUFBLENBQW5DLENBSkEsQ0FBQTtBQUFBLElBUUEsUUFBQSxDQUFTLDBCQUFULEVBQXFDLFNBQUEsR0FBQTtBQUNuQyxNQUFBLEVBQUEsQ0FBRyw0QkFBSCxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsWUFBQSxLQUFBO0FBQUEsUUFBQSxLQUFBLEdBQVEsZUFBZSxDQUFDLFdBQWhCLENBQTRCLENBQTVCLEVBQStCLENBQS9CLENBQVIsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxLQUFQ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

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/spec/views/insert-table-view-spec.coffee
