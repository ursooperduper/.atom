(function() {
  var AtomSpotifyStatusBarView;

  AtomSpotifyStatusBarView = require('./atom-spotify-status-bar-view');

  module.exports = {
    configDefaults: {
      displayOnLeftSide: true,
      showEqualizer: false
    },
    activate: function() {
      return this.atomSpotifyStatusBarView = new AtomSpotifyStatusBarView();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBOztBQUFBLEVBQUEsd0JBQUEsR0FBMkIsT0FBQSxDQUFRLGdDQUFSLENBQTNCLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxjQUFBLEVBQ0U7QUFBQSxNQUFBLGlCQUFBLEVBQW1CLElBQW5CO0FBQUEsTUFDQSxhQUFBLEVBQWUsS0FEZjtLQURGO0FBQUEsSUFJQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLHdCQUFELEdBQWdDLElBQUEsd0JBQUEsQ0FBQSxFQUR4QjtJQUFBLENBSlY7R0FKRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/sarah/.atom/packages/atom-spotify/lib/atom-spotify.coffee