(function() {
  var CompositeDisposable, EventsDelegation, Palette, PaletteElement, SpacePenDSL, StickyTitle, THEME_VARIABLES, pigments, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-utils'), SpacePenDSL = _ref.SpacePenDSL, EventsDelegation = _ref.EventsDelegation;

  THEME_VARIABLES = require('./uris').THEME_VARIABLES;

  pigments = require('./pigments');

  Palette = require('./palette');

  StickyTitle = require('./sticky-title');

  PaletteElement = (function(_super) {
    __extends(PaletteElement, _super);

    function PaletteElement() {
      return PaletteElement.__super__.constructor.apply(this, arguments);
    }

    SpacePenDSL.includeInto(PaletteElement);

    EventsDelegation.includeInto(PaletteElement);

    PaletteElement.content = function() {
      var group, merge, optAttrs, sort;
      sort = atom.config.get('pigments.sortPaletteColors');
      group = atom.config.get('pigments.groupPaletteColors');
      merge = atom.config.get('pigments.mergeColorDuplicates');
      optAttrs = function(bool, name, attrs) {
        if (bool) {
          attrs[name] = name;
        }
        return attrs;
      };
      return this.div({
        "class": 'pigments-palette-panel'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'pigments-palette-controls settings-view pane-item'
          }, function() {
            return _this.div({
              "class": 'pigments-palette-controls-wrapper'
            }, function() {
              _this.span({
                "class": 'input-group-inline'
              }, function() {
                _this.label({
                  "for": 'sort-palette-colors'
                }, 'Sort Colors');
                return _this.select({
                  outlet: 'sort',
                  id: 'sort-palette-colors'
                }, function() {
                  _this.option(optAttrs(sort === 'none', 'selected', {
                    value: 'none'
                  }), 'None');
                  _this.option(optAttrs(sort === 'by name', 'selected', {
                    value: 'by name'
                  }), 'By Name');
                  return _this.option(optAttrs(sort === 'by file', 'selected', {
                    value: 'by color'
                  }), 'By Color');
                });
              });
              _this.span({
                "class": 'input-group-inline'
              }, function() {
                _this.label({
                  "for": 'sort-palette-colors'
                }, 'Group Colors');
                return _this.select({
                  outlet: 'group',
                  id: 'group-palette-colors'
                }, function() {
                  _this.option(optAttrs(group === 'none', 'selected', {
                    value: 'none'
                  }), 'None');
                  return _this.option(optAttrs(group === 'by file', 'selected', {
                    value: 'by file'
                  }), 'By File');
                });
              });
              return _this.span({
                "class": 'input-group-inline'
              }, function() {
                _this.input(optAttrs(merge, 'checked', {
                  type: 'checkbox',
                  id: 'merge-duplicates',
                  outlet: 'merge'
                }));
                return _this.label({
                  "for": 'merge-duplicates'
                }, 'Merge Duplicates');
              });
            });
          });
          return _this.div({
            "class": 'pigments-palette-list native-key-bindings',
            tabindex: -1
          }, function() {
            return _this.ol({
              outlet: 'list'
            });
          });
        };
      })(this));
    };

    PaletteElement.prototype.createdCallback = function() {
      this.project = pigments.getProject();
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('pigments.sortPaletteColors', (function(_this) {
        return function(sortPaletteColors) {
          _this.sortPaletteColors = sortPaletteColors;
          if ((_this.palette != null) && _this.attached) {
            return _this.renderList();
          }
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.groupPaletteColors', (function(_this) {
        return function(groupPaletteColors) {
          _this.groupPaletteColors = groupPaletteColors;
          if ((_this.palette != null) && _this.attached) {
            return _this.renderList();
          }
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.mergeColorDuplicates', (function(_this) {
        return function(mergeColorDuplicates) {
          _this.mergeColorDuplicates = mergeColorDuplicates;
          if ((_this.palette != null) && _this.attached) {
            return _this.renderList();
          }
        };
      })(this)));
      this.subscriptions.add(this.subscribeTo(this.sort, {
        'change': function(e) {
          return atom.config.set('pigments.sortPaletteColors', e.target.value);
        }
      }));
      this.subscriptions.add(this.subscribeTo(this.group, {
        'change': function(e) {
          return atom.config.set('pigments.groupPaletteColors', e.target.value);
        }
      }));
      this.subscriptions.add(this.subscribeTo(this.merge, {
        'change': function(e) {
          return atom.config.set('pigments.mergeColorDuplicates', e.target.checked);
        }
      }));
      return this.subscriptions.add(this.subscribeTo(this.list, '[data-variable-id]', {
        'click': (function(_this) {
          return function(e) {
            var variable, variableId;
            variableId = Number(e.target.dataset.variableId);
            variable = _this.project.getVariableById(variableId);
            return _this.project.showVariableInFile(variable);
          };
        })(this)
      }));
    };

    PaletteElement.prototype.attachedCallback = function() {
      if (this.palette != null) {
        this.renderList();
      }
      return this.attached = true;
    };

    PaletteElement.prototype.getTitle = function() {
      return 'Palette';
    };

    PaletteElement.prototype.getURI = function() {
      return 'pigments://palette';
    };

    PaletteElement.prototype.getIconName = function() {
      return "pigments";
    };

    PaletteElement.prototype.getModel = function() {
      return this.palette;
    };

    PaletteElement.prototype.setModel = function(palette) {
      this.palette = palette;
      if (this.attached) {
        return this.renderList();
      }
    };

    PaletteElement.prototype.getColorsList = function(palette) {
      switch (this.sortPaletteColors) {
        case 'by color':
          return palette.sortedByColor();
        case 'by name':
          return palette.sortedByName();
        default:
          return palette.variables.slice();
      }
    };

    PaletteElement.prototype.renderList = function() {
      var file, li, ol, palette, palettes, _ref1;
      if ((_ref1 = this.stickyTitle) != null) {
        _ref1.dispose();
      }
      this.list.innerHTML = '';
      if (this.groupPaletteColors === 'by file') {
        palettes = this.getFilesPalettes();
        for (file in palettes) {
          palette = palettes[file];
          li = document.createElement('li');
          li.className = 'pigments-color-group';
          ol = document.createElement('ol');
          li.appendChild(this.getGroupHeader(atom.project.relativize(file)));
          li.appendChild(ol);
          this.buildList(ol, this.getColorsList(palette));
          this.list.appendChild(li);
        }
        return this.stickyTitle = new StickyTitle(this.list.querySelectorAll('.pigments-color-group-header-content'), this.querySelector('.pigments-palette-list'));
      } else {
        return this.buildList(this.list, this.getColorsList(this.palette));
      }
    };

    PaletteElement.prototype.getGroupHeader = function(label) {
      var content, header;
      header = document.createElement('div');
      header.className = 'pigments-color-group-header';
      content = document.createElement('div');
      content.className = 'pigments-color-group-header-content';
      if (label === THEME_VARIABLES) {
        content.textContent = 'Atom Themes';
      } else {
        content.textContent = label;
      }
      header.appendChild(content);
      return header;
    };

    PaletteElement.prototype.getFilesPalettes = function() {
      var palettes;
      palettes = {};
      this.palette.eachColor((function(_this) {
        return function(variable) {
          var path;
          path = variable.path;
          if (palettes[path] == null) {
            palettes[path] = new Palette([]);
          }
          return palettes[path].variables.push(variable);
        };
      })(this));
      return palettes;
    };

    PaletteElement.prototype.buildList = function(container, paletteColors) {
      var color, html, id, li, line, name, path, variables, _i, _j, _len, _len1, _ref1, _results;
      paletteColors = this.checkForDuplicates(paletteColors);
      _results = [];
      for (_i = 0, _len = paletteColors.length; _i < _len; _i++) {
        variables = paletteColors[_i];
        li = document.createElement('li');
        li.className = 'pigments-color-item';
        color = variables[0].color;
        html = "<div class=\"pigments-color\">\n  <span class=\"pigments-color-preview\"\n        style=\"background-color: " + (color.toCSS()) + "\">\n  </span>\n  <span class=\"pigments-color-properties\">\n    <span class=\"pigments-color-component\"><strong>R:</strong> " + (Math.round(color.red)) + "</span>\n    <span class=\"pigments-color-component\"><strong>G:</strong> " + (Math.round(color.green)) + "</span>\n    <span class=\"pigments-color-component\"><strong>B:</strong> " + (Math.round(color.blue)) + "</span>\n    <span class=\"pigments-color-component\"><strong>A:</strong> " + (Math.round(color.alpha * 1000) / 1000) + "</span>\n  </span>\n</div>\n<div class=\"pigments-color-details\">";
        for (_j = 0, _len1 = variables.length; _j < _len1; _j++) {
          _ref1 = variables[_j], name = _ref1.name, path = _ref1.path, line = _ref1.line, id = _ref1.id;
          html += "<span class=\"pigments-color-occurence\">\n    <span class=\"name\">" + name + "</span>";
          if (path !== THEME_VARIABLES) {
            html += "<span data-variable-id=\"" + id + "\">\n  <span class=\"path\">" + (atom.project.relativize(path)) + "</span>\n  <span class=\"line\">at line " + (line + 1) + "</span>\n</span>";
          }
          html += '</span>';
        }
        html += '</div>';
        li.innerHTML = html;
        _results.push(container.appendChild(li));
      }
      return _results;
    };

    PaletteElement.prototype.checkForDuplicates = function(paletteColors) {
      var colors, findColor, key, map, results, v, _i, _len;
      results = [];
      if (this.mergeColorDuplicates) {
        map = new Map();
        colors = [];
        findColor = function(color) {
          var col, _i, _len;
          for (_i = 0, _len = colors.length; _i < _len; _i++) {
            col = colors[_i];
            if (col.isEqual(color)) {
              return col;
            }
          }
        };
        for (_i = 0, _len = paletteColors.length; _i < _len; _i++) {
          v = paletteColors[_i];
          if (key = findColor(v.color)) {
            map.get(key).push(v);
          } else {
            map.set(v.color, [v]);
            colors.push(v.color);
          }
        }
        map.forEach(function(vars, color) {
          return results.push(vars);
        });
        return results;
      } else {
        return (function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = paletteColors.length; _j < _len1; _j++) {
            v = paletteColors[_j];
            _results.push([v]);
          }
          return _results;
        })();
      }
    };

    return PaletteElement;

  })(HTMLElement);

  module.exports = PaletteElement = document.registerElement('pigments-palette', {
    prototype: PaletteElement.prototype
  });

  PaletteElement.registerViewProvider = function(modelClass) {
    return atom.views.addViewProvider(modelClass, function(model) {
      var element;
      element = new PaletteElement;
      element.setModel(model);
      return element;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9wYWxldHRlLWVsZW1lbnQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlIQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQWtDLE9BQUEsQ0FBUSxZQUFSLENBQWxDLEVBQUMsbUJBQUEsV0FBRCxFQUFjLHdCQUFBLGdCQURkLENBQUE7O0FBQUEsRUFFQyxrQkFBbUIsT0FBQSxDQUFRLFFBQVIsRUFBbkIsZUFGRCxDQUFBOztBQUFBLEVBR0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBSFgsQ0FBQTs7QUFBQSxFQUlBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUpWLENBQUE7O0FBQUEsRUFLQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBTGQsQ0FBQTs7QUFBQSxFQU9NO0FBQ0oscUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsV0FBVyxDQUFDLFdBQVosQ0FBd0IsY0FBeEIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsY0FBN0IsQ0FEQSxDQUFBOztBQUFBLElBR0EsY0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7QUFDUixVQUFBLDRCQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQUFQLENBQUE7QUFBQSxNQUNBLEtBQUEsR0FBUSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLENBRFIsQ0FBQTtBQUFBLE1BRUEsS0FBQSxHQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwrQkFBaEIsQ0FGUixDQUFBO0FBQUEsTUFHQSxRQUFBLEdBQVcsU0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLEtBQWIsR0FBQTtBQUNULFFBQUEsSUFBc0IsSUFBdEI7QUFBQSxVQUFBLEtBQU0sQ0FBQSxJQUFBLENBQU4sR0FBYyxJQUFkLENBQUE7U0FBQTtlQUNBLE1BRlM7TUFBQSxDQUhYLENBQUE7YUFPQSxJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sd0JBQVA7T0FBTCxFQUFzQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3BDLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLG1EQUFQO1dBQUwsRUFBaUUsU0FBQSxHQUFBO21CQUMvRCxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sbUNBQVA7YUFBTCxFQUFpRCxTQUFBLEdBQUE7QUFDL0MsY0FBQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLG9CQUFQO2VBQU4sRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLGdCQUFBLEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxrQkFBQSxLQUFBLEVBQUsscUJBQUw7aUJBQVAsRUFBbUMsYUFBbkMsQ0FBQSxDQUFBO3VCQUNBLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxrQkFBQSxNQUFBLEVBQVEsTUFBUjtBQUFBLGtCQUFnQixFQUFBLEVBQUkscUJBQXBCO2lCQUFSLEVBQW1ELFNBQUEsR0FBQTtBQUNqRCxrQkFBQSxLQUFDLENBQUEsTUFBRCxDQUFRLFFBQUEsQ0FBUyxJQUFBLEtBQVEsTUFBakIsRUFBeUIsVUFBekIsRUFBcUM7QUFBQSxvQkFBQSxLQUFBLEVBQU8sTUFBUDttQkFBckMsQ0FBUixFQUE2RCxNQUE3RCxDQUFBLENBQUE7QUFBQSxrQkFDQSxLQUFDLENBQUEsTUFBRCxDQUFRLFFBQUEsQ0FBUyxJQUFBLEtBQVEsU0FBakIsRUFBNEIsVUFBNUIsRUFBd0M7QUFBQSxvQkFBQSxLQUFBLEVBQU8sU0FBUDttQkFBeEMsQ0FBUixFQUFtRSxTQUFuRSxDQURBLENBQUE7eUJBRUEsS0FBQyxDQUFBLE1BQUQsQ0FBUSxRQUFBLENBQVMsSUFBQSxLQUFRLFNBQWpCLEVBQTRCLFVBQTVCLEVBQXdDO0FBQUEsb0JBQUEsS0FBQSxFQUFPLFVBQVA7bUJBQXhDLENBQVIsRUFBb0UsVUFBcEUsRUFIaUQ7Z0JBQUEsQ0FBbkQsRUFGaUM7Y0FBQSxDQUFuQyxDQUFBLENBQUE7QUFBQSxjQU9BLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxnQkFBQSxPQUFBLEVBQU8sb0JBQVA7ZUFBTixFQUFtQyxTQUFBLEdBQUE7QUFDakMsZ0JBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTztBQUFBLGtCQUFBLEtBQUEsRUFBSyxxQkFBTDtpQkFBUCxFQUFtQyxjQUFuQyxDQUFBLENBQUE7dUJBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGtCQUFBLE1BQUEsRUFBUSxPQUFSO0FBQUEsa0JBQWlCLEVBQUEsRUFBSSxzQkFBckI7aUJBQVIsRUFBcUQsU0FBQSxHQUFBO0FBQ25ELGtCQUFBLEtBQUMsQ0FBQSxNQUFELENBQVEsUUFBQSxDQUFTLEtBQUEsS0FBUyxNQUFsQixFQUEwQixVQUExQixFQUFzQztBQUFBLG9CQUFBLEtBQUEsRUFBTyxNQUFQO21CQUF0QyxDQUFSLEVBQThELE1BQTlELENBQUEsQ0FBQTt5QkFDQSxLQUFDLENBQUEsTUFBRCxDQUFRLFFBQUEsQ0FBUyxLQUFBLEtBQVMsU0FBbEIsRUFBNkIsVUFBN0IsRUFBeUM7QUFBQSxvQkFBQSxLQUFBLEVBQU8sU0FBUDttQkFBekMsQ0FBUixFQUFvRSxTQUFwRSxFQUZtRDtnQkFBQSxDQUFyRCxFQUZpQztjQUFBLENBQW5DLENBUEEsQ0FBQTtxQkFhQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLG9CQUFQO2VBQU4sRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLGdCQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sUUFBQSxDQUFTLEtBQVQsRUFBZ0IsU0FBaEIsRUFBMkI7QUFBQSxrQkFBQSxJQUFBLEVBQU0sVUFBTjtBQUFBLGtCQUFrQixFQUFBLEVBQUksa0JBQXRCO0FBQUEsa0JBQTBDLE1BQUEsRUFBUSxPQUFsRDtpQkFBM0IsQ0FBUCxDQUFBLENBQUE7dUJBQ0EsS0FBQyxDQUFBLEtBQUQsQ0FBTztBQUFBLGtCQUFBLEtBQUEsRUFBSyxrQkFBTDtpQkFBUCxFQUFnQyxrQkFBaEMsRUFGaUM7Y0FBQSxDQUFuQyxFQWQrQztZQUFBLENBQWpELEVBRCtEO1VBQUEsQ0FBakUsQ0FBQSxDQUFBO2lCQW1CQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sMkNBQVA7QUFBQSxZQUFvRCxRQUFBLEVBQVUsQ0FBQSxDQUE5RDtXQUFMLEVBQXVFLFNBQUEsR0FBQTttQkFDckUsS0FBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLGNBQUEsTUFBQSxFQUFRLE1BQVI7YUFBSixFQURxRTtVQUFBLENBQXZFLEVBcEJvQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRDLEVBUlE7SUFBQSxDQUhWLENBQUE7O0FBQUEsNkJBa0NBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxVQUFULENBQUEsQ0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBRGpCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsNEJBQXBCLEVBQWtELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFFLGlCQUFGLEdBQUE7QUFDbkUsVUFEb0UsS0FBQyxDQUFBLG9CQUFBLGlCQUNyRSxDQUFBO0FBQUEsVUFBQSxJQUFpQix1QkFBQSxJQUFjLEtBQUMsQ0FBQSxRQUFoQzttQkFBQSxLQUFDLENBQUEsVUFBRCxDQUFBLEVBQUE7V0FEbUU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsRCxDQUFuQixDQUhBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsNkJBQXBCLEVBQW1ELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFFLGtCQUFGLEdBQUE7QUFDcEUsVUFEcUUsS0FBQyxDQUFBLHFCQUFBLGtCQUN0RSxDQUFBO0FBQUEsVUFBQSxJQUFpQix1QkFBQSxJQUFjLEtBQUMsQ0FBQSxRQUFoQzttQkFBQSxLQUFDLENBQUEsVUFBRCxDQUFBLEVBQUE7V0FEb0U7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuRCxDQUFuQixDQU5BLENBQUE7QUFBQSxNQVNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsK0JBQXBCLEVBQXFELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFFLG9CQUFGLEdBQUE7QUFDdEUsVUFEdUUsS0FBQyxDQUFBLHVCQUFBLG9CQUN4RSxDQUFBO0FBQUEsVUFBQSxJQUFpQix1QkFBQSxJQUFjLEtBQUMsQ0FBQSxRQUFoQzttQkFBQSxLQUFDLENBQUEsVUFBRCxDQUFBLEVBQUE7V0FEc0U7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyRCxDQUFuQixDQVRBLENBQUE7QUFBQSxNQVlBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxJQUFkLEVBQW9CO0FBQUEsUUFBQSxRQUFBLEVBQVUsU0FBQyxDQUFELEdBQUE7aUJBQy9DLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEIsRUFBOEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUF2RCxFQUQrQztRQUFBLENBQVY7T0FBcEIsQ0FBbkIsQ0FaQSxDQUFBO0FBQUEsTUFlQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsS0FBZCxFQUFxQjtBQUFBLFFBQUEsUUFBQSxFQUFVLFNBQUMsQ0FBRCxHQUFBO2lCQUNoRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLEVBQStDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBeEQsRUFEZ0Q7UUFBQSxDQUFWO09BQXJCLENBQW5CLENBZkEsQ0FBQTtBQUFBLE1Ba0JBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxLQUFkLEVBQXFCO0FBQUEsUUFBQSxRQUFBLEVBQVUsU0FBQyxDQUFELEdBQUE7aUJBQ2hELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwrQkFBaEIsRUFBaUQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUExRCxFQURnRDtRQUFBLENBQVY7T0FBckIsQ0FBbkIsQ0FsQkEsQ0FBQTthQXFCQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsSUFBZCxFQUFvQixvQkFBcEIsRUFBMEM7QUFBQSxRQUFBLE9BQUEsRUFBUyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQ3BFLGdCQUFBLG9CQUFBO0FBQUEsWUFBQSxVQUFBLEdBQWEsTUFBQSxDQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQXhCLENBQWIsQ0FBQTtBQUFBLFlBQ0EsUUFBQSxHQUFXLEtBQUMsQ0FBQSxPQUFPLENBQUMsZUFBVCxDQUF5QixVQUF6QixDQURYLENBQUE7bUJBR0EsS0FBQyxDQUFBLE9BQU8sQ0FBQyxrQkFBVCxDQUE0QixRQUE1QixFQUpvRTtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVQ7T0FBMUMsQ0FBbkIsRUF0QmU7SUFBQSxDQWxDakIsQ0FBQTs7QUFBQSw2QkE4REEsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBO0FBQ2hCLE1BQUEsSUFBaUIsb0JBQWpCO0FBQUEsUUFBQSxJQUFDLENBQUEsVUFBRCxDQUFBLENBQUEsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUZJO0lBQUEsQ0E5RGxCLENBQUE7O0FBQUEsNkJBa0VBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFBRyxVQUFIO0lBQUEsQ0FsRVYsQ0FBQTs7QUFBQSw2QkFvRUEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUFHLHFCQUFIO0lBQUEsQ0FwRVIsQ0FBQTs7QUFBQSw2QkFzRUEsV0FBQSxHQUFhLFNBQUEsR0FBQTthQUFHLFdBQUg7SUFBQSxDQXRFYixDQUFBOztBQUFBLDZCQXdFQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFFBQUo7SUFBQSxDQXhFVixDQUFBOztBQUFBLDZCQTBFQSxRQUFBLEdBQVUsU0FBRSxPQUFGLEdBQUE7QUFBYyxNQUFiLElBQUMsQ0FBQSxVQUFBLE9BQVksQ0FBQTtBQUFBLE1BQUEsSUFBaUIsSUFBQyxDQUFBLFFBQWxCO2VBQUEsSUFBQyxDQUFBLFVBQUQsQ0FBQSxFQUFBO09BQWQ7SUFBQSxDQTFFVixDQUFBOztBQUFBLDZCQTRFQSxhQUFBLEdBQWUsU0FBQyxPQUFELEdBQUE7QUFDYixjQUFPLElBQUMsQ0FBQSxpQkFBUjtBQUFBLGFBQ08sVUFEUDtpQkFDdUIsT0FBTyxDQUFDLGFBQVIsQ0FBQSxFQUR2QjtBQUFBLGFBRU8sU0FGUDtpQkFFc0IsT0FBTyxDQUFDLFlBQVIsQ0FBQSxFQUZ0QjtBQUFBO2lCQUdPLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBbEIsQ0FBQSxFQUhQO0FBQUEsT0FEYTtJQUFBLENBNUVmLENBQUE7O0FBQUEsNkJBa0ZBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixVQUFBLHNDQUFBOzthQUFZLENBQUUsT0FBZCxDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQixFQURsQixDQUFBO0FBR0EsTUFBQSxJQUFHLElBQUMsQ0FBQSxrQkFBRCxLQUF1QixTQUExQjtBQUNFLFFBQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxnQkFBRCxDQUFBLENBQVgsQ0FBQTtBQUNBLGFBQUEsZ0JBQUE7bUNBQUE7QUFDRSxVQUFBLEVBQUEsR0FBSyxRQUFRLENBQUMsYUFBVCxDQUF1QixJQUF2QixDQUFMLENBQUE7QUFBQSxVQUNBLEVBQUUsQ0FBQyxTQUFILEdBQWUsc0JBRGYsQ0FBQTtBQUFBLFVBRUEsRUFBQSxHQUFLLFFBQVEsQ0FBQyxhQUFULENBQXVCLElBQXZCLENBRkwsQ0FBQTtBQUFBLFVBSUEsRUFBRSxDQUFDLFdBQUgsQ0FBZSxJQUFDLENBQUEsY0FBRCxDQUFnQixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQWIsQ0FBd0IsSUFBeEIsQ0FBaEIsQ0FBZixDQUpBLENBQUE7QUFBQSxVQUtBLEVBQUUsQ0FBQyxXQUFILENBQWUsRUFBZixDQUxBLENBQUE7QUFBQSxVQU1BLElBQUMsQ0FBQSxTQUFELENBQVcsRUFBWCxFQUFlLElBQUMsQ0FBQSxhQUFELENBQWUsT0FBZixDQUFmLENBTkEsQ0FBQTtBQUFBLFVBT0EsSUFBQyxDQUFBLElBQUksQ0FBQyxXQUFOLENBQWtCLEVBQWxCLENBUEEsQ0FERjtBQUFBLFNBREE7ZUFXQSxJQUFDLENBQUEsV0FBRCxHQUFtQixJQUFBLFdBQUEsQ0FDakIsSUFBQyxDQUFBLElBQUksQ0FBQyxnQkFBTixDQUF1QixzQ0FBdkIsQ0FEaUIsRUFFakIsSUFBQyxDQUFBLGFBQUQsQ0FBZSx3QkFBZixDQUZpQixFQVpyQjtPQUFBLE1BQUE7ZUFpQkUsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsSUFBWixFQUFrQixJQUFDLENBQUEsYUFBRCxDQUFlLElBQUMsQ0FBQSxPQUFoQixDQUFsQixFQWpCRjtPQUpVO0lBQUEsQ0FsRlosQ0FBQTs7QUFBQSw2QkF5R0EsY0FBQSxHQUFnQixTQUFDLEtBQUQsR0FBQTtBQUNkLFVBQUEsZUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQVQsQ0FBQTtBQUFBLE1BQ0EsTUFBTSxDQUFDLFNBQVAsR0FBbUIsNkJBRG5CLENBQUE7QUFBQSxNQUdBLE9BQUEsR0FBVSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUhWLENBQUE7QUFBQSxNQUlBLE9BQU8sQ0FBQyxTQUFSLEdBQW9CLHFDQUpwQixDQUFBO0FBS0EsTUFBQSxJQUFHLEtBQUEsS0FBUyxlQUFaO0FBQ0UsUUFBQSxPQUFPLENBQUMsV0FBUixHQUFzQixhQUF0QixDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsT0FBTyxDQUFDLFdBQVIsR0FBc0IsS0FBdEIsQ0FIRjtPQUxBO0FBQUEsTUFVQSxNQUFNLENBQUMsV0FBUCxDQUFtQixPQUFuQixDQVZBLENBQUE7YUFXQSxPQVpjO0lBQUEsQ0F6R2hCLENBQUE7O0FBQUEsNkJBdUhBLGdCQUFBLEdBQWtCLFNBQUEsR0FBQTtBQUNoQixVQUFBLFFBQUE7QUFBQSxNQUFBLFFBQUEsR0FBVyxFQUFYLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxDQUFtQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxRQUFELEdBQUE7QUFDakIsY0FBQSxJQUFBO0FBQUEsVUFBQyxPQUFRLFNBQVIsSUFBRCxDQUFBOztZQUVBLFFBQVMsQ0FBQSxJQUFBLElBQWEsSUFBQSxPQUFBLENBQVEsRUFBUjtXQUZ0QjtpQkFHQSxRQUFTLENBQUEsSUFBQSxDQUFLLENBQUMsU0FBUyxDQUFDLElBQXpCLENBQThCLFFBQTlCLEVBSmlCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkIsQ0FGQSxDQUFBO2FBUUEsU0FUZ0I7SUFBQSxDQXZIbEIsQ0FBQTs7QUFBQSw2QkFrSUEsU0FBQSxHQUFXLFNBQUMsU0FBRCxFQUFZLGFBQVosR0FBQTtBQUNULFVBQUEsc0ZBQUE7QUFBQSxNQUFBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLGtCQUFELENBQW9CLGFBQXBCLENBQWhCLENBQUE7QUFDQTtXQUFBLG9EQUFBO3NDQUFBO0FBQ0UsUUFBQSxFQUFBLEdBQUssUUFBUSxDQUFDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBTCxDQUFBO0FBQUEsUUFDQSxFQUFFLENBQUMsU0FBSCxHQUFlLHFCQURmLENBQUE7QUFBQSxRQUVDLFFBQVMsU0FBVSxDQUFBLENBQUEsRUFBbkIsS0FGRCxDQUFBO0FBQUEsUUFHQSxJQUFBLEdBQ04sOEdBQUEsR0FFc0IsQ0FBQyxLQUFLLENBQUMsS0FBTixDQUFBLENBQUQsQ0FGdEIsR0FFcUMsaUlBRnJDLEdBS2tDLENBQUMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFLLENBQUMsR0FBakIsQ0FBRCxDQUxsQyxHQUt3RCw0RUFMeEQsR0FNNEIsQ0FBQyxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQUssQ0FBQyxLQUFqQixDQUFELENBTjVCLEdBTW9ELDRFQU5wRCxHQU9zQixDQUFDLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBSyxDQUFDLElBQWpCLENBQUQsQ0FQdEIsR0FPNkMsNEVBUDdDLEdBUWdCLENBQUMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFLLENBQUMsS0FBTixHQUFjLElBQXpCLENBQUEsR0FBaUMsSUFBbEMsQ0FSaEIsR0FRdUQsb0VBWmpELENBQUE7QUFrQkEsYUFBQSxrREFBQSxHQUFBO0FBQ0UsaUNBREcsYUFBQSxNQUFNLGFBQUEsTUFBTSxhQUFBLE1BQU0sV0FBQSxFQUNyQixDQUFBO0FBQUEsVUFBQSxJQUFBLElBQ1Isc0VBQUEsR0FDaUIsSUFEakIsR0FDc0IsU0FGZCxDQUFBO0FBS0EsVUFBQSxJQUFHLElBQUEsS0FBVSxlQUFiO0FBQ0UsWUFBQSxJQUFBLElBQ1YsMkJBQUEsR0FBMEIsRUFBMUIsR0FBNkIsOEJBQTdCLEdBQ1ksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQWIsQ0FBd0IsSUFBeEIsQ0FBRCxDQURaLEdBQzJDLDBDQUQzQyxHQUVVLENBQUMsSUFBQSxHQUFPLENBQVIsQ0FGVixHQUVvQixrQkFIVixDQURGO1dBTEE7QUFBQSxVQWFBLElBQUEsSUFBUSxTQWJSLENBREY7QUFBQSxTQWxCQTtBQUFBLFFBa0NBLElBQUEsSUFBUSxRQWxDUixDQUFBO0FBQUEsUUFvQ0EsRUFBRSxDQUFDLFNBQUgsR0FBZSxJQXBDZixDQUFBO0FBQUEsc0JBc0NBLFNBQVMsQ0FBQyxXQUFWLENBQXNCLEVBQXRCLEVBdENBLENBREY7QUFBQTtzQkFGUztJQUFBLENBbElYLENBQUE7O0FBQUEsNkJBNktBLGtCQUFBLEdBQW9CLFNBQUMsYUFBRCxHQUFBO0FBQ2xCLFVBQUEsaURBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxFQUFWLENBQUE7QUFDQSxNQUFBLElBQUcsSUFBQyxDQUFBLG9CQUFKO0FBQ0UsUUFBQSxHQUFBLEdBQVUsSUFBQSxHQUFBLENBQUEsQ0FBVixDQUFBO0FBQUEsUUFFQSxNQUFBLEdBQVMsRUFGVCxDQUFBO0FBQUEsUUFJQSxTQUFBLEdBQVksU0FBQyxLQUFELEdBQUE7QUFDVixjQUFBLGFBQUE7QUFBQSxlQUFBLDZDQUFBOzZCQUFBO2dCQUFrQyxHQUFHLENBQUMsT0FBSixDQUFZLEtBQVo7QUFBbEMscUJBQU8sR0FBUDthQUFBO0FBQUEsV0FEVTtRQUFBLENBSlosQ0FBQTtBQU9BLGFBQUEsb0RBQUE7Z0NBQUE7QUFDRSxVQUFBLElBQUcsR0FBQSxHQUFNLFNBQUEsQ0FBVSxDQUFDLENBQUMsS0FBWixDQUFUO0FBQ0UsWUFBQSxHQUFHLENBQUMsR0FBSixDQUFRLEdBQVIsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsQ0FBbEIsQ0FBQSxDQURGO1dBQUEsTUFBQTtBQUdFLFlBQUEsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLENBQUMsS0FBVixFQUFpQixDQUFDLENBQUQsQ0FBakIsQ0FBQSxDQUFBO0FBQUEsWUFDQSxNQUFNLENBQUMsSUFBUCxDQUFZLENBQUMsQ0FBQyxLQUFkLENBREEsQ0FIRjtXQURGO0FBQUEsU0FQQTtBQUFBLFFBY0EsR0FBRyxDQUFDLE9BQUosQ0FBWSxTQUFDLElBQUQsRUFBTyxLQUFQLEdBQUE7aUJBQWlCLE9BQU8sQ0FBQyxJQUFSLENBQWEsSUFBYixFQUFqQjtRQUFBLENBQVosQ0FkQSxDQUFBO0FBZ0JBLGVBQU8sT0FBUCxDQWpCRjtPQUFBLE1BQUE7QUFtQkU7O0FBQVE7ZUFBQSxzREFBQTtrQ0FBQTtBQUFBLDBCQUFBLENBQUMsQ0FBRCxFQUFBLENBQUE7QUFBQTs7WUFBUixDQW5CRjtPQUZrQjtJQUFBLENBN0twQixDQUFBOzswQkFBQTs7S0FEMkIsWUFQN0IsQ0FBQTs7QUFBQSxFQTZNQSxNQUFNLENBQUMsT0FBUCxHQUFpQixjQUFBLEdBQ2pCLFFBQVEsQ0FBQyxlQUFULENBQXlCLGtCQUF6QixFQUE2QztBQUFBLElBQzNDLFNBQUEsRUFBVyxjQUFjLENBQUMsU0FEaUI7R0FBN0MsQ0E5TUEsQ0FBQTs7QUFBQSxFQWtOQSxjQUFjLENBQUMsb0JBQWYsR0FBc0MsU0FBQyxVQUFELEdBQUE7V0FDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFYLENBQTJCLFVBQTNCLEVBQXVDLFNBQUMsS0FBRCxHQUFBO0FBQ3JDLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLEdBQUEsQ0FBQSxjQUFWLENBQUE7QUFBQSxNQUNBLE9BQU8sQ0FBQyxRQUFSLENBQWlCLEtBQWpCLENBREEsQ0FBQTthQUVBLFFBSHFDO0lBQUEsQ0FBdkMsRUFEb0M7RUFBQSxDQWxOdEMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/sarah/.atom/packages/pigments/lib/palette-element.coffee
