(function() {
  var $, ProjectManager, fs, workspaceElement;

  $ = require('atom-space-pen-views').$;

  ProjectManager = require('../lib/project-manager');

  workspaceElement = null;

  fs = require('fs');

  describe("ProjectManager", function() {
    ({
      activationPromise: null
    });
    describe("Toggle Project Manager", function() {
      beforeEach(function() {
        workspaceElement = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(workspaceElement);
        ProjectManager.projectManagerView = null;
        this.settingsFile = "" + __dirname + "/projects.test.cson";
        spyOn(ProjectManager, 'file').andCallFake((function(_this) {
          return function() {
            return _this.settingsFile;
          };
        })(this));
        return waitsForPromise(function() {
          return atom.packages.activatePackage('project-manager');
        });
      });
      return it("Shows the Project Viewer", function() {
        var list;
        atom.commands.dispatch(workspaceElement, 'project-manager:toggle');
        list = $(workspaceElement).find('.project-manager .list-group li');
        expect(list.length).toBe(1);
        return expect(list.first().find('.primary-line').text()).toBe('Test01');
      });
    });
    describe("Initiating Project Manager", function() {
      beforeEach(function() {
        workspaceElement = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(workspaceElement);
        this.settingsFile = "" + __dirname + "/projects.test.cson";
        spyOn(ProjectManager, 'file').andCallFake((function(_this) {
          return function() {
            return _this.settingsFile;
          };
        })(this));
        return waitsForPromise(function() {
          return atom.packages.activatePackage('project-manager');
        });
      });
      it("Makes sure projects.cson exists", function() {
        var options;
        options = {
          encoding: 'utf-8'
        };
        return fs.readFile(ProjectManager.file(), options, function(err, data) {
          return expect(err).toBe(null);
        });
      });
      return it("getCurrentPath existential operator issue is fixed", function() {
        var projects, result;
        projects = {
          test: {
            paths: atom.project.getPaths()
          }
        };
        result = ProjectManager.getCurrentProject(projects);
        expect(result).not.toBe(false);
        projects = {
          test: {}
        };
        result = ProjectManager.getCurrentProject(projects);
        return expect(result).toBe(false);
      });
    });
    return describe("Loading Settings", function() {
      beforeEach(function() {
        var CSON;
        this.settingsFile = "" + __dirname + "/projects.test.cson";
        CSON = require('season');
        CSON.readFile(this.settingsFile, (function(_this) {
          return function(error, data) {
            _this.projects = data;
            return _this.projects.Test01.paths = [__dirname];
          };
        })(this));
        ProjectManager.projectManagerView = null;
        workspaceElement = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(workspaceElement);
        spyOn(ProjectManager, 'file').andCallFake((function(_this) {
          return function() {
            return _this.settingsFile;
          };
        })(this));
        return waitsForPromise(function() {
          return atom.packages.activatePackage('project-manager');
        });
      });
      describe("without scopes", function() {
        beforeEach(function() {
          return spyOn(ProjectManager, 'getCurrentProject').andCallFake((function(_this) {
            return function() {
              return _this.projects.Test01;
            };
          })(this));
        });
        it("Overwrites existing settings", function() {
          var done;
          atom.config.setRawValue('tree-view.showOnRightSide', false);
          expect(atom.config.get('tree-view.showOnRightSide')).toBe(false);
          done = false;
          runs(function() {
            return ProjectManager.loadCurrentProject(function() {
              return done = true;
            });
          });
          waitsFor(function() {
            return done;
          });
          return runs(function() {
            return expect(atom.config.get('tree-view.showOnRightSide')).toBe(true);
          });
        });
        it("Extends existing array settings", function() {
          var done;
          atom.config.setRawValue('fuzzy-finder.ignoredNames', ['a', 'b', 'c']);
          expect(atom.config.get('fuzzy-finder.ignoredNames').length).toBe(3);
          done = false;
          runs(function() {
            return ProjectManager.loadCurrentProject(function() {
              return done = true;
            });
          });
          waitsFor(function() {
            return done;
          });
          return runs(function() {
            return expect(atom.config.get('fuzzy-finder.ignoredNames').length).toBe(6);
          });
        });
        return it("Doesn't overwrite the user's config file after loading settings", function() {
          var done;
          done = false;
          runs(function() {
            return ProjectManager.loadCurrentProject(function() {
              return done = true;
            });
          });
          waitsFor(function() {
            return done;
          });
          return runs(function() {
            return expect(atom.config.save).not.toHaveBeenCalled();
          });
        });
      });
      return describe('with scopes', function() {
        beforeEach(function() {
          return spyOn(ProjectManager, 'getCurrentProject').andCallFake((function(_this) {
            return function() {
              return _this.projects.Test02;
            };
          })(this));
        });
        it("Updates global scope", function() {
          var done;
          done = false;
          runs(function() {
            return ProjectManager.loadCurrentProject(function() {
              return done = true;
            });
          });
          waitsFor(function() {
            return done;
          });
          return runs(function() {
            return expect(atom.config.get('editor.tabLength')).toBe(2);
          });
        });
        return it("Updates a specific scope", function() {
          var done;
          done = false;
          runs(function() {
            return ProjectManager.loadCurrentProject(function() {
              return done = true;
            });
          });
          waitsFor(function() {
            return done;
          });
          return runs(function() {
            return expect(atom.config.get('editor.tabLength', {
              scope: [".source.coffee"]
            })).toBe(4);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3Byb2plY3QtbWFuYWdlci9zcGVjL3Byb2plY3QtbWFuYWdlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1Q0FBQTs7QUFBQSxFQUFDLElBQUssT0FBQSxDQUFRLHNCQUFSLEVBQUwsQ0FBRCxDQUFBOztBQUFBLEVBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsd0JBQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUVBLGdCQUFBLEdBQW1CLElBRm5CLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FITCxDQUFBOztBQUFBLEVBS0EsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUEsR0FBQTtBQUN6QixJQUFBLENBQUE7QUFBQSxNQUFBLGlCQUFBLEVBQW1CLElBQW5CO0tBQUEsQ0FBQSxDQUFBO0FBQUEsSUFFQSxRQUFBLENBQVMsd0JBQVQsRUFBbUMsU0FBQSxHQUFBO0FBRWpDLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO0FBQUEsUUFDQSxPQUFPLENBQUMsV0FBUixDQUFvQixnQkFBcEIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxjQUFjLENBQUMsa0JBQWYsR0FBb0MsSUFGcEMsQ0FBQTtBQUFBLFFBR0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsRUFBQSxHQUFHLFNBQUgsR0FBYSxxQkFIN0IsQ0FBQTtBQUFBLFFBSUEsS0FBQSxDQUFNLGNBQU4sRUFBc0IsTUFBdEIsQ0FBNkIsQ0FBQyxXQUE5QixDQUEwQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENB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

//# sourceURL=/Users/sarah/.atom/packages/project-manager/spec/project-manager-spec.coffee
