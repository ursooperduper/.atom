(function() {
  var $, JekyllSnippetsView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = require('atom-space-pen-views').$;

  _ref = require('space-pen'), $ = _ref.$, View = _ref.View;

  module.exports = JekyllSnippetsView = (function(_super) {
    __extends(JekyllSnippetsView, _super);

    function JekyllSnippetsView() {
      return JekyllSnippetsView.__super__.constructor.apply(this, arguments);
    }

    JekyllSnippetsView.content = function() {
      return this.div({
        "class": 'jekyll-snippets overlay from-top'
      }, (function(_this) {
        return function() {
          return _this.div("The JekyllSnippets package is Alive! It's ALIVE!", {
            "class": "message"
          });
        };
      })(this));
    };

    JekyllSnippetsView.prototype.initialize = function() {
      return atom.commands.add(this.element, 'jekyll-snippets:toggle', (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
    };

    JekyllSnippetsView.prototype.serialize = function() {};

    JekyllSnippetsView.prototype.destroy = function() {
      return this.element.remove();
    };

    JekyllSnippetsView.prototype.getElement = function() {
      return this.element;
    };

    return JekyllSnippetsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2pla3lsbC1zbmlwcGV0cy9saWIvamVreWxsLXNuaXBwZXRzLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLGlDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxJQUFLLE9BQUEsQ0FBUSxzQkFBUixFQUFMLENBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQVksT0FBQSxDQUFRLFdBQVIsQ0FBWixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFESixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGtCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxrQ0FBUDtPQUFMLEVBQWdELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQzlDLEtBQUMsQ0FBQSxHQUFELENBQUssa0RBQUwsRUFBeUQ7QUFBQSxZQUFBLE9BQUEsRUFBTyxTQUFQO1dBQXpELEVBRDhDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEQsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSxpQ0FJQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxPQUFuQixFQUNBLHdCQURBLEVBQzBCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEMUIsRUFEVTtJQUFBLENBSlosQ0FBQTs7QUFBQSxpQ0FTQSxTQUFBLEdBQVcsU0FBQSxHQUFBLENBVFgsQ0FBQTs7QUFBQSxpQ0FZQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQUEsRUFETztJQUFBLENBWlQsQ0FBQTs7QUFBQSxpQ0FlQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLFFBRFM7SUFBQSxDQWZaLENBQUE7OzhCQUFBOztLQUQrQixLQUpqQyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/sarah/.atom/packages/jekyll-snippets/lib/jekyll-snippets-view.coffee
