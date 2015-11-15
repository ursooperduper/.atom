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
      lowContrastTooltip: {
        description: 'Make tooltips low contrast and not so colorful.',
        type: 'boolean',
        "default": false
      },
      matchEditorFont: {
        description: 'Match the font family you set for the editor.',
        type: 'boolean',
        "default": false
      },
      spaciousMode: {
        description: 'Make the layout more spacious.',
        type: 'boolean',
        "default": false
      },
      minimalMode: {
        description: 'Make the layout more minimal.',
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2lzb3RvcGUtbGlnaHQtdWkvbGliL2lzb3RvcGUtbGlnaHQtdWkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsMkZBQWI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsV0FIVDtBQUFBLFFBSUEsTUFBQSxFQUFNLENBQ0osV0FESSxFQUVKLFlBRkksRUFHSixXQUhJLEVBSUosV0FKSSxFQUtKLFFBTEksRUFNSixRQU5JLEVBT0osaUJBUEksRUFRSixRQVJJLEVBU0osZ0JBVEksQ0FKTjtPQURGO0FBQUEsTUFnQkEsVUFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsbUhBQWI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsT0FIVDtBQUFBLFFBSUEsTUFBQSxFQUFNLENBQ0osb0JBREksRUFFSixPQUZJLEVBR0osU0FISSxDQUpOO09BakJGO0FBQUEsTUEwQkEsa0JBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLDRDQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7T0EzQkY7QUFBQSxNQThCQSxlQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSwrQkFBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO09BL0JGO0FBQUEsTUFrQ0EsbUJBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLGlHQUFiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLG9EQUhUO09BbkNGO0FBQUEsTUF1Q0Esa0JBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLGlEQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7T0F4Q0Y7QUFBQSxNQTJDQSxlQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSwrQ0FBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO09BNUNGO0FBQUEsTUErQ0EsWUFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsZ0NBQWI7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtPQWhERjtBQUFBLE1BbURBLFdBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLCtCQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7T0FwREY7S0FERjtBQUFBLElBMERBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUVSLElBQUksQ0FBQyxNQUFNLENBQUMsdUJBQVosQ0FBb0MsU0FBQSxHQUFBO0FBQ2xDLFlBQUEsTUFBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBQVQsQ0FBQTtlQUNBLE1BQU0sQ0FBQyxLQUFQLENBQUEsRUFGa0M7TUFBQSxDQUFwQyxFQUZRO0lBQUEsQ0ExRFY7R0FGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/sarah/.atom/packages/isotope-light-ui/lib/isotope-light-ui.coffee
