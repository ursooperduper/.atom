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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1jc3NsaW50L2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxhQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxhQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsT0FBQSxDQUFRLG1CQUFSLENBQTRCLENBQUMsT0FBN0IsQ0FBcUMsZ0JBQXJDLEVBRFE7SUFBQSxDQUFWO0FBQUEsSUFHQSxhQUFBLEVBQWUsU0FBQSxHQUFBO0FBQ2IsVUFBQSxRQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGFBQVIsQ0FBVixDQUFBO2FBQ0EsUUFBQSxHQUNFO0FBQUEsUUFBQSxhQUFBLEVBQWUsQ0FBQyxZQUFELEVBQWUsYUFBZixDQUFmO0FBQUEsUUFDQSxLQUFBLEVBQU8sTUFEUDtBQUFBLFFBRUEsU0FBQSxFQUFXLElBRlg7QUFBQSxRQUdBLElBQUEsRUFBTSxTQUFDLFVBQUQsR0FBQTtBQUNKLGNBQUEsZ0NBQUE7QUFBQSxVQUFBLFFBQUEsR0FBVyxVQUFVLENBQUMsT0FBWCxDQUFBLENBQVgsQ0FBQTtBQUFBLFVBQ0EsSUFBQSxHQUFPLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FEUCxDQUFBO0FBQUEsVUFFQSxVQUFBLEdBQWEsQ0FBQyxlQUFELEVBQWtCLEdBQWxCLENBRmIsQ0FBQTtBQUFBLFVBR0EsSUFBQSxHQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixJQUFyQixFQUEyQixjQUEzQixFQUEyQyxTQUEzQyxFQUFzRCxRQUF0RCxDQUhQLENBQUE7aUJBSUEsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsSUFBakIsRUFBdUIsVUFBdkIsRUFBbUM7QUFBQSxZQUFDLEtBQUEsRUFBTyxJQUFSO1dBQW5DLENBQWlELENBQUMsSUFBbEQsQ0FBdUQsU0FBQyxNQUFELEdBQUE7QUFDckQsZ0JBQUEsMERBQUE7QUFBQSxZQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQVgsQ0FBYixDQUFBO0FBQUEsWUFDQSxRQUFBLEdBQVcsRUFEWCxDQUFBO0FBRUEsWUFBQSxJQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBcEIsR0FBNkIsQ0FBaEM7QUFDRSxxQkFBTyxRQUFQLENBREY7YUFGQTtBQUlBO0FBQUEsaUJBQUEsMkNBQUE7OEJBQUE7QUFDRSxjQUFBLEdBQUEsR0FBTSxFQUFOLENBQUE7QUFDQSxjQUFBLElBQUcsQ0FBQSxDQUFLLElBQUksQ0FBQyxJQUFMLElBQWMsSUFBSSxDQUFDLEdBQXBCLENBQVA7QUFFRSxnQkFBQSxHQUFHLENBQUMsS0FBSixHQUFZLE9BQU8sQ0FBQyxtQkFBUixDQUE0QixVQUE1QixFQUF3QyxDQUF4QyxDQUFaLENBRkY7ZUFBQSxNQUFBO0FBSUUsZ0JBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxJQUFMLEdBQVksQ0FBbkIsQ0FBQTtBQUFBLGdCQUNBLEdBQUEsR0FBTSxJQUFJLENBQUMsR0FBTCxHQUFXLENBRGpCLENBQUE7QUFBQSxnQkFFQSxHQUFHLENBQUMsS0FBSixHQUFZLENBQUMsQ0FBQyxJQUFELEVBQU8sR0FBUCxDQUFELEVBQWMsQ0FBQyxJQUFELEVBQU8sR0FBUCxDQUFkLENBRlosQ0FKRjtlQURBO0FBQUEsY0FRQSxHQUFHLENBQUMsSUFBSixHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBVixDQUFpQixDQUFqQixDQUFtQixDQUFDLFdBQXBCLENBQUEsQ0FBQSxHQUFvQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQVYsQ0FBZ0IsQ0FBaEIsQ0FSL0MsQ0FBQTtBQUFBLGNBU0EsR0FBRyxDQUFDLElBQUosR0FBVyxJQUFJLENBQUMsT0FUaEIsQ0FBQTtBQUFBLGNBVUEsR0FBRyxDQUFDLFFBQUosR0FBZSxRQVZmLENBQUE7QUFXQSxjQUFBLElBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFWLElBQWlCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBOUI7QUFDRSxnQkFBQSxHQUFHLENBQUMsS0FBSixHQUFZO2tCQUFDO0FBQUEsb0JBQ1gsSUFBQSxFQUFNLE9BREs7QUFBQSxvQkFFWCxJQUFBLEVBQU0sR0FBQSxHQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBaEIsR0FBcUIsSUFBckIsR0FBNEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUZqQzttQkFBRDtpQkFBWixDQURGO2VBWEE7QUFBQSxjQWdCQSxRQUFRLENBQUMsSUFBVCxDQUFjLEdBQWQsQ0FoQkEsQ0FERjtBQUFBLGFBSkE7QUFzQkEsbUJBQU8sUUFBUCxDQXZCcUQ7VUFBQSxDQUF2RCxFQUxJO1FBQUEsQ0FITjtRQUhXO0lBQUEsQ0FIZjtHQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/sarah/.atom/packages/linter-csslint/lib/main.coffee
