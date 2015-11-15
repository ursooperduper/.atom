(function() {
  module.exports = {
    config: {
      fontFamily: {
        description: 'Use one of the fonts available in this package. View the README for descriptions of each.',
        type: 'string',
        "default": 'Open Sans',
        "enum": ['Cantarell', 'Clear Sans', 'Fira Sans', 'Open Sans', 'Oxygen', 'Roboto', 'Source Sans Pro', 'Ubuntu', 'System Default']
      },
      fontWeight: {
        description: 'Not all fonts come in all weights: Canterell and Oxygen only have regular, Ubuntu and Open Sans don\'t have thin.',
        type: 'string',
        "default": 'Light',
        "enum": ['Extra light / Thin', 'Light', 'Regular']
      },
      compactLayout: {
        description: 'Make UI chrome take up less space vertically (useful on small screens).',
        type: 'boolean',
        "default": false
      },
      customBackgroundColor: {
        description: 'Choose a custom background color.',
        type: 'boolean',
        "default": false
      },
      customBackgroundColorPicker: {
        description: 'Choose your background color.',
        type: 'color',
        "default": 'white'
      },
      backgroundGradient: {
        description: 'Apply a subtle gradient to the background.',
        type: 'boolean',
        "default": false
      },
      backgroundImage: {
        description: 'Use an image as a background.',
        type: 'boolean',
        "default": false
      },
      backgroundImagePath: {
        description: 'The path to an image from your computer or the internets (e.g. hubblesite.org or unsplash.com).',
        type: 'string',
        "default": 'atom://isotope-light-ui/resources/images/raket.jpg'
      },
      gutterStyle: {
        description: 'Turn off to relegate gutter styling to syntax theme.',
        type: 'boolean',
        "default": true
      },
      lowContrastTooltip: {
        description: 'Make tooltips low contrast and not so colorful.',
        type: 'boolean',
        "default": false
      },
      matchEditorFont: {
        description: 'Match the font family you set for the editor.',
        type: 'boolean',
        "default": false
      }
    },
    activate: function(state) {
      return atom.themes.onDidChangeActiveThemes(function() {
        var Config;
        Config = require('./config');
        return Config.apply();
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsMkZBQWI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsV0FIVDtBQUFBLFFBSUEsTUFBQSxFQUFNLENBQ0osV0FESSxFQUVKLFlBRkksRUFHSixXQUhJLEVBSUosV0FKSSxFQUtKLFFBTEksRUFNSixRQU5JLEVBT0osaUJBUEksRUFRSixRQVJJLEVBU0osZ0JBVEksQ0FKTjtPQURGO0FBQUEsTUFnQkEsVUFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsbUhBQWI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsT0FIVDtBQUFBLFFBSUEsTUFBQSxFQUFNLENBQ0osb0JBREksRUFFSixPQUZJLEVBR0osU0FISSxDQUpOO09BakJGO0FBQUEsTUEwQkEsYUFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEseUVBQWI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsS0FIVDtPQTNCRjtBQUFBLE1Bb0NBLHFCQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSxtQ0FBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO09BckNGO0FBQUEsTUF3Q0EsMkJBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLCtCQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLE9BRlQ7T0F6Q0Y7QUFBQSxNQTRDQSxrQkFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsNENBQWI7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtPQTdDRjtBQUFBLE1BZ0RBLGVBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLCtCQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7T0FqREY7QUFBQSxNQW9EQSxtQkFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsaUdBQWI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsb0RBSFQ7T0FyREY7QUFBQSxNQXlEQSxXQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSxzREFBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxJQUZUO09BMURGO0FBQUEsTUE2REEsa0JBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLGlEQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7T0E5REY7QUFBQSxNQWlFQSxlQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSwrQ0FBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO09BbEVGO0tBREY7QUFBQSxJQXdFQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7YUFFUixJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUFaLENBQW9DLFNBQUEsR0FBQTtBQUNsQyxZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFULENBQUE7ZUFDQSxNQUFNLENBQUMsS0FBUCxDQUFBLEVBRmtDO01BQUEsQ0FBcEMsRUFGUTtJQUFBLENBeEVWO0dBRkYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/sarah/.atom/packages/isotope-light-ui/lib/isotope-light-ui.coffee