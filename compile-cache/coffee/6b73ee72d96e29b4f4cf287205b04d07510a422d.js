(function() {
  var SnippetExpansion, Subscriber, _;

  _ = require('underscore-plus');

  Subscriber = require('emissary').Subscriber;

  module.exports = SnippetExpansion = (function() {
    Subscriber.includeInto(SnippetExpansion);

    SnippetExpansion.prototype.settingTabStop = false;

    function SnippetExpansion(snippet, editor, cursor, snippets) {
      var startPosition;
      this.snippet = snippet;
      this.editor = editor;
      this.cursor = cursor != null ? cursor : this.editor.getCursor();
      this.snippets = snippets;
      this.tabStopMarkers = [];
      this.selections = [this.cursor.selection];
      startPosition = this.cursor.selection.getBufferRange().start;
      this.editor.transact((function(_this) {
        return function() {
          var newRange;
          newRange = _this.editor.transact(function() {
            return _this.cursor.selection.insertText(snippet.body, {
              autoIndent: false
            });
          });
          if (snippet.tabStops.length > 0) {
            _this.subscribe(_this.cursor, 'moved', function(event) {
              return _this.cursorMoved(event);
            });
            _this.placeTabStopMarkers(startPosition, snippet.tabStops);
            _this.snippets.addExpansion(_this.editor, _this);
            _this.editor.normalizeTabsInBufferRange(newRange);
          }
          if (snippet.lineCount > 1) {
            return _this.indentSubsequentLines(startPosition.row, snippet);
          }
        };
      })(this));
    }

    SnippetExpansion.prototype.cursorMoved = function(_arg) {
      var newBufferPosition, newTabStops, oldBufferPosition, oldTabStops, textChanged;
      oldBufferPosition = _arg.oldBufferPosition, newBufferPosition = _arg.newBufferPosition, textChanged = _arg.textChanged;
      if (this.settingTabStop || textChanged) {
        return;
      }
      oldTabStops = this.tabStopsForBufferPosition(oldBufferPosition);
      newTabStops = this.tabStopsForBufferPosition(newBufferPosition);
      if (!_.intersection(oldTabStops, newTabStops).length) {
        return this.destroy();
      }
    };

    SnippetExpansion.prototype.placeTabStopMarkers = function(startPosition, tabStopRanges) {
      var ranges, _i, _len;
      for (_i = 0, _len = tabStopRanges.length; _i < _len; _i++) {
        ranges = tabStopRanges[_i];
        this.tabStopMarkers.push(ranges.map((function(_this) {
          return function(_arg) {
            var end, start;
            start = _arg.start, end = _arg.end;
            return _this.editor.markBufferRange([startPosition.add(start), startPosition.add(end)]);
          };
        })(this)));
      }
      return this.setTabStopIndex(0);
    };

    SnippetExpansion.prototype.indentSubsequentLines = function(startRow, snippet) {
      var initialIndent, row, _i, _ref, _ref1, _results;
      initialIndent = this.editor.lineForBufferRow(startRow).match(/^\s*/)[0];
      _results = [];
      for (row = _i = _ref = startRow + 1, _ref1 = startRow + snippet.lineCount; _ref <= _ref1 ? _i < _ref1 : _i > _ref1; row = _ref <= _ref1 ? ++_i : --_i) {
        _results.push(this.editor.buffer.insert([row, 0], initialIndent));
      }
      return _results;
    };

    SnippetExpansion.prototype.goToNextTabStop = function() {
      var nextIndex;
      nextIndex = this.tabStopIndex + 1;
      if (nextIndex < this.tabStopMarkers.length) {
        if (this.setTabStopIndex(nextIndex)) {
          return true;
        } else {
          return this.goToNextTabStop();
        }
      } else {
        this.destroy();
        return false;
      }
    };

    SnippetExpansion.prototype.goToPreviousTabStop = function() {
      if (this.tabStopIndex > 0) {
        return this.setTabStopIndex(this.tabStopIndex - 1);
      }
    };

    SnippetExpansion.prototype.setTabStopIndex = function(tabStopIndex) {
      var i, marker, markerSelected, range, ranges, selection, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
      this.tabStopIndex = tabStopIndex;
      this.settingTabStop = true;
      markerSelected = false;
      ranges = [];
      _ref = this.tabStopMarkers[this.tabStopIndex];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        if (marker.isValid()) {
          ranges.push(marker.getBufferRange());
        }
      }
      if (ranges.length > 0) {
        _ref1 = this.selections.slice(ranges.length);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          selection = _ref1[_j];
          selection.destroy();
        }
        this.selections = this.selections.slice(0, ranges.length);
        for (i = _k = 0, _len2 = ranges.length; _k < _len2; i = ++_k) {
          range = ranges[i];
          if (this.selections[i]) {
            this.selections[i].setBufferRange(range);
          } else {
            this.selections.push(this.editor.addSelectionForBufferRange(range));
          }
        }
        markerSelected = true;
      }
      this.settingTabStop = false;
      return markerSelected;
    };

    SnippetExpansion.prototype.tabStopsForBufferPosition = function(bufferPosition) {
      return _.intersection(this.tabStopMarkers[this.tabStopIndex], this.editor.findMarkers({
        containsBufferPosition: bufferPosition
      }));
    };

    SnippetExpansion.prototype.destroy = function() {
      var marker, markers, _i, _j, _len, _len1, _ref;
      this.unsubscribe();
      _ref = this.tabStopMarkers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        markers = _ref[_i];
        for (_j = 0, _len1 = markers.length; _j < _len1; _j++) {
          marker = markers[_j];
          marker.destroy();
        }
      }
      this.tabStopMarkers = [];
      return this.snippets.clearExpansions(this.editor);
    };

    SnippetExpansion.prototype.restore = function(editor) {
      this.editor = editor;
      return this.snippets.addExpansion(this.editor, this);
    };

    return SnippetExpansion;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtCQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQyxhQUFjLE9BQUEsQ0FBUSxVQUFSLEVBQWQsVUFERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsVUFBVSxDQUFDLFdBQVgsQ0FBdUIsZ0JBQXZCLENBQUEsQ0FBQTs7QUFBQSwrQkFFQSxjQUFBLEdBQWdCLEtBRmhCLENBQUE7O0FBSWEsSUFBQSwwQkFBRSxPQUFGLEVBQVksTUFBWixFQUFxQixNQUFyQixFQUFrRCxRQUFsRCxHQUFBO0FBQ1gsVUFBQSxhQUFBO0FBQUEsTUFEWSxJQUFDLENBQUEsVUFBQSxPQUNiLENBQUE7QUFBQSxNQURzQixJQUFDLENBQUEsU0FBQSxNQUN2QixDQUFBO0FBQUEsTUFEK0IsSUFBQyxDQUFBLDBCQUFBLFNBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUEsQ0FDdkMsQ0FBQTtBQUFBLE1BRDRELElBQUMsQ0FBQSxXQUFBLFFBQzdELENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxjQUFELEdBQWtCLEVBQWxCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxVQUFELEdBQWMsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVQsQ0FEZCxDQUFBO0FBQUEsTUFHQSxhQUFBLEdBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWxCLENBQUEsQ0FBa0MsQ0FBQyxLQUhuRCxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsQ0FBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNmLGNBQUEsUUFBQTtBQUFBLFVBQUEsUUFBQSxHQUFX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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-clang/node_modules/snippets/lib/snippet-expansion.coffee