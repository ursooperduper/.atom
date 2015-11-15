(function() {
  module.exports = {
    apply: function() {
      var applyBackgroundColor, applyBackgroundGradient, applyBackgroundImage, applyEditorFont, applyFont, applyFontWeight, applyTooltipContrast, applyTreeColor, body;
      body = document.querySelector('body');
      applyFont = function(font) {
        return body.setAttribute('isotope-ui-font', font);
      };
      applyFontWeight = function(weight) {
        return body.setAttribute('isotope-ui-fontweight', weight);
      };
      applyTreeColor = function() {
        if (atom.config.get('isotope-ui.colorTreeSelection')) {
          return body.setAttribute('isotope-ui-treecolor', 'true');
        } else {
          return body.setAttribute('isotope-ui-treecolor', 'false');
        }
      };
      applyBackgroundColor = function() {
        if (atom.config.get('isotope-ui.customBackgroundColor')) {
          atom.config.set('isotope-ui.backgroundImage', 'false');
          atom.config.set('isotope-ui.backgroundGradient', 'false');
          body.setAttribute('isotope-ui-bg-color', 'true');
          return body.style.backgroundColor = atom.config.get('isotope-ui.customBackgroundColorPicker').toHexString();
        } else {
          body.setAttribute('isotope-ui-bg-color', 'false');
          return body.style.backgroundColor = '';
        }
      };
      applyBackgroundGradient = function() {
        if (atom.config.get('isotope-ui.backgroundGradient')) {
          atom.config.set('isotope-ui.backgroundImage', 'false');
          atom.config.set('isotope-ui.backgroundColor', 'false');
          return body.setAttribute('isotope-ui-bg-gradient', 'true');
        } else {
          return body.setAttribute('isotope-ui-bg-gradient', 'false');
        }
      };
      applyBackgroundImage = function() {
        if (atom.config.get('isotope-ui.backgroundImage')) {
          atom.config.set('isotope-ui.customBackgroundColor', 'false');
          atom.config.set('isotope-ui.backgroundColor', 'false');
          atom.config.set('isotope-ui.backgroundGradient', 'false');
          body.setAttribute('isotope-ui-bg-image', 'true');
          return body.style.backgroundImage = 'url(' + atom.config.get('isotope-ui.backgroundImagePath') + ')';
        } else {
          body.setAttribute('isotope-ui-bg-image', 'false');
          return body.style.backgroundImage = '';
        }
      };
      applyTooltipContrast = function() {
        if (atom.config.get('isotope-ui.lowContrastTooltip')) {
          return body.setAttribute('isotope-ui-tooltip-lowcontrast', 'true');
        } else {
          return body.setAttribute('isotope-ui-tooltip-lowcontrast', 'false');
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
      applyFont(atom.config.get('isotope-ui.fontFamily'));
      applyFontWeight(atom.config.get('isotope-ui.fontWeight'));
      applyTreeColor();
      applyBackgroundGradient();
      applyBackgroundImage();
      applyBackgroundColor();
      applyTooltipContrast();
      applyEditorFont();
      atom.config.onDidChange('isotope-ui.fontFamily', function() {
        return applyFont(atom.config.get('isotope-ui.fontFamily'));
      });
      atom.config.onDidChange('isotope-ui.fontWeight', function() {
        return applyFontWeight(atom.config.get('isotope-ui.fontWeight'));
      });
      atom.config.onDidChange('isotope-ui.colorTreeSelection', function() {
        return applyTreeColor();
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
      return atom.config.onDidChange('editor.fontFamily', function() {
        return applyEditorFont();
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLEtBQUEsRUFBTyxTQUFBLEdBQUE7QUFJTCxVQUFBLDRKQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBUCxDQUFBO0FBQUEsTUFFQSxTQUFBLEdBQVksU0FBQyxJQUFELEdBQUE7ZUFDVixJQUFJLENBQUMsWUFBTCxDQUFrQixpQkFBbEIsRUFBcUMsSUFBckMsRUFEVTtNQUFBLENBRlosQ0FBQTtBQUFBLE1BS0EsZUFBQSxHQUFrQixTQUFDLE1BQUQsR0FBQTtlQUNoQixJQUFJLENBQUMsWUFBTCxDQUFrQix1QkFBbEIsRUFBMkMsTUFBM0MsRUFEZ0I7TUFBQSxDQUxsQixDQUFBO0FBQUEsTUFRQSxjQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLFFBQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsK0JBQWhCLENBQUg7aUJBQ0UsSUFBSSxDQUFDLFlBQUwsQ0FBa0Isc0JBQWxCLEVBQTBDLE1BQTFDLEVBREY7U0FBQSxNQUFBO2lCQUdFLElBQUksQ0FBQyxZQUFMLENBQWtCLHNCQUFsQixFQUEwQyxPQUExQyxFQUhGO1NBRGU7TUFBQSxDQVJqQixDQUFBO0FBQUEsTUFjQSxvQkFBQSxHQUF1QixTQUFBLEdBQUE7QUFDckIsUUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQ0FBaEIsQ0FBSDtBQUNFLFVBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixFQUE4QyxPQUE5QyxDQUFBLENBQUE7QUFBQSxVQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwrQkFBaEIsRUFBaUQsT0FBakQsQ0FEQSxD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
//# sourceURL=/Users/sarah/.atom/packages/isotope-ui/lib/config.coffee