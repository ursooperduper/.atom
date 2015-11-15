(function() {
  var Suggestion, deprecate;

  deprecate = require('grim').deprecate;

  module.exports = Suggestion = (function() {
    function Suggestion(provider, options) {
      this.provider = provider;
      deprecate("`Suggestion` is no longer supported. Please define your own object (a class or anonymous object)\ninstead of instantiating `Suggestion`. Example\n  ```\n  # Example:\n  provider =\n    requestHandler: (options) ->\n      # Build your suggestions here...\n\n      # Return your suggestions as an array of anonymous objects\n      [{\n        word: 'ohai',\n        prefix: 'ohai',\n        label: '<span style=\"color: red\">ohai</span>',\n        renderLabelAsHtml: true,\n        className: 'ohai'\n      }]\n    selector: '.source.js,.source.coffee' # This provider will be run on JavaScript and Coffee files\n    dispose: ->\n      # Your dispose logic here\n  ```");
      if (options.word != null) {
        this.word = options.word;
      }
      if (options.prefix != null) {
        this.prefix = options.prefix;
      }
      if (options.label != null) {
        this.label = options.label;
      }
      if (options.data != null) {
        this.data = options.data;
      }
      if (options.renderLabelAsHtml != null) {
        this.renderLabelAsHtml = options.renderLabelAsHtml;
      }
      if (options.className != null) {
        this.className = options.className;
      }
    }

    return Suggestion;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFCQUFBOztBQUFBLEVBQUMsWUFBYSxPQUFBLENBQVEsTUFBUixFQUFiLFNBQUQsQ0FBQTs7QUFBQSxFQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLG9CQUFFLFFBQUYsRUFBWSxPQUFaLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxXQUFBLFFBQ2IsQ0FBQTtBQUFBLE1BQUEsU0FBQSxDQUFVLDZwQkFBVixDQUFBLENBQUE7QUFzQkEsTUFBQSxJQUF3QixvQkFBeEI7QUFBQSxRQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsT0FBTyxDQUFDLElBQWhCLENBQUE7T0F0QkE7QUF1QkEsTUFBQSxJQUE0QixzQkFBNUI7QUFBQSxRQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsT0FBTyxDQUFDLE1BQWxCLENBQUE7T0F2QkE7QUF3QkEsTUFBQSxJQUEwQixxQkFBMUI7QUFBQSxRQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsT0FBTyxDQUFDLEtBQWpCLENBQUE7T0F4QkE7QUF5QkEsTUFBQSxJQUF3QixvQkFBeEI7QUFBQSxRQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsT0FBTyxDQUFDLElBQWhCLENBQUE7T0F6QkE7QUEwQkEsTUFBQSxJQUFrRCxpQ0FBbEQ7QUFBQSxRQUFBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixPQUFPLENBQUMsaUJBQTdCLENBQUE7T0ExQkE7QUEyQkEsTUFBQSxJQUFrQyx5QkFBbEM7QUFBQSxRQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsT0FBTyxDQUFDLFNBQXJCLENBQUE7T0E1Qlc7SUFBQSxDQUFiOztzQkFBQTs7TUFIRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-plus/lib/suggestion.coffee