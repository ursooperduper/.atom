(function() {
  var ColorMarker, CompositeDisposable, fill;

  CompositeDisposable = require('atom').CompositeDisposable;

  fill = require('./utils').fill;

  module.exports = ColorMarker = (function() {
    function ColorMarker(_arg) {
      this.marker = _arg.marker, this.color = _arg.color, this.text = _arg.text, this.invalid = _arg.invalid, this.colorBuffer = _arg.colorBuffer;
      this.id = this.marker.id;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.marker.onDidDestroy((function(_this) {
        return function() {
          return _this.markerWasDestroyed();
        };
      })(this)));
      this.subscriptions.add(this.marker.onDidChange((function(_this) {
        return function() {
          if (_this.marker.isValid()) {
            _this.invalidateScreenRangeCache();
            return _this.checkMarkerScope();
          } else {
            return _this.destroy();
          }
        };
      })(this)));
      this.checkMarkerScope();
    }

    ColorMarker.prototype.destroy = function() {
      if (this.destroyed) {
        return;
      }
      return this.marker.destroy();
    };

    ColorMarker.prototype.markerWasDestroyed = function() {
      var _ref;
      if (this.destroyed) {
        return;
      }
      this.subscriptions.dispose();
      _ref = {}, this.marker = _ref.marker, this.color = _ref.color, this.text = _ref.text, this.colorBuffer = _ref.colorBuffer;
      return this.destroyed = true;
    };

    ColorMarker.prototype.match = function(properties) {
      var bool;
      if (this.destroyed) {
        return false;
      }
      bool = true;
      if (properties.bufferRange != null) {
        bool && (bool = this.marker.getBufferRange().isEqual(properties.bufferRange));
      }
      if (properties.color != null) {
        bool && (bool = properties.color.isEqual(this.color));
      }
      if (properties.match != null) {
        bool && (bool = properties.match === this.text);
      }
      if (properties.text != null) {
        bool && (bool = properties.text === this.text);
      }
      return bool;
    };

    ColorMarker.prototype.serialize = function() {
      var out;
      if (this.destroyed) {
        return;
      }
      out = {
        markerId: String(this.marker.id),
        bufferRange: this.marker.getBufferRange().serialize(),
        color: this.color.serialize(),
        text: this.text,
        variables: this.color.variables
      };
      if (!this.color.isValid()) {
        out.invalid = true;
      }
      return out;
    };

    ColorMarker.prototype.checkMarkerScope = function(forceEvaluation) {
      var e, range, scope, scopeChain;
      if (forceEvaluation == null) {
        forceEvaluation = false;
      }
      if (this.destroyed || (this.colorBuffer == null)) {
        return;
      }
      range = this.marker.getBufferRange();
      try {
        scope = this.marker.displayBuffer.scopeDescriptorForBufferPosition(range.start);
        scopeChain = scope.getScopeChain();
        if (!scopeChain || (!forceEvaluation && scopeChain === this.lastScopeChain)) {
          return;
        }
        this.ignored = this.colorBuffer.ignoredScopes.some(function(scopeRegExp) {
          return scopeChain.match(scopeRegExp);
        });
        return this.lastScopeChain = scopeChain;
      } catch (_error) {
        e = _error;
        return console.error(e);
      }
    };

    ColorMarker.prototype.isIgnored = function() {
      return this.ignored;
    };

    ColorMarker.prototype.getScreenRange = function() {
      return this.screenRangeCache != null ? this.screenRangeCache : this.screenRangeCache = this.marker.getScreenRange();
    };

    ColorMarker.prototype.invalidateScreenRangeCache = function() {
      return this.screenRangeCache = null;
    };

    ColorMarker.prototype.convertContentToHex = function() {
      var hex;
      hex = '#' + fill(this.color.hex, 6);
      return this.marker.displayBuffer.buffer.setTextInRange(this.marker.getBufferRange(), hex);
    };

    ColorMarker.prototype.convertContentToRGB = function() {
      var rgba;
      rgba = "rgb(" + (Math.round(this.color.red)) + ", " + (Math.round(this.color.green)) + ", " + (Math.round(this.color.blue)) + ")";
      return this.marker.displayBuffer.buffer.setTextInRange(this.marker.getBufferRange(), rgba);
    };

    ColorMarker.prototype.convertContentToRGBA = function() {
      var rgba;
      rgba = "rgba(" + (Math.round(this.color.red)) + ", " + (Math.round(this.color.green)) + ", " + (Math.round(this.color.blue)) + ", " + this.color.alpha + ")";
      return this.marker.displayBuffer.buffer.setTextInRange(this.marker.getBufferRange(), rgba);
    };

    return ColorMarker;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9jb2xvci1tYXJrZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNDQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxTQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEscUJBQUMsSUFBRCxHQUFBO0FBQ1gsTUFEYSxJQUFDLENBQUEsY0FBQSxRQUFRLElBQUMsQ0FBQSxhQUFBLE9BQU8sSUFBQyxDQUFBLFlBQUEsTUFBTSxJQUFDLENBQUEsZUFBQSxTQUFTLElBQUMsQ0FBQSxtQkFBQSxXQUNoRCxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsRUFBRCxHQUFNLElBQUMsQ0FBQSxNQUFNLENBQUMsRUFBZCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBRGpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsa0JBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckIsQ0FBbkIsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQW9CLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDckMsVUFBQSxJQUFHLEtBQUMsQ0FB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

//# sourceURL=/Users/sarah/.atom/packages/pigments/lib/color-marker.coffee
