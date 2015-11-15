(function() {
  var ExpressionsRegistry, VariableExpression, registry, strip;

  strip = require('./utils').strip;

  ExpressionsRegistry = require('./expressions-registry');

  VariableExpression = require('./variable-expression');

  module.exports = registry = new ExpressionsRegistry(VariableExpression);

  registry.createExpression('less', '^[ \\t]*(@[a-zA-Z0-9\\-_]+)\\s*:\\s*([^;\\n]+);?');

  registry.createExpression('scss_params', '^[ \\t]*@(mixin|include|function)\\s+[a-zA-Z0-9\\-_]+\\s*\\([^\\)]+\\)', function(match, solver) {
    match = match[0];
    return solver.endParsing(match.length - 1);
  });

  registry.createExpression('scss', '^[ \\t]*(\\$[a-zA-Z0-9\\-_]+)\\s*:\\s*(.*?)(\\s*!default)?;');

  registry.createExpression('sass', '^[ \\t]*(\\$[a-zA-Z0-9\\-_]+):\\s*([^\\{]*?)(\\s*!default)?$');

  registry.createExpression('stylus_hash', '^[ \\t]*([a-zA-Z_$][a-zA-Z0-9\\-_]*)\\s*=\\s*\\{([^=]*)\\}', function(match, solver) {
    var buffer, char, commaSensitiveBegin, commaSensitiveEnd, content, current, inCommaSensitiveContext, key, name, scope, scopeBegin, scopeEnd, value, _i, _len, _ref, _ref1;
    buffer = '';
    _ref = match, match = _ref[0], name = _ref[1], content = _ref[2];
    current = match.indexOf(content);
    scope = [name];
    scopeBegin = /\{/;
    scopeEnd = /\}/;
    commaSensitiveBegin = /\(|\[/;
    commaSensitiveEnd = /\)|\]/;
    inCommaSensitiveContext = false;
    for (_i = 0, _len = content.length; _i < _len; _i++) {
      char = content[_i];
      if (scopeBegin.test(char)) {
        scope.push(buffer.replace(/[\s:]/g, ''));
        buffer = '';
      } else if (scopeEnd.test(char)) {
        scope.pop();
        if (scope.length === 0) {
          return solver.endParsing(current);
        }
      } else if (commaSensitiveBegin.test(char)) {
        buffer += char;
        inCommaSensitiveContext = true;
      } else if (inCommaSensitiveContext) {
        buffer += char;
        inCommaSensitiveContext = !commaSensitiveEnd.test(char);
      } else if (/[,\n]/.test(char)) {
        buffer = strip(buffer);
        if (buffer.length) {
          _ref1 = buffer.split(/\s*:\s*/), key = _ref1[0], value = _ref1[1];
          solver.appendResult([scope.concat(key).join('.'), value, current - buffer.length - 1, current]);
        }
        buffer = '';
      } else {
        buffer += char;
      }
      current++;
    }
    scope.pop();
    if (scope.length === 0) {
      return solver.endParsing(current + 1);
    } else {
      return solver.abortParsing();
    }
  });

  registry.createExpression('stylus', '^[ \\t]*([a-zA-Z_$][a-zA-Z0-9\\-_]*)\\s*=(?!=)\\s*([^\\n;]*);?$');

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi92YXJpYWJsZS1leHByZXNzaW9ucy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0RBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxTQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBQ0EsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHdCQUFSLENBRHRCLENBQUE7O0FBQUEsRUFFQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsdUJBQVIsQ0FGckIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFFBQUEsR0FBZSxJQUFBLG1CQUFBLENBQW9CLGtCQUFwQixDQUpoQyxDQUFBOztBQUFBLEVBTUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLE1BQTFCLEVBQWtDLGtEQUFsQyxDQU5BLENBQUE7O0FBQUEsRUFTQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsYUFBMUIsRUFBeUMsd0VBQXpDLEVBQW1ILFNBQUMsS0FBRCxFQUFRLE1BQVIsR0FBQTtBQUNqSCxJQUFDLFFBQVMsUUFBVixDQUFBO1dBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFqQyxFQUZpSDtFQUFBLENBQW5ILENBVEEsQ0FBQTs7QUFBQSxFQWFBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixNQUExQixFQUFrQyw2REFBbEMsQ0FiQSxDQUFBOztBQUFBLEVBZUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLE1BQTFCLEVBQWtDLDhEQUFsQyxDQWZBLENBQUE7O0FBQUEsRUFpQkEsUUFBUSxDQUFDLGdCQUFULENBQTBCLGFBQTFCLEVBQXlDLDREQUF6QyxFQUF1RyxTQUFDLEtBQUQsRUFBUSxNQUFSLEdBQUE7QUFDckcsUUFBQSxxS0FBQTtBQUFB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

//# sourceURL=/Users/sarah/.atom/packages/pigments/lib/variable-expressions.coffee
