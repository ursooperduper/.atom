(function() {
  var helpers, path;

  helpers = require('atom-linter');

  path = require('path');

  module.exports = {
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
            var col, data, line, lintResult, toReturn, _i, _len, _ref;
            lintResult = JSON.parse(output);
            toReturn = [];
            if (lintResult.messages.length < 1) {
              return toReturn;
            }
            _ref = lintResult.messages;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              data = _ref[_i];
              line = data.line - 1;
              col = data.col - 1;
              toReturn.push({
                type: data.type.charAt(0).toUpperCase() + data.type.slice(1),
                text: data.message,
                filePath: filePath,
                range: [[line, col], [line, col]],
                trace: [
                  {
                    type: "Trace",
                    text: '[' + data.rule.id + '] ' + data.rule.desc
                  }
                ]
              });
            }
            return toReturn;
          });
        }
      };
    }
  };

}).call(this);
