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
      colorTreeSelection: {
        description: 'Make the selected file stand out in tree-view. Looks better off when scrollbars always visible (e.g. on Linux)',
        type: 'boolean',
        "default": true
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsMkZBQWI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsV0FIVDtBQUFBLFFBSUEsTUFBQSxFQUFNLENBQ0osV0FESSxFQUVKLFlBRkksRUFHSixXQUhJLEVBSUosV0FKSSxFQUtKLFFBTEksRUFNSixRQU5JLEVBT0osaUJBUEksRUFRSixRQVJJLEVBU0osZ0JBVEksQ0FKTjtPQURGO0FBQUEsTUFnQkEsVUFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsbUhBQWI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsT0FIVDtBQUFBLFFBSUEsTUFBQSxFQUFNLENBQ0osb0JBREksRUFFSixPQUZJLEVBR0osU0FISSxDQUpOO09BakJGO0FBQUEsTUEwQkEsa0JBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLGdIQUFiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLElBSFQ7T0EzQkY7QUFBQSxNQStCQSxxQkFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsbUNBQWI7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtPQWhDRjtBQUFBLE1BbUNBLDJCQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSwrQkFBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLE9BRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxPQUZUO09BcENGO0FBQUEsTUF1Q0Esa0JBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLDRDQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7T0F4Q0Y7QUFBQSxNQTJDQSxlQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSwrQkFBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO09BNUNGO0FBQUEsTUErQ0EsbUJBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLGlHQUFiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLDhDQUhUO09BaERGO0FBQUEsTUFvREEsa0JBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLGlEQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7T0FyREY7QUFBQSxNQXdEQSxlQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSwrQ0FBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO09BekRGO0tBREY7QUFBQSxJQStEQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7YUFFUixJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUFaLENBQW9DLFNBQUEsR0FBQTtBQUNsQyxZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFULENBQUE7ZUFDQSxNQUFNLENBQUMsS0FBUCxDQUFBLEVBRmtDO01BQUEsQ0FBcEMsRUFGUTtJQUFBLENBL0RWO0dBRkYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/sarah/.atom/packages/isotope-ui/lib/isotope-ui.coffee