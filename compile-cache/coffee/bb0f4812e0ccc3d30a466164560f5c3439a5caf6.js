(function() {
  describe('directive grammar', function() {
    var grammar;
    grammar = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('angularjs');
      });
      return runs(function() {
        return grammar = atom.grammars.grammarForScopeName('text.html.angular');
      });
    });
    it('parses the grammar', function() {
      expect(grammar).toBeTruthy();
      return expect(grammar.scopeName).toBe('text.html.angular');
    });
    describe('directive attributes', function() {
      it('tokenizes ng-repeat attribute inside HTML', function() {
        var lines;
        lines = grammar.tokenizeLines('<dd ng-repeat="availability in phone.availability">{{availability}}</dd>');
        return expect(lines[0][3]).toEqual({
          value: 'ng-repeat',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      it('tokenizes ng-src and ng-click attributes inside HTML', function() {
        var lines;
        lines = grammar.tokenizeLines('<li ng-repeat="img in phone.images">\n  <img ng-src="{{img}}" ng-click="setImage(img)">\n</li>');
        expect(lines[0][3]).toEqual({
          value: 'ng-repeat',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
        expect(lines[1][4]).toEqual({
          value: 'ng-src',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
        return expect(lines[1][12]).toEqual({
          value: 'ng-click',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      it('tokenizes ng-view attribute without value inside HTML', function() {
        var lines;
        lines = grammar.tokenizeLines('<div ng-view class="view-frame"></div>');
        return expect(lines[0][3]).toEqual({
          value: 'ng-view',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      it('tokenizes capitalized ng-repeat attribute inside HTML', function() {
        var lines;
        lines = grammar.tokenizeLines('<dd NG-REPEAT="availability in phone.availability">{{availability}}</dd>');
        return expect(lines[0][3]).toEqual({
          value: 'NG-REPEAT',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      it('tokenizes ng-controller attribute in body tag', function() {
        var lines;
        lines = grammar.tokenizeLines('<body ng-controller="TestCtrl">');
        return expect(lines[0][3]).toEqual({
          value: 'ng-controller',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      it('tokenizes ng-s attribute', function() {
        var lines;
        lines = grammar.tokenizeLines('<select ng-options="color.name group by color.shade for color in colors">');
        return expect(lines[0][3]).toEqual({
          value: 'ng-options',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      return it('tokenizes ng- attributes for anchor tags', function() {
        var lines;
        lines = grammar.tokenizeLines('<a href="/url" ng-click=\'{{setImage(img)}}\'>');
        return expect(lines[0][9]).toEqual({
          value: 'ng-click',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
    });
    describe('directive element', function() {
      it('tokenizes ng-include element inside HTML', function() {
        var lines;
        lines = grammar.tokenizeLines('<ng-include src=""></ng-include>');
        expect(lines[0][1]).toEqual({
          value: 'ng-include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
        return expect(lines[0][5]).toEqual({
          value: 'ng-include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
      });
      return it('tokenizes capitalized ng-include element inside HTML', function() {
        var lines;
        lines = grammar.tokenizeLines('<NG-INCLUDE src=""></NG-INCLUDE>');
        expect(lines[0][1]).toEqual({
          value: 'NG-INCLUDE',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
        return expect(lines[0][5]).toEqual({
          value: 'NG-INCLUDE',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
      });
    });
    describe('normalization angular tag and attribute', function() {
      it('tokenizes data- prefixed angular attributes', function() {
        var lines;
        lines = grammar.tokenizeLines('<body data-ng-controller="TestCtrl">');
        return expect(lines[0][3]).toEqual({
          value: 'data-ng-controller',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      it('tokenizes x- prefixed angular attributes', function() {
        var lines;
        lines = grammar.tokenizeLines('<body x-ng-controller="TestCtrl">');
        return expect(lines[0][3]).toEqual({
          value: 'x-ng-controller',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      it('tokenizes _ suffixed angular attributes', function() {
        var lines;
        lines = grammar.tokenizeLines('<body ng_controller="TestCtrl">');
        return expect(lines[0][3]).toEqual({
          value: 'ng_controller',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      it('tokenizes : suffixed angular attributes', function() {
        var lines;
        lines = grammar.tokenizeLines('<body ng:controller="TestCtrl">');
        return expect(lines[0][3]).toEqual({
          value: 'ng:controller',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'entity.other.attribute-name.html.angular']
        });
      });
      it('tokenizes data- prefixed angular element', function() {
        var lines;
        lines = grammar.tokenizeLines('<data-ng-include src=""></data-ng-include>');
        expect(lines[0][1]).toEqual({
          value: 'data-ng-include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
        return expect(lines[0][5]).toEqual({
          value: 'data-ng-include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
      });
      it('tokenizes x- prefixed angular element', function() {
        var lines;
        lines = grammar.tokenizeLines('<x-ng-include src=""></x-ng-include>');
        expect(lines[0][1]).toEqual({
          value: 'x-ng-include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
        return expect(lines[0][5]).toEqual({
          value: 'x-ng-include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
      });
      it('tokenizes _ suffixed angular element', function() {
        var lines;
        lines = grammar.tokenizeLines('<ng_include src=""></ng_include>');
        expect(lines[0][1]).toEqual({
          value: 'ng_include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
        return expect(lines[0][5]).toEqual({
          value: 'ng_include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
      });
      return it('tokenizes : suffixed angular element', function() {
        var lines;
        lines = grammar.tokenizeLines('<ng:include src=""></ng:include>');
        expect(lines[0][1]).toEqual({
          value: 'ng:include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
        return expect(lines[0][5]).toEqual({
          value: 'ng:include',
          scopes: ['text.html.angular', 'meta.tag.block.any.html', 'entity.name.tag.block.any.html.angular']
        });
      });
    });
    return describe('angular expression', function() {
      it('tokenizes angular expressions in HTML tags', function() {
        var lines;
        lines = grammar.tokenizeLines('<dd>{{phone.camera.primary}}</dd>');
        expect(lines[0][3]).toEqual({
          value: '{{',
          scopes: ['text.html.angular', 'meta.tag.template.angular', 'punctuation.definition.block.begin.angular']
        });
        expect(lines[0][4]).toEqual({
          value: 'phone.camera.primary',
          scopes: ['text.html.angular', 'meta.tag.template.angular']
        });
        return expect(lines[0][5]).toEqual({
          value: '}}',
          scopes: ['text.html.angular', 'meta.tag.template.angular', 'punctuation.definition.block.end.angular']
        });
      });
      it('tokenizes angular expressions in value of attributes with double quoted', function() {
        var lines;
        lines = grammar.tokenizeLines('<li ng-repeat="phone in phones | filter:query | orderBy:orderProp"></li>');
        expect(lines[0][5]).toEqual({
          value: '"',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'punctuation.definition.string.begin.html.angular']
        });
        expect(lines[0][6]).toEqual({
          value: 'phone in phones | filter:query | orderBy:orderProp',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'meta.tag.template.angular']
        });
        return expect(lines[0][7]).toEqual({
          value: '"',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'punctuation.definition.string.end.html.angular']
        });
      });
      it('tokenizes angular expressions in value of attributes with single quoted', function() {
        var lines;
        lines = grammar.tokenizeLines('<li ng-repeat=\'img in phone.images\'>');
        expect(lines[0][5]).toEqual({
          value: '\'',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.single.html.angular', 'punctuation.definition.string.begin.html.angular']
        });
        expect(lines[0][6]).toEqual({
          value: 'img in phone.images',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.single.html.angular', 'meta.tag.template.angular']
        });
        return expect(lines[0][7]).toEqual({
          value: '\'',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.single.html.angular', 'punctuation.definition.string.end.html.angular']
        });
      });
      return it('tokenizes angular expressions in value of attributes with {{}}', function() {
        var lines;
        lines = grammar.tokenizeLines('<img ng-src="{{img}}" ng-click="{{setImage(img)}}">');
        expect(lines[0][5]).toEqual({
          value: '"',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'punctuation.definition.string.begin.html.angular']
        });
        expect(lines[0][6]).toEqual({
          value: '{{',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'meta.tag.template.angular', 'meta.tag.template.angular', 'punctuation.definition.block.begin.angular']
        });
        expect(lines[0][7]).toEqual({
          value: 'img',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'meta.tag.template.angular', 'meta.tag.template.angular']
        });
        expect(lines[0][8]).toEqual({
          value: '}}',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'meta.tag.template.angular', 'meta.tag.template.angular', 'punctuation.definition.block.end.angular']
        });
        expect(lines[0][9]).toEqual({
          value: '"',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'punctuation.definition.string.end.html.angular']
        });
        expect(lines[0][13]).toEqual({
          value: '"',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'punctuation.definition.string.begin.html.angular']
        });
        expect(lines[0][14]).toEqual({
          value: '{{',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'meta.tag.template.angular', 'meta.tag.template.angular', 'punctuation.definition.block.begin.angular']
        });
        expect(lines[0][15]).toEqual({
          value: 'setImage(img)',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'meta.tag.template.angular', 'meta.tag.template.angular']
        });
        expect(lines[0][16]).toEqual({
          value: '}}',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'meta.tag.template.angular', 'meta.tag.template.angular', 'punctuation.definition.block.end.angular']
        });
        return expect(lines[0][17]).toEqual({
          value: '"',
          scopes: ['text.html.angular', 'meta.tag.inline.any.html', 'meta.attribute.html.angular', 'string.quoted.double.html.angular', 'punctuation.definition.string.end.html.angular']
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2FuZ3VsYXJqcy9zcGVjL2dyYW1tYXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUEsR0FBQTtBQUM1QixRQUFBLE9BQUE7QUFBQSxJQUFBLE9BQUEsR0FBVSxJQUFWLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFdBQTlCLEVBRGM7TUFBQSxDQUFoQixDQUFBLENBQUE7YUFHQSxJQUFBLENBQUssU0FBQSxHQUFBO2VBQ0gsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQWQsQ0FBa0MsbUJBQWxDLEVBRFA7TUFBQSxDQUFMLEVBSlM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBU0EsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTtBQUN2QixNQUFBLE1BQUEsQ0FBTyxPQUFQLENBQWUsQ0FBQyxVQUFoQixDQUFBLENBQUEsQ0FBQTthQUNBLE1BQUEsQ0FBTyxPQUFPLENBQUMsU0FBZixDQUF5QixDQUFDLElBQTFCLENBQStCLG1CQUEvQixFQUZ1QjtJQUFBLENBQXpCLENBVEEsQ0FBQTtBQUFBLElBYUEsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUEsR0FBQTtBQUMvQixNQUFBLEVBQUEsQ0FBRywyQ0FBSCxFQUFnRCxTQUFBLEdBQUE7QUFDOUMsWUFBQSxLQUFBO0FBQUEsUUFBQSxLQUFBLEdBQVEsT0FBTyxDQUFDLGFBQVIsQ0FBc0IsMEVBQXRCLENBQVIsQ0FBQTtlQUlBLE1BQUEsQ0FBTyxLQUFNLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FB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

//# sourceURL=/Users/sarah/.atom/packages/angularjs/spec/grammar-spec.coffee
