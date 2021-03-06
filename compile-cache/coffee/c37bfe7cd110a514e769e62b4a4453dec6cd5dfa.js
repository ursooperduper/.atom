(function() {
  var Decoration, DecorationManagement, Mixin, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Mixin = require('mixto');

  path = require('path');

  Decoration = require(path.join(atom.config.resourcePath, 'src', 'decoration'));

  module.exports = DecorationManagement = (function(_super) {
    __extends(DecorationManagement, _super);

    function DecorationManagement() {
      return DecorationManagement.__super__.constructor.apply(this, arguments);
    }


    /* Public */

    DecorationManagement.prototype.initializeDecorations = function() {
      this.decorationsById = {};
      this.decorationsByMarkerId = {};
      this.decorationMarkerChangedSubscriptions = {};
      this.decorationMarkerDestroyedSubscriptions = {};
      this.decorationUpdatedSubscriptions = {};
      return this.decorationDestroyedSubscriptions = {};
    };

    DecorationManagement.prototype.decorationForId = function(id) {
      return this.decorationsById[id];
    };

    DecorationManagement.prototype.decorationsByTypesForRow = function() {
      var array, decoration, decorations, id, out, row, types, _i, _j, _len, _ref;
      row = arguments[0], types = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), decorations = arguments[_i++];
      out = [];
      for (id in decorations) {
        array = decorations[id];
        for (_j = 0, _len = array.length; _j < _len; _j++) {
          decoration = array[_j];
          if ((_ref = decoration.getProperties().type, __indexOf.call(types, _ref) >= 0) && decoration.getMarker().getScreenRange().intersectsRow(row)) {
            out.push(decoration);
          }
        }
      }
      return out;
    };

    DecorationManagement.prototype.decorationsForScreenRowRange = function(startScreenRow, endScreenRow) {
      var decorations, decorationsByMarkerId, marker, _i, _len, _ref;
      decorationsByMarkerId = {};
      _ref = this.findMarkers({
        intersectsScreenRowRange: [startScreenRow, endScreenRow]
      });
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        if (decorations = this.decorationsByMarkerId[marker.id]) {
          decorationsByMarkerId[marker.id] = decorations;
        }
      }
      return decorationsByMarkerId;
    };

    DecorationManagement.prototype.decorateMarker = function(marker, decorationParams) {
      var cls, decoration, _base, _base1, _base2, _base3, _base4, _name, _name1, _name2, _name3, _name4;
      marker = this.getMarker(marker.id);
      if ((decorationParams.scope == null) && (decorationParams["class"] != null)) {
        cls = decorationParams["class"].split(' ').join('.');
        decorationParams.scope = ".minimap ." + cls;
      }
      if ((_base = this.decorationMarkerDestroyedSubscriptions)[_name = marker.id] == null) {
        _base[_name] = marker.onDidDestroy((function(_this) {
          return function() {
            return _this.removeAllDecorationsForMarker(marker);
          };
        })(this));
      }
      if ((_base1 = this.decorationMarkerChangedSubscriptions)[_name1 = marker.id] == null) {
        _base1[_name1] = marker.onDidChange((function(_this) {
          return function(event) {
            var decoration, decorations, _i, _len;
            decorations = _this.decorationsByMarkerId[marker.id];
            if (decorations != null) {
              for (_i = 0, _len = decorations.length; _i < _len; _i++) {
                decoration = decorations[_i];
                _this.trigger('minimap:decoration-changed', marker, decoration, event);
              }
            }
            return _this.stackRangeChanges({
              start: event.oldTailScreenPosition,
              end: event.oldHeadScreenPosition
            });
          };
        })(this));
      }
      decoration = new Decoration(marker, this, decorationParams);
      if ((_base2 = this.decorationsByMarkerId)[_name2 = marker.id] == null) {
        _base2[_name2] = [];
      }
      this.decorationsByMarkerId[marker.id].push(decoration);
      this.decorationsById[decoration.id] = decoration;
      if ((_base3 = this.decorationUpdatedSubscriptions)[_name3 = decoration.id] == null) {
        _base3[_name3] = decoration.onDidChangeProperties((function(_this) {
          return function(event) {
            return _this.stackDecorationChanges(decoration);
          };
        })(this));
      }
      if ((_base4 = this.decorationDestroyedSubscriptions)[_name4 = decoration.id] == null) {
        _base4[_name4] = decoration.onDidDestroy((function(_this) {
          return function(event) {
            return _this.removeDecoration(decoration);
          };
        })(this));
      }
      this.stackDecorationChanges(decoration);
      this.trigger('minimap:decoration-added', marker, decoration);
      return decoration;
    };

    DecorationManagement.prototype.stackDecorationChanges = function(decoration) {
      var range;
      range = decoration.marker.getScreenRange();
      if (range == null) {
        return;
      }
      return this.stackRangeChanges(range);
    };

    DecorationManagement.prototype.stackRangeChanges = function(range) {
      var changeEvent, endScreenRow, firstRenderedScreenRow, lastRenderedScreenRow, screenDelta, startScreenRow;
      startScreenRow = range.start.row;
      endScreenRow = range.end.row;
      lastRenderedScreenRow = this.getLastVisibleScreenRow();
      firstRenderedScreenRow = this.getFirstVisibleScreenRow();
      screenDelta = (lastRenderedScreenRow - firstRenderedScreenRow) - (endScreenRow - startScreenRow);
      changeEvent = {
        start: startScreenRow,
        end: endScreenRow,
        screenDelta: screenDelta
      };
      return this.stackChanges(changeEvent);
    };

    DecorationManagement.prototype.removeDecoration = function(decoration) {
      var decorations, index, marker;
      marker = decoration.marker;
      if (!(decorations = this.decorationsByMarkerId[marker.id])) {
        return;
      }
      this.stackDecorationChanges(decoration);
      this.decorationUpdatedSubscriptions[decoration.id].dispose();
      this.decorationDestroyedSubscriptions[decoration.id].dispose();
      delete this.decorationUpdatedSubscriptions[decoration.id];
      delete this.decorationDestroyedSubscriptions[decoration.id];
      index = decorations.indexOf(decoration);
      if (index > -1) {
        decorations.splice(index, 1);
        delete this.decorationsById[decoration.id];
        this.trigger('minimap:decoration-removed', marker, decoration);
        if (decorations.length === 0) {
          return this.removedAllMarkerDecorations(marker);
        }
      }
    };

    DecorationManagement.prototype.removeAllDecorationsForMarker = function(marker) {
      var decoration, decorations, _i, _len;
      decorations = this.decorationsByMarkerId[marker.id].slice();
      for (_i = 0, _len = decorations.length; _i < _len; _i++) {
        decoration = decorations[_i];
        this.trigger('minimap:decoration-removed', marker, decoration);
        this.stackDecorationChanges(decoration);
      }
      return this.removedAllMarkerDecorations(marker);
    };

    DecorationManagement.prototype.removedAllMarkerDecorations = function(marker) {
      this.decorationMarkerChangedSubscriptions[marker.id].dispose();
      this.decorationMarkerDestroyedSubscriptions[marker.id].dispose();
      delete this.decorationsByMarkerId[marker.id];
      delete this.decorationMarkerChangedSubscriptions[marker.id];
      return delete this.decorationMarkerDestroyedSubscriptions[marker.id];
    };

    DecorationManagement.prototype.decorationUpdated = function(decoration) {
      return this.trigger('minimap:decoration-updated', decoration);
    };

    return DecorationManagement;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZDQUFBO0lBQUE7Ozt5SkFBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQUFSLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBdEIsRUFBb0MsS0FBcEMsRUFBMkMsWUFBM0MsQ0FBUixDQUZiLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osMkNBQUEsQ0FBQTs7OztLQUFBOztBQUFBO0FBQUEsZ0JBQUE7O0FBQUEsbUNBR0EscUJBQUEsR0FBdUIsU0FBQSxHQUFBO0FBQ3JCLE1BQUEsSUFBQyxDQUFBLGVBQUQsR0FBbUIsRUFBbkIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLHFCQUFELEdBQXlCLEVBRHpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxvQ0FBRCxHQUF3QyxFQUZ4QyxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsc0NBQUQsR0FBMEMsRUFIMUMsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLDhCQUFELEdBQWtDLEVBSmxDLENBQUE7YUFLQSxJQUFDLENBQUEsZ0NBQUQsR0FBb0MsR0FOZjtJQUFBLENBSHZCLENBQUE7O0FBQUEsbUNBZ0JBLGVBQUEsR0FBaUIsU0FBQyxFQUFELEdBQUE7YUFDZixJQUFDLENBQUEsZUFBZ0IsQ0FBQSxFQUFBLEVBREY7SUFBQSxDQWhCakIsQ0FBQTs7QUFBQSxtQ0EyQkEsd0JBQUEsR0FBMEIsU0FBQSxHQUFBO0FBQ3hCLFVBQUEsdUVBQUE7QUFBQSxNQUR5QixvQkFBSyxzR0FBVSw2QkFDeEMsQ0FBQTtB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
//# sourceURL=/Users/sarah/.atom/packages/minimap/lib/mixins/decoration-management.coffee