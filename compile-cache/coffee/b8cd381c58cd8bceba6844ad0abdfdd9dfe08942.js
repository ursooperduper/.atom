(function() {
  module.exports = {
    apply: function() {
      var applyBackgroundColor, applyBackgroundGradient, applyBackgroundImage, applyEditorFont, applyFont, applyFontWeight, applyMinimalMode, applyTooltipContrast, body;
      body = document.querySelector('body');
      applyFont = function(font) {
        return body.setAttribute('data-isotope-ui-font', font);
      };
      applyFontWeight = function(weight) {
        return body.setAttribute('data-isotope-ui-fontweight', weight);
      };
      applyBackgroundColor = function() {
        if (atom.config.get('isotope-ui.customBackgroundColor')) {
          atom.config.set('isotope-ui.backgroundImage', 'false');
          atom.config.set('isotope-ui.backgroundGradient', 'false');
          body.setAttribute('data-isotope-ui-bg-color', 'true');
          return body.style.backgroundColor = atom.config.get('isotope-ui.customBackgroundColorPicker').toHexString();
        } else {
          body.setAttribute('data-isotope-ui-bg-color', 'false');
          return body.style.backgroundColor = '';
        }
      };
      applyBackgroundGradient = function() {
        if (atom.config.get('isotope-ui.backgroundGradient')) {
          atom.config.set('isotope-ui.backgroundImage', 'false');
          atom.config.set('isotope-ui.customBackgroundColor', 'false');
          return body.setAttribute('data-isotope-ui-bg-gradient', 'true');
        } else {
          return body.setAttribute('data-isotope-ui-bg-gradient', 'false');
        }
      };
      applyBackgroundImage = function() {
        if (atom.config.get('isotope-ui.backgroundImage')) {
          atom.config.set('isotope-ui.customBackgroundColor', 'false');
          atom.config.set('isotope-ui.customBackgroundColor', 'false');
          atom.config.set('isotope-ui.backgroundGradient', 'false');
          body.setAttribute('data-isotope-ui-bg-image', 'true');
          return body.style.backgroundImage = 'url(' + atom.config.get('isotope-ui.backgroundImagePath') + ')';
        } else {
          body.setAttribute('data-isotope-ui-bg-image', 'false');
          return body.style.backgroundImage = '';
        }
      };
      applyTooltipContrast = function() {
        if (atom.config.get('isotope-ui.lowContrastTooltip')) {
          return body.setAttribute('data-isotope-ui-tooltip-lowcontrast', 'true');
        } else {
          return body.setAttribute('data-isotope-ui-tooltip-lowcontrast', 'false');
        }
      };
      applyEditorFont = function() {
        if (atom.config.get('isotope-ui.matchEditorFont')) {
          if (atom.config.get('editor.fontFamily') === '') {
            return body.style.fontFamily = 'Inconsolata, Monaco, Consolas, "Courier New", Courier';
          } else {
            return body.style.fontFamily = atom.config.get('editor.fontFamily');
          }
        } else {
          return body.style.fontFamily = '';
        }
      };
      applyMinimalMode = function() {
        if (atom.config.get('isotope-ui.minimalMode')) {
          return body.setAttribute('data-isotope-ui-minimal', 'true');
        } else {
          return body.setAttribute('data-isotope-ui-minimal', 'false');
        }
      };
      applyFont(atom.config.get('isotope-ui.fontFamily'));
      applyFontWeight(atom.config.get('isotope-ui.fontWeight'));
      applyBackgroundGradient();
      applyBackgroundImage();
      applyBackgroundColor();
      applyTooltipContrast();
      applyEditorFont();
      applyMinimalMode();
      atom.config.onDidChange('isotope-ui.fontFamily', function() {
        return applyFont(atom.config.get('isotope-ui.fontFamily'));
      });
      atom.config.onDidChange('isotope-ui.fontWeight', function() {
        return applyFontWeight(atom.config.get('isotope-ui.fontWeight'));
      });
      atom.config.onDidChange('isotope-ui.customBackgroundColor', function() {
        return applyBackgroundColor();
      });
      atom.config.onDidChange('isotope-ui.customBackgroundColorPicker', function() {
        return applyBackgroundColor();
      });
      atom.config.onDidChange('isotope-ui.backgroundGradient', function() {
        return applyBackgroundGradient();
      });
      atom.config.onDidChange('isotope-ui.backgroundImage', function() {
        return applyBackgroundImage();
      });
      atom.config.onDidChange('isotope-ui.backgroundImagePath', function() {
        return applyBackgroundImage();
      });
      atom.config.onDidChange('isotope-ui.lowContrastTooltip', function() {
        return applyTooltipContrast();
      });
      atom.config.onDidChange('isotope-ui.matchEditorFont', function() {
        return applyEditorFont();
      });
      atom.config.onDidChange('isotope-ui.minimalMode', function() {
        return applyMinimalMode();
      });
      return atom.config.onDidChange('editor.fontFamily', function() {
        return applyEditorFont();
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2lzb3RvcGUtdWkvbGliL2NvbmZpZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsS0FBQSxFQUFPLFNBQUEsR0FBQTtBQUVMLFVBQUEsOEpBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QixDQUFQLENBQUE7QUFBQSxNQUtBLFNBQUEsR0FBWSxTQUFDLElBQUQsR0FBQTtlQUNWLElBQUksQ0FBQyxZQUFMLENBQWtCLHNCQUFsQixFQUEwQyxJQUExQyxFQURVO01BQUEsQ0FMWixDQUFBO0FBQUEsTUFRQSxlQUFBLEdBQWtCLFNBQUMsTUFBRCxHQUFBO2VBQ2hCLElBQUksQ0FBQyxZQUFMLENBQWtCLDRCQUFsQixFQUFnRCxNQUFoRCxFQURnQjtNQUFBLENBUmxCLENBQUE7QUFBQSxNQVdBLG9CQUFBLEdBQXVCLFNBQUEsR0FBQTtBQUNyQixRQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtDQUFoQixDQUFIO0FBQ0UsVUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLEVBQThDLE9BQTlDLENBQUEsQ0FBQTtBQUFBLFVBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLCtCQUFoQixFQUFpRCxPQUFqRCxDQURBLENBQUE7QUFBQSxVQUVBLElBQUksQ0FBQyxZQUFMLENBQWtCLDBCQUFsQixFQUE4QyxNQUE5QyxDQUZBLENBQUE7aUJBR0EsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFYLEdBQTZCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3Q0FBaEIsQ0FBeUQsQ0FBQyxXQUExRCxDQUFBLEVBSi9C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

//# sourceURL=/Users/sarah/.atom/packages/isotope-ui/lib/config.coffee
