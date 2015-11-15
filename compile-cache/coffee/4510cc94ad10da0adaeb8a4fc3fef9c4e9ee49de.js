(function() {
  module.exports = {
    config: {
      fontFamily: {
        description: 'Use one of the fonts available in this package. View the README for descriptions of each.',
        type: 'string',
        "default": 'System Default',
        "enum": ['Cantarell', 'Clear Sans', 'Fira Sans', 'Open Sans', 'Oxygen', 'Roboto', 'Source Sans Pro', 'Ubuntu', 'System Default']
      },
      fontWeight: {
        description: 'Not all fonts come in all weights: Canterell and Oxygen only have regular, Ubuntu and Open Sans don\'t have thin.',
        type: 'string',
        "default": 'Regular',
        "enum": ['Extra light / Thin', 'Light', 'Regular']
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
        "default": 'atom://isotope-ui/resources/images/raket.jpg'
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2lzb3RvcGUtdWkvbGliL2lzb3RvcGUtdWkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsMkZBQWI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsZ0JBSFQ7QUFBQSxRQUlBLE1BQUEsRUFBTSxDQUNKLFdBREksRUFFSixZQUZJLEVBR0osV0FISSxFQUlKLFdBSkksRUFLSixRQUxJLEVBTUosUUFOSSxFQU9KLGlCQVBJLEVBUUosUUFSSSxFQVNKLGdCQVRJLENBSk47T0FERjtBQUFBLE1BZ0JBLFVBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLG1IQUFiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLFNBSFQ7QUFBQSxRQUlBLE1BQUEsRUFBTSxDQUNKLG9CQURJLEVBRUosT0FGSSxFQUdKLFNBSEksQ0FKTjtPQWpCRjtBQUFBLE1BMEJBLHFCQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSxtQ0FBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO09BM0JGO0FBQUEsTUE4QkEsMkJBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLCtCQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLE9BRlQ7T0EvQkY7QUFBQSxNQWtDQSxrQkFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsNENBQWI7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtPQW5DRjtBQUFBLE1Bc0NBLGVBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLCtCQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7T0F2Q0Y7QUFBQSxNQTBDQSxtQkFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsaUdBQWI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsOENBSFQ7T0EzQ0Y7QUFBQSxNQStDQSxrQkFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsaURBQWI7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtPQWhERjtBQUFBLE1BbURBLGVBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLCtDQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7T0FwREY7QUFBQSxNQXVEQSxXQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSwrQkFBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO09BeERGO0tBREY7QUFBQSxJQThEQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7YUFFUixJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUFaLENBQW9DLFNBQUEsR0FBQTtBQUNsQyxZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFULENBQUE7ZUFDQSxNQUFNLENBQUMsS0FBUCxDQUFBLEVBRmtDO01BQUEsQ0FBcEMsRUFGUTtJQUFBLENBOURWO0dBRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/sarah/.atom/packages/isotope-ui/lib/isotope-ui.coffee
