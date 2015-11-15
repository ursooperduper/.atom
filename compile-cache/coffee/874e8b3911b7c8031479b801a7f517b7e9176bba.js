(function() {
  var ExpressionsRegistry;

  ExpressionsRegistry = require('../lib/expressions-registry');

  describe('ExpressionsRegistry', function() {
    var Dummy, registry, _ref;
    _ref = [], registry = _ref[0], Dummy = _ref[1];
    beforeEach(function() {
      Dummy = (function() {
        function Dummy(_arg) {
          this.name = _arg.name;
        }

        return Dummy;

      })();
      return registry = new ExpressionsRegistry(Dummy);
    });
    describe('::createExpression', function() {
      return describe('called with enough data', function() {
        return it('creates a new expression of this registry expressions type', function() {
          var expression;
          expression = registry.createExpression('dummy', 'foo');
          expect(expression.constructor).toBe(Dummy);
          return expect(registry.getExpressions()).toEqual([expression]);
        });
      });
    });
    describe('::addExpression', function() {
      return it('adds a previously created expression in the registry', function() {
        var expression;
        expression = new Dummy({
          name: 'bar'
        });
        registry.addExpression(expression);
        expect(registry.getExpression('bar')).toBe(expression);
        return expect(registry.getExpressions()).toEqual([expression]);
      });
    });
    describe('::getExpressions', function() {
      return it('returns the expression based on their priority', function() {
        var expression1, expression2, expression3;
        expression1 = registry.createExpression('dummy1', '', 2);
        expression2 = registry.createExpression('dummy2', '', 0);
        expression3 = registry.createExpression('dummy3', '', 1);
        return expect(registry.getExpressions()).toEqual([expression1, expression3, expression2]);
      });
    });
    return describe('::removeExpression', function() {
      return it('removes an expression with its name', function() {
        registry.createExpression('dummy', 'foo');
        registry.removeExpression('dummy');
        return expect(registry.getExpressions()).toEqual([]);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvZXhwcmVzc2lvbnMtcmVnaXN0cnktc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUJBQUE7O0FBQUEsRUFBQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsNkJBQVIsQ0FBdEIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsUUFBQSxxQkFBQTtBQUFBLElBQUEsT0FBb0IsRUFBcEIsRUFBQyxrQkFBRCxFQUFXLGVBQVgsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQU07QUFDUyxRQUFBLGVBQUMsSUFBRCxHQUFBO0FBQVcsVUFBVCxJQUFDLENBQUEsT0FBRixLQUFFLElBQVEsQ0FBWDtRQUFBLENBQWI7O3FCQUFBOztVQURGLENBQUE7YUFHQSxRQUFBLEdBQWUsSUFBQSxtQkFBQSxDQUFvQixLQUFwQixFQUpOO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQVFBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBLEdBQUE7YUFDN0IsUUFBQSxDQUFTLHlCQUFULEVBQW9DLFNBQUEsR0FBQTtlQUNsQyxFQUFBLENBQUcsNERBQUgsRUFBaUUsU0FBQSxHQUFBO0FBQy9ELGNBQUEsVUFBQTtBQUFBLFVBQUEsVUFBQSxHQUFhLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixPQUExQixFQUFtQyxLQUFuQyxDQUFiLENBQUE7QUFBQSxVQUVBLE1BQUEsQ0FBTyxVQUFVLENBQUMsV0FBbEIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxLQUFwQyxDQUZBLENBQUE7aUJBR0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxjQUFULENBQUEsQ0FBUCxDQUFpQyxDQUFDLE9BQWxDLENBQTBDLENBQUMsVUFBRCxDQUExQyxFQUorRDtRQUFBLENBQWpFLEVBRGtDO01BQUEsQ0FBcEMsRUFENkI7SUFBQSxDQUEvQixDQVJBLENBQUE7QUFBQSxJQWdCQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQSxHQUFBO2FBQzFCLEVBQUEsQ0FBRyxzREFBSCxFQUEyRCxTQUFBLEdBQUE7QUFDekQsWUFBQSxVQUFBO0FBQUEsUUFBQSxVQUFBLEdBQWlCLElBQUEsS0FBQSxDQUFNO0FBQUEsVUFBQSxJQUFBLEVBQU0sS0FBTjtTQUFOLENBQWpCLENBQUE7QUFBQSxRQUVBLFFBQVEsQ0FBQyxhQUFULENBQXVCLFVBQXZCLENBRkEsQ0FBQTtBQUFBLFFBSUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQVAsQ0FBcUMsQ0FBQyxJQUF0QyxDQUEyQyxVQUEzQyxDQUpBLENBQUE7ZUFLQSxNQUFBLENBQU8sUUFBUSxDQUFDLGNBQVQsQ0FBQSxDQUFQLENBQWlDLENBQUMsT0FBbEMsQ0FBMEMsQ0FBQyxVQUFELENBQTFDLEVBTnlEO01BQUEsQ0FBM0QsRUFEMEI7SUFBQSxDQUE1QixDQWhCQSxDQUFBO0FBQUEsSUF5QkEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTthQUMzQixFQUFBLENBQUcsZ0RBQUgsRUFBcUQsU0FBQSxHQUFBO0FBQ25ELFlBQUEscUNBQUE7QUFBQSxRQUFBLFdBQUEsR0FBYyxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsUUFBMUIsRUFBb0MsRUFBcEMsRUFBd0MsQ0FBeEMsQ0FBZCxDQUFBO0FBQUEsUUFDQSxXQUFBLEdBQWMsUUFBUSxDQUFDLGdCQUFULENBQTBCLFFBQTFCLEVBQW9DLEVBQXBDLEVBQXdDLENBQXhDLENBRGQsQ0FBQTtBQUFBLFFBRUEsV0FBQSxHQUFjLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixRQUExQixFQUFvQyxFQUFwQyxFQUF3QyxDQUF4QyxDQUZkLENBQUE7ZUFJQSxNQUFBLENBQU8sUUFBUSxDQUFDLGNBQVQsQ0FBQSxDQUFQLENBQWlDLENBQUMsT0FBbEMsQ0FBMEMsQ0FDeEMsV0FEd0MsRUFFeEMsV0FGd0MsRUFHeEMsV0FId0MsQ0FBMUMsRUFMbUQ7TUFBQSxDQUFyRCxFQUQyQjtJQUFBLENBQTdCLENBekJBLENBQUE7V0FxQ0EsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUEsR0FBQTthQUM3QixFQUFBLENBQUcscUNBQUgsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLFFBQUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DLEtBQW5DLENBQUEsQ0FBQTtBQUFBLFFBRUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLE9BQTFCLENBRkEsQ0FBQTtlQUlBLE1BQUEsQ0FBTyxRQUFRLENBQUMsY0FBVCxDQUFBLENBQVAsQ0FBaUMsQ0FBQyxPQUFsQyxDQUEwQyxFQUExQyxFQUx3QztNQUFBLENBQTFDLEVBRDZCO0lBQUEsQ0FBL0IsRUF0QzhCO0VBQUEsQ0FBaEMsQ0FGQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/sarah/.atom/packages/pigments/spec/expressions-registry-spec.coffee
