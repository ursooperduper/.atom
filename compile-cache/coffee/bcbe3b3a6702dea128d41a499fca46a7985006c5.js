(function() {
  var AtomSpotifyStatusBarView, View, spotify,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  spotify = require('spotify-node-applescript');

  module.exports = AtomSpotifyStatusBarView = (function(_super) {
    __extends(AtomSpotifyStatusBarView, _super);

    function AtomSpotifyStatusBarView() {
      return AtomSpotifyStatusBarView.__super__.constructor.apply(this, arguments);
    }

    AtomSpotifyStatusBarView.content = function() {
      return this.div({
        "class": 'spotify inline-block'
      }, (function(_this) {
        return function() {
          return _this.div({
            outlet: 'container',
            "class": 'spotify-container'
          }, function() {
            _this.span({
              outlet: 'soundBars',
              'data-hidden': true,
              'data-state': 'paused',
              "class": 'spotify-sound-bars'
            }, function() {
              _this.span({
                "class": 'spotify-sound-bar'
              });
              _this.span({
                "class": 'spotify-sound-bar'
              });
              _this.span({
                "class": 'spotify-sound-bar'
              });
              _this.span({
                "class": 'spotify-sound-bar'
              });
              return _this.span({
                "class": 'spotify-sound-bar'
              });
            });
            return _this.span({
              outlet: "trackInfo",
              "class": 'atom-spotify-status',
              tabindex: '-1'
            }, "");
          });
        };
      })(this));
    };

    AtomSpotifyStatusBarView.prototype.initialize = function() {
      atom.workspaceView.command('atom-spotify:next', (function(_this) {
        return function() {
          return spotify.next(function() {
            return _this.updateTrackInfo();
          });
        };
      })(this));
      atom.workspaceView.command('atom-spotify:previous', (function(_this) {
        return function() {
          return spotify.previous(function() {
            return _this.updateTrackInfo();
          });
        };
      })(this));
      atom.workspaceView.command('atom-spotify:play', (function(_this) {
        return function() {
          return spotify.play(function() {
            return _this.updateTrackInfo();
          });
        };
      })(this));
      atom.workspaceView.command('atom-spotify:pause', (function(_this) {
        return function() {
          return spotify.pause(function() {
            return _this.updateTrackInfo();
          });
        };
      })(this));
      atom.workspaceView.command('atom-spotify:togglePlay', (function(_this) {
        return function() {
          return _this.togglePlay();
        };
      })(this));
      this.on('click', (function(_this) {
        return function() {
          return _this.togglePlay();
        };
      })(this));
      return this.subscribe(atom.packages.once('activated', (function(_this) {
        return function() {
          atom.config.observe('atom-spotify.showEqualizer', function() {
            return _this.toggleShowEqualizer(atom.config.get('atom-spotify.showEqualizer'));
          });
          return atom.config.observe('atom-spotify.displayOnLeftSide', function() {
            return setTimeout(function() {
              return _this.appendToStatusBar(atom.config.get('atom-spotify.displayOnLeftSide'));
            }, 1);
          });
        };
      })(this)));
    };

    AtomSpotifyStatusBarView.prototype.toggleShowEqualizer = function(shown) {
      if (shown) {
        return this.soundBars.removeAttr('data-hidden');
      } else {
        return this.soundBars.attr('data-hidden', true);
      }
    };

    AtomSpotifyStatusBarView.prototype.togglePauseEqualizer = function(paused) {
      if (paused) {
        return this.soundBars.attr('data-state', 'paused');
      } else {
        return this.soundBars.removeAttr('data-state');
      }
    };

    AtomSpotifyStatusBarView.prototype.appendToStatusBar = function(onLeftSide) {
      this.detach();
      if (onLeftSide) {
        return atom.workspaceView.statusBar.appendLeft(this);
      } else {
        return atom.workspaceView.statusBar.appendRight(this);
      }
    };

    AtomSpotifyStatusBarView.prototype.updateTrackInfo = function() {
      return spotify.isRunning((function(_this) {
        return function(err, isRunning) {
          if (isRunning) {
            return spotify.getTrack(function(error, track) {
              var trackInfoText;
              if (track) {
                trackInfoText = "" + track.artist + " - " + track.name;
                if (!atom.config.get('atom-spotify.showEqualizer')) {
                  trackInfoText = "♫ " + trackInfoText;
                }
                _this.trackInfo.text(trackInfoText);
              } else {
                _this.trackInfo.text('');
              }
              return _this.updateEqualizer();
            });
          } else {
            return _this.trackInfo.text('');
          }
        };
      })(this));
    };

    AtomSpotifyStatusBarView.prototype.updateEqualizer = function() {
      return spotify.isRunning((function(_this) {
        return function(err, isRunning) {
          return spotify.getState(function(err, state) {
            if (err) {
              return;
            }
            return _this.togglePauseEqualizer(state.state !== 'playing');
          });
        };
      })(this));
    };

    AtomSpotifyStatusBarView.prototype.togglePlay = function() {
      return spotify.isRunning((function(_this) {
        return function(err, isRunning) {
          if (isRunning) {
            return spotify.playPause(function() {
              return _this.updateEqualizer();
            });
          }
        };
      })(this));
    };

    AtomSpotifyStatusBarView.prototype.afterAttach = function() {
      return setInterval((function(_this) {
        return function() {
          return _this.updateTrackInfo();
        };
      })(this), 1000);
    };

    return AtomSpotifyStatusBarView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSwwQkFBUixDQURWLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osK0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsd0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHNCQUFQO09BQUwsRUFBb0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDbEMsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsTUFBQSxFQUFRLFdBQVI7QUFBQSxZQUFxQixPQUFBLEVBQU8sbUJBQTVCO1dBQUwsRUFBc0QsU0FBQSxHQUFBO0FBQ3BELFlBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGNBQUEsTUFBQSxFQUFRLFdBQVI7QUFBQSxjQUFxQixhQUFBLEVBQWUsSUFBcEM7QUFBQSxjQUEwQyxZQUFBLEVBQWMsUUFBeEQ7QUFBQSxjQUFrRSxPQUFBLEVBQU8sb0JBQXpFO2FBQU4sRUFBcUcsU0FBQSxHQUFBO0FBQ25HLGNBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGdCQUFBLE9BQUEsRUFBTyxtQkFBUDtlQUFOLENBQUEsQ0FBQTtBQUFBLGNBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGdCQUFBLE9BQUEsRUFBTyxtQkFBUDtlQUFOLENBREEsQ0FBQTtBQUFBLGNBRUEsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGdCQUFBLE9BQUEsRUFBTyxtQkFBUDtlQUFOLENBRkEs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
//# sourceURL=/Users/sarah/.atom/packages/atom-spotify/lib/atom-spotify-status-bar-view.coffee