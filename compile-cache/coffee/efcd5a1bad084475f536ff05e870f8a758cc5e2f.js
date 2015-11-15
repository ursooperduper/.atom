(function() {
  module.exports = {
    apply: function() {
      var applyBackgroundGradient, applyBackgroundImage, applyEditorFont, applyFont, applyFontWeight, applySpaciousMode, applyTooltipContrast, body;
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
        if (atom.config.get('isotope-ui.spaciousMode')) {
          return body.setAttribute('data-isotope-ui-spacious', 'true');
        } else {
          return body.setAttribute('data-isotope-ui-spacious', 'false');
        }
      };
      applyFont(atom.config.get('isotope-light-ui.fontFamily'));
      applyFontWeight(atom.config.get('isotope-light-ui.fontWeight'));
      applyBackgroundGradient();
      applyBackgroundImage();
      applyTooltipContrast();
      applyEditorFont();
      applySpaciousMode();
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
      atom.config.onDidChange('isotope-ui.spaciousMode', function() {
        return applySpaciousMode();
      });
      return atom.config.onDidChange('editor.fontFamily', function() {
        return applyEditorFont();
      });
    }
  };

}).call(this);
