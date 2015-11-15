(function() {
  var Tabularize, TabularizeView;

  Tabularize = require('../lib/tabularize');

  TabularizeView = require('../lib/tabularize-view');

  describe("Tabularize", function() {
    var editor, editorView, tabularize, _ref;
    _ref = [], editor = _ref[0], editorView = _ref[1], tabularize = _ref[2];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open();
      });
      return runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        editorView = atom.views.getView(editor);
        return tabularize = TabularizeView.activate();
      });
    });
    describe(".tabularize", function() {
      it("", function() {
        var actual, expected, regex, text;
        regex = "values";
        text = "INSERT INTO region(id, description, active) values(0, 0, 'AB', 'Alberta', true);";
        text += "\n";
        text += "INSERT INTO region(id, code, description, active) values (1, 0, 'BC', 'British Columbia', true);";
        expected = "INSERT INTO region(id, description, active)       values (0, 0, 'AB', 'Alberta', true);";
        expected += "\n";
        expected += "INSERT INTO region(id, code, description, active) values (1, 0, 'BC', 'British Columbia', true);";
        editor.setText(text);
        editor.selectAll();
        Tabularize.tabularize(regex, editor);
        actual = editor.getText();
        return expect(actual).toEqual(expected);
      });
      it("tabularizes columns", function() {
        var actual, expected, regex, text;
        regex = "\\|";
        text = "a | bbbbbbb | c\naaa | b | ccc";
        expected = "a   | bbbbbbb | c\naaa | b       | ccc";
        editor.setText(text);
        editor.selectAll();
        Tabularize.tabularize(regex, editor);
        actual = editor.getText();
        return expect(actual).toEqual(expected);
      });
      it("treats the input as a regex", function() {
        var actual, expected, regex, text;
        regex = "\\d";
        text = "a 1 bbbbbbb 2 c\naaa 3 b 4 ccc";
        expected = "a   1 bbbbbbb 2 c\naaa 3 b       4 ccc";
        editor.setText(text);
        editor.selectAll();
        Tabularize.tabularize(regex, editor);
        actual = editor.getText();
        return expect(actual).toEqual(expected);
      });
      it("deals with indenting correctly when not selecting whole lines", function() {
        var actual, expected, regex, text;
        text = "    @on 'core:confirm', => @confirm()";
        text += "\n";
        text += "    @on 'core:cancel', => @detach()";
        expected = "    @on 'core:confirm', => @confirm()";
        expected += "\n";
        expected += "    @on 'core:cancel',  => @detach()";
        regex = "=>";
        editor.setText(text);
        editor.setCursorBufferPosition([0, 4]);
        editor.selectToBottom();
        Tabularize.tabularize(regex, editor);
        actual = editor.getText();
        return expect(actual).toEqual(expected);
      });
      it("deals with partial reverse selections correctly", function() {
        var actual, expected, regex, text;
        text = "    @on 'core:confirm', => @confirm()";
        text += "\n";
        text += "    @on 'core:cancel', => @detach()";
        expected = "    @on 'core:confirm', => @confirm()";
        expected += "\n";
        expected += "    @on 'core:cancel',  => @detach()";
        regex = "=>";
        editor.setText(text);
        editor.moveToBottom();
        editor.moveToEndOfLine();
        editor.selectToBufferPosition([0, 4]);
        Tabularize.tabularize(regex, editor);
        actual = editor.getText();
        return expect(actual).toEqual(expected);
      });
      return it("does not explode with that stupid error", function() {
        var actual, text;
        text = "{\n";
        text += "  \"foo\" : 1,\n";
        text += "  \"large_row\" : 2,\n";
        text += "  \"small\" : 3,\n";
        text += "}\n";
        editor.setText(text);
        editor.moveToTop();
        editor.selectToBufferPosition([4, 15]);
        actual = editor.getText();
        console.log(actual);
        return Tabularize.tabularize(":", editor);
      });
    });
    return describe(".stripTrailingWhitespace", function() {
      return it("removes only trailing whitespace from string", function() {
        return expect(Tabularize.stripTrailingWhitespace("      object    ")).toEqual("      object");
      });
    });
  });

}).call(this);
