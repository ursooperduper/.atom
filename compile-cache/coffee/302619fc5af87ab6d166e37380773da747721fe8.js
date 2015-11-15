(function() {
  module.exports = {
    apply: function() {
      var applyBackgroundGradient, applyBackgroundImage, applyEditorFont, applyFont, applyFontWeight, applyMinimalMode, applySpaciousMode, applyTooltipContrast, body;
      body = document.querySelector('body');
      applyFont = function(font) {
        return body.setAttribute('data-isotope-light-ui-font', font);
      };
      applyFontWeight = function(weight) {
        return body.setAttribute('data-isotope-light-ui-fontweight', weight);
      };
      applyBackgroundGradient = function() {
        if (atom.config.get('isotope-light-ui.backgroundGradient')) {
          body.setAttribute('data-isotope-light-ui-bg-gradient', 'true');
          return atom.config.set('isotope-light-ui.backgroundImage', 'false');
        } else {
          return body.setAttribute('data-isotope-light-ui-bg-gradient', 'false');
        }
      };
      applyBackgroundImage = function() {
        if (atom.config.get('isotope-light-ui.backgroundImage')) {
          atom.config.set('isotope-light-ui.customBackgroundColor', 'false');
          atom.config.set('isotope-light-ui.backgroundGradient', 'false');
          body.setAttribute('data-isotope-light-ui-bg-image', 'true');
          return body.style.backgroundImage = 'url(' + atom.config.get('isotope-light-ui.backgroundImagePath') + ')';
        } else {
          body.setAttribute('data-isotope-light-ui-bg-image', 'false');
          return body.style.backgroundImage = '';
        }
      };
      applyTooltipContrast = function() {
        if (atom.config.get('isotope-light-ui.lowContrastTooltip')) {
          return body.setAttribute('data-isotope-light-ui-tooltip-lowcontrast', 'true');
        } else {
          return body.setAttribute('data-isotope-light-ui-tooltip-lowcontrast', 'false');
        }
      };
      applyEditorFont = function() {
        if (atom.config.get('isotope-light-ui.matchEditorFont')) {
          if (atom.config.get('editor.fontFamily') === '') {
            return body.style.fontFamily = 'Inconsolata, Monaco, Consolas, "Courier New", Courier';
          } else {
            return body.style.fontFamily = atom.config.get('editor.fontFamily');
          }
        } else {
          return body.style.fontFamily = '';
        }
      };
      applySpaciousMode = function() {
        if (atom.config.get('isotope-light-ui.spaciousMode')) {
          atom.config.set('isotope-light-ui.minimalMode', 'false');
          return body.setAttribute('data-isotope-light-ui-spacious', 'true');
        } else {
          return body.setAttribute('data-isotope-light-ui-spacious', 'false');
        }
      };
      applyMinimalMode = function() {
        if (atom.config.get('isotope-light-ui.minimalMode')) {
          atom.config.set('isotope-light-ui.spaciousMode', 'false');
          return body.setAttribute('data-isotope-light-ui-minimal', 'true');
        } else {
          return body.setAttribute('data-isotope-light-ui-minimal', 'false');
        }
      };
      applyFont(atom.config.get('isotope-light-ui.fontFamily'));
      applyFontWeight(atom.config.get('isotope-light-ui.fontWeight'));
      applyBackgroundGradient();
      applyBackgroundImage();
      applyTooltipContrast();
      applyEditorFont();
      applySpaciousMode();
      applyMinimalMode();
      atom.config.onDidChange('isotope-light-ui.fontFamily', function() {
        return applyFont(atom.config.get('isotope-light-ui.fontFamily'));
      });
      atom.config.onDidChange('isotope-light-ui.fontWeight', function() {
        return applyFontWeight(atom.config.get('isotope-light-ui.fontWeight'));
      });
      atom.config.onDidChange('isotope-light-ui.backgroundGradient', function() {
        return applyBackgroundGradient();
      });
      atom.config.onDidChange('isotope-light-ui.backgroundImage', function() {
        return applyBackgroundImage();
      });
      atom.config.onDidChange('isotope-light-ui.backgroundImagePath', function() {
        return applyBackgroundImage();
      });
      atom.config.onDidChange('isotope-light-ui.lowContrastTooltip', function() {
        return applyTooltipContrast();
      });
      atom.config.onDidChange('isotope-light-ui.matchEditorFont', function() {
        return applyEditorFont();
      });
      atom.config.onDidChange('isotope-light-ui.spaciousMode', function() {
        return applySpaciousMode();
      });
      atom.config.onDidChange('isotope-light-ui.minimalMode', function() {
        return applyMinimalMode();
      });
      return atom.config.onDidChange('editor.fontFamily', function() {
        return applyEditorFont();
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2lzb3RvcGUtbGlnaHQtdWkvbGliL2NvbmZpZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsS0FBQSxFQUFPLFNBQUEsR0FBQTtBQUVMLFVBQUEsMkpBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QixDQUFQLENBQUE7QUFBQSxNQUtBLFNBQUEsR0FBWSxTQUFDLElBQUQsR0FBQTtlQUNWLElBQUksQ0FBQyxZQUFMLENBQWtCLDRCQUFsQixFQUFnRCxJQUFoRCxFQURVO01BQUEsQ0FMWixDQUFBO0FBQUEsTUFRQSxlQUFBLEdBQWtCLFNBQUMsTUFBRCxHQUFBO2VBQ2hCLElBQUksQ0FBQyxZQUFMLENBQWtCLGtDQUFsQixFQUFzRCxNQUF0RCxFQURnQjtNQUFBLENBUmxCLENBQUE7QUFBQSxNQVdBLHVCQUFBLEdBQTBCLFNBQUEsR0FBQTtBQUN4QixRQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFDQUFoQixDQUFIO0FBQ0UsVUFBQSxJQUFJLENBQUMsWUFBTCxDQUFrQixtQ0FBbEIsRUFBdUQsTUFBdkQsQ0FBQSxDQUFBO2lCQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQ0FBaEIsRUFBb0QsT0FBcEQsRUFGRjtTQUFBLE1BQUE7aUJBSUUsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsbUNBQWxCLEVBQXVELE9BQXZELEVBSkY7U0FEd0I7TUFBQSxDQVgxQixDQUFBO0FBQUEsTUFrQkEsb0JBQUEsR0FBdUIsU0FBQSxHQUFBO0FBQ3JCLFFBQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0NBQWhCLENBQUg7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

//# sourceURL=/Users/sarah/.atom/packages/isotope-light-ui/lib/config.coffee
