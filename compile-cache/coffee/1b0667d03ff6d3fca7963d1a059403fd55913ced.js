(function() {
  var helpers, path;

  helpers = require('atom-linter');

  path = require('path');

  module.exports = {
    activate: function() {
      return require('atom-package-deps').install('linter-csslint');
    },
    provideLinter: function() {
      var provider;
      helpers = require('atom-linter');
      return provider = {
        name: 'CSSLint',
        grammarScopes: ['source.css', 'source.html'],
        scope: 'file',
        lintOnFly: true,
        lint: function(textEditor) {
          var exec, filePath, parameters, text;
          filePath = textEditor.getPath();
          text = textEditor.getText();
          parameters = ['--format=json', '-'];
          exec = path.join(__dirname, '..', 'node_modules', 'csslint', 'cli.js');
          return helpers.execNode(exec, parameters, {
            stdin: text
          }).then(function(output) {
            var col, data, line, lintResult, msg, toReturn, _i, _len, _ref;
            lintResult = JSON.parse(output);
            toReturn = [];
            if (lintResult.messages.length < 1) {
              return toReturn;
            }
            _ref = lintResult.messages;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              data = _ref[_i];
              msg = {};
              if (!(data.line && data.col)) {
                msg.range = helpers.rangeFromLineNumber(textEditor, 0);
              } else {
                line = data.line - 1;
                col = data.col - 1;
                msg.range = [[line, col], [line, col]];
              }
              msg.type = data.type.charAt(0).toUpperCase() + data.type.slice(1);
              msg.text = data.message;
              msg.filePath = filePath;
              if (data.rule.id && data.rule.desc) {
                msg.trace = [
                  {
                    type: "Trace",
                    text: '[' + data.rule.id + '] ' + data.rule.desc
                  }
                ];
              }
              toReturn.push(msg);
            }
            return toReturn;
          });
        }
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1jc3NsaW50L2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxhQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxhQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsT0FBQSxDQUFRLG1CQUFSLENBQTRCLENBQUMsT0FBN0IsQ0FBcUMsZ0JBQXJDLEVBRFE7SUFBQSxDQUFWO0FBQUEsSUFHQSxhQUFBLEVBQWUsU0FBQSxHQUFBO0FBQ2IsVUFBQSxRQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGFBQVIsQ0FBVixDQUFBO2FBQ0EsUUFBQSxHQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsYUFBQSxFQUFlLENBQUMsWUFBRCxFQUFlLGFBQWYsQ0FEZjtBQUFBLFFBRUEsS0FBQSxFQUFPLE1BRlA7QUFBQSxRQUdBLFNBQUEsRUFBVyxJQUhYO0FBQUEsUUFJQSxJQUFBLEVBQU0sU0FBQyxVQUFELEdBQUE7QUFDSixjQUFBLGdDQUFBO0FBQUEsVUFBQSxRQUFBLEdBQVcsVUFBVSxDQUFDLE9BQVgsQ0FBQSxDQUFYLENBQUE7QUFBQSxVQUNBLElBQUEsR0FBTyxVQUFVLENBQUMsT0FBWCxDQUFBLENBRFAsQ0FBQTtBQUFBLFVBRUEsVUFBQSxHQUFhLENBQUMsZUFBRCxFQUFrQixHQUFsQixDQUZiLENBQUE7QUFBQSxVQUdBLElBQUEsR0FBTyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsSUFBckIsRUFBMkIsY0FBM0IsRUFBMkMsU0FBM0MsRUFBc0QsUUFBdEQsQ0FIUCxDQUFBO2lCQUlBLE9BQU8sQ0FBQyxRQUFSLENBQWlCLElBQWpCLEVBQXVCLFVBQXZCLEVBQW1DO0FBQUEsWUFBQyxLQUFBLEVBQU8sSUFBUjtXQUFuQyxDQUFpRCxDQUFDLElBQWxELENBQXVELFNBQUMsTUFBRCxHQUFBO0FBQ3JELGdCQUFBLDBEQUFBO0FBQUEsWUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxNQUFYLENBQWIsQ0FBQTtBQUFBLFlBQ0EsUUFBQSxHQUFXLEVBRFgsQ0FBQTtBQUVBLFlBQUEsSUFBRyxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQXBCLEdBQTZCLENBQWhDO0FBQ0UscUJBQU8sUUFBUCxDQURGO2FBRkE7QUFJQTtBQUFBLGlCQUFBLDJDQUFBOzhCQUFBO0FBQ0UsY0FBQSxHQUFBLEdBQU0sRUFBTixDQUFBO0FBQ0EsY0FBQSxJQUFHLENBQUEsQ0FBSyxJQUFJLENBQUMsSUFBTCxJQUFjLElBQUksQ0FBQyxHQUFwQixDQUFQO0FBRUUsZ0JBQUEsR0FBRyxDQUFDLEtBQUosR0FBWSxPQUFPLENBQUMsbUJBQVIsQ0FBNEIsVUFBNUIsRUFBd0MsQ0FBeEMsQ0FBWixDQUZGO2VBQUEsTUFBQTtBQUlFLGdCQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsSUFBTCxHQUFZLENBQW5CLENBQUE7QUFBQSxnQkFDQSxHQUFBLEdBQU0sSUFBSSxDQUFDLEdBQUwsR0FBVyxDQURqQixDQUFBO0FBQUEsZ0JBRUEsR0FBRyxDQUFDLEtBQUosR0FBWSxDQUFDLENBQUMsSUFBRCxFQUFPLEdBQVAsQ0FBRCxFQUFjLENBQUMsSUFBRCxFQUFPLEdBQVAsQ0FBZCxDQUZaLENBSkY7ZUFEQTtBQUFBLGNBUUEsR0FBRyxDQUFDLElBQUosR0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQVYsQ0FBaUIsQ0FBakIsQ0FBbUIsQ0FBQyxXQUFwQixDQUFBLENBQUEsR0FBb0MsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFWLENBQWdCLENBQWhCLENBUi9DLENBQUE7QUFBQSxjQVNBLEdBQUcsQ0FBQyxJQUFKLEdBQVcsSUFBSSxDQUFDLE9BVGhCLENBQUE7QUFBQSxjQVVBLEdBQUcsQ0FBQyxRQUFKLEdBQWUsUUFWZixDQUFBO0FBV0EsY0FBQSxJQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBVixJQUFpQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQTlCO0FBQ0UsZ0JBQUEsR0FBRyxDQUFDLEtBQUosR0FBWTtrQkFBQztBQUFBLG9CQUNYLElBQUEsRUFBTSxPQURLO0FBQUEsb0JBRVgsSUFBQSxFQUFNLEdBQUEsR0FBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQWhCLEdBQXFCLElBQXJCLEdBQTRCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFGakM7bUJBQUQ7aUJBQVosQ0FERjtlQVhBO0FBQUEsY0FnQkEsUUFBUSxDQUFDLElBQVQsQ0FBYyxHQUFkLENBaEJBLENBREY7QUFBQSxhQUpBO0FBc0JBLG1CQUFPLFFBQVAsQ0F2QnFEO1VBQUEsQ0FBdkQsRUFMSTtRQUFBLENBSk47UUFIVztJQUFBLENBSGY7R0FKRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/sarah/.atom/packages/linter-csslint/lib/main.coffee
