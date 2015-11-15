(function() {
  var FRONT_MATTER_REGEX, FrontMatter, os, yaml;

  os = require("os");

  yaml = require("js-yaml");

  FRONT_MATTER_REGEX = /^(?:---\s*$)?([^:]+:[\s\S]*?)^---\s*$/m;

  module.exports = FrontMatter = (function() {
    function FrontMatter(editor) {
      this.editor = editor;
      this.content = {};
      this.leadingFence = true;
      this.isEmpty = true;
      this.parseError = null;
      this._findFrontMatter((function(_this) {
        return function(match) {
          var error;
          try {
            _this.content = yaml.safeLoad(match.match[1].trim());
            _this.leadingFence = match.matchText.startsWith("---");
            return _this.isEmpty = false;
          } catch (_error) {
            error = _error;
            _this.parseError = error;
            return atom.confirm({
              message: "[Markdown Writer] Error!",
              detailedMessage: "Invalid Front Matter:\n" + error.message,
              buttons: ['OK']
            });
          }
        };
      })(this));
    }

    FrontMatter.prototype._findFrontMatter = function(onMatch) {
      return this.editor.buffer.scan(FRONT_MATTER_REGEX, onMatch);
    };

    FrontMatter.prototype.normalizeField = function(field) {
      if (!this.content[field]) {
        return this.content[field] = [];
      } else if (typeof this.content[field] === "string") {
        return this.content[field] = [this.content[field]];
      } else {
        return this.content[field];
      }
    };

    FrontMatter.prototype.has = function(field) {
      return this.content[field] != null;
    };

    FrontMatter.prototype.get = function(field) {
      return this.content[field];
    };

    FrontMatter.prototype.set = function(field, content) {
      return this.content[field] = content;
    };

    FrontMatter.prototype.setIfExists = function(field, content) {
      if (this.has(field)) {
        return this.content[field] = content;
      }
    };

    FrontMatter.prototype.getContentText = function() {
      var text;
      text = yaml.safeDump(this.content);
      if (this.leadingFence) {
        return ["---", "" + text + "---", ""].join(os.EOL);
      } else {
        return ["" + text + "---", ""].join(os.EOL);
      }
    };

    FrontMatter.prototype.save = function() {
      return this._findFrontMatter((function(_this) {
        return function(match) {
          return match.replace(_this.getContentText());
        };
      })(this));
    };

    return FrontMatter;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvaGVscGVycy9mcm9udC1tYXR0ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlDQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsU0FBUixDQURQLENBQUE7O0FBQUEsRUFHQSxrQkFBQSxHQUFxQix3Q0FIckIsQ0FBQTs7QUFBQSxFQVlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHFCQUFDLE1BQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxNQUFWLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFEWCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsWUFBRCxHQUFnQixJQUZoQixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBSFgsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUpkLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7QUFDaEIsY0FBQSxLQUFBO0FBQUE7QUFDRSxZQUFBLEtBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSSxDQUFDLFFBQUwsQ0FBYyxLQUFLLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQWYsQ0FBQSxDQUFkLENBQVgsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLFlBQUQsR0FBZ0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFoQixDQUEyQixLQUEzQixDQURoQixDQUFBO21CQUVBLEtBQUMsQ0FBQSxPQUFELEdBQVcs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

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/lib/helpers/front-matter.coffee
