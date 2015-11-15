(function() {
  var Settings;

  Settings = require('../lib/settings.coffee');

  describe("Settings", function() {
    describe(".load(settings)", function() {
      return it("Loads the settings provided", function() {
        var settings;
        settings = new Settings();
        settings.load({
          "foo.bar.baz": 42
        });
        return expect(atom.config.get("foo.bar.baz")).toBe(42);
      });
    });
    return describe(".load(settings) with a 'scope' option", function() {
      return it("Loads the settings for the scope", function() {
        var scopedSettings, settings;
        settings = new Settings();
        scopedSettings = {
          "*": {
            "foo.bar.baz": 42
          },
          ".source.coffee": {
            "foo.bar.baz": 84
          }
        };
        settings.load(scopedSettings);
        expect(atom.config.get("foo.bar.baz")).toBe(42);
        expect(atom.config.get("foo.bar.baz", {
          scope: [".source.coffee"]
        })).toBe(84);
        return expect(atom.config.get("foo.bar.baz", {
          scope: [".text"]
        })).toBe(42);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9zcGVjL3NldHRpbmdzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLHdCQUFSLENBQVgsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUVuQixJQUFBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBLEdBQUE7YUFDMUIsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxZQUFBLFFBQUE7QUFBQSxRQUFBLFFBQUEsR0FBZSxJQUFBLFFBQUEsQ0FBQSxDQUFmLENBQUE7QUFBQSxRQUNBLFFBQVEsQ0FBQyxJQUFULENBQWM7QUFBQSxVQUFDLGFBQUEsRUFBZSxFQUFoQjtTQUFkLENBREEsQ0FBQTtlQUdBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsYUFBaEIsQ0FBUCxDQUFzQyxDQUFDLElBQXZDLENBQTRDLEVBQTVDLEVBSmdDO01BQUEsQ0FBbEMsRUFEMEI7SUFBQSxDQUE1QixDQUFBLENBQUE7V0FPQSxRQUFBLENBQVMsdUNBQVQsRUFBa0QsU0FBQSxHQUFBO2FBQ2hELEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBLEdBQUE7QUFDckMsWUFBQSx3QkFBQTtBQUFBLFFBQUEsUUFBQSxHQUFlLElBQUEsUUFBQSxDQUFBLENBQWYsQ0FBQTtBQUFBLFFBQ0EsY0FBQSxHQUNFO0FBQUEsVUFBQSxHQUFBLEVBQ0U7QUFBQSxZQUFBLGFBQUEsRUFBZSxFQUFmO1dBREY7QUFBQSxVQUVBLGdCQUFBLEVBQ0U7QUFBQSxZQUFBLGFBQUEsRUFBZSxFQUFmO1dBSEY7U0FGRixDQUFBO0FBQUEsUUFNQSxRQUFRLENBQUMsSUFBVCxDQUFjLGNBQWQsQ0FOQSxDQUFBO0FBQUEsUUFRQSxNQUFBLENBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGFBQWhCLENBQVAsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxFQUE1QyxDQVJBLENBQUE7QUFBQSxRQVNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsYUFBaEIsRUFBK0I7QUFBQSxVQUFDLEtBQUEsRUFBTSxDQUFDLGdCQUFELENBQVA7U0FBL0IsQ0FBUCxDQUFrRSxDQUFDLElBQW5FLENBQXdFLEVBQXhFLENBVEEsQ0FBQTtlQVVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsYUFBaEIsRUFBK0I7QUFBQSxVQUFDLEtBQUEsRUFBTSxDQUFDLE9BQUQsQ0FBUDtTQUEvQixDQUFQLENBQXlELENBQUMsSUFBMUQsQ0FBK0QsRUFBL0QsRUFYcUM7TUFBQSxDQUF2QyxFQURnRDtJQUFBLENBQWxELEVBVG1CO0VBQUEsQ0FBckIsQ0FGQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/sarah/.atom/packages/project-manager/spec/settings-spec.coffee
