(function() {
  var $;

  $ = require('atom').$;

  module.exports = {
    configDefaults: {
      allowTreeViewToScrollHorizontally: false
    },
    activate: function(state) {
      var matches, osstyle, useragent, version;
      atom.config.observe('unity-ui.allowTreeViewToScrollHorizontally', function() {
        if (atom.config.get('unity-ui.allowTreeViewToScrollHorizontally')) {
          return $('.tree-view-scroller').addClass('tree-view-scrolls-horizontally');
        } else {
          return $('.tree-view-scroller').removeClass('tree-view-scrolls-horizontally');
        }
      });
      useragent = navigator.userAgent;
      if (matches = useragent.match(/Mac OS X 10_([0-9]+)_[0-9]+/i)) {
        version = parseInt(matches[1], 10);
        osstyle = version >= 10 ? 'unity-mac-new' : 'unity-mac-old';
        $(document.body).addClass(osstyle);
      }
      $(window).on('resize', this.checkFullscreen);
      return this.checkFullscreen();
    },
    checkFullscreen: function() {
      if ($(window).height() + 1 >= screen.height) {
        return atom.workspaceView.addClass('unity-ui-fullscreen');
      } else {
        return atom.workspaceView.removeClass('unity-ui-fullscreen');
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLENBQUE7O0FBQUEsRUFBQyxJQUFLLE9BQUEsQ0FBUSxNQUFSLEVBQUwsQ0FBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxpQ0FBQSxFQUFtQyxLQUFuQztLQURGO0FBQUEsSUFHQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDTixVQUFBLG9DQUFBO0FBQUEsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsNENBQXBCLEVBQWtFLFNBQUEsR0FBQTtBQUNoRSxRQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRDQUFoQixDQUFIO2lCQUNFLENBQUEsQ0FBRSxxQkFBRixDQUF3QixDQUFDLFFBQXpCLENBQWtDLGdDQUFsQyxFQURGO1NBQUEsTUFBQTtpQkFHRSxDQUFBLENBQUUscUJBQUYsQ0FBd0IsQ0FBQyxXQUF6QixDQUFxQyxnQ0FBckMsRUFIRjtTQURnRTtNQUFBLENBQWxFLENBQUEsQ0FBQTtBQUFBLE1BTUEsU0FBQSxHQUFZLFNBQVMsQ0FBQyxTQU50QixDQUFBO0FBUUEsTUFBQSxJQUFHLE9BQUEsR0FBVSxTQUFTLENBQUMsS0FBVixDQUFnQiw4QkFBaEIsQ0FBYjtBQUNFLFFBQUEsT0FBQSxHQUFVLFFBQUEsQ0FBUyxPQUFRLENBQUEsQ0FBQSxDQUFqQixFQUFxQixFQUFyQixDQUFWLENBQUE7QUFBQSxRQUNBLE9BQUEsR0FBYSxPQUFBLElBQVcsRUFBZCxHQUFzQixlQUF0QixHQUEyQyxlQURyRCxDQUFBO0FBQUEsUUFFQSxDQUFBLENBQUUsUUFBUSxDQUFDLElBQVgsQ0FBZ0IsQ0FBQyxRQUFqQixDQUEwQixPQUExQixDQUZBLENBREY7T0FSQTtBQUFBLE1BYUEsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLEVBQVYsQ0FBYSxRQUFiLEVBQXVCLElBQUMsQ0FBQSxlQUF4QixDQWJBLENBQUE7YUFlQSxJQUFDLENBQUEsZUFBRCxDQUFBLEVBaEJNO0lBQUEsQ0FIVjtBQUFBLElBcUJBLGVBQUEsRUFBaUIsU0FBQSxHQUFBO0FBQ2YsTUFBQSxJQUFHLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxNQUFWLENBQUEsQ0FBQSxHQUFxQixDQUFyQixJQUEwQixNQUFNLENBQUMsTUFBcEM7ZUFDRSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLHFCQUE1QixFQURGO09BQUEsTUFBQTtlQUdFLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBbkIsQ0FBK0IscUJBQS9CLEVBSEY7T0FEZTtJQUFBLENBckJqQjtHQUhGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/sarah/.atom/packages/unity-ui/lib/unity-ui.coffee