(function() {
  var JekyllSnippetsView;

  JekyllSnippetsView = require('./jekyll-snippets-view');

  module.exports = {
    jekyllSnippetsView: null,
    activate: function(state) {
      return this.jekyllSnippetsView = new JekyllSnippetsView(state.jekyllSnippetsViewState);
    },
    deactivate: function() {
      return this.jekyllSnippetsView.destroy();
    },
    serialize: function() {
      return {
        jekyllSnippetsViewState: this.jekyllSnippetsView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2pla3lsbC1zbmlwcGV0cy9saWIvamVreWxsLXNuaXBwZXRzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQkFBQTs7QUFBQSxFQUFBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx3QkFBUixDQUFyQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsa0JBQUEsRUFBb0IsSUFBcEI7QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxrQkFBRCxHQUEwQixJQUFBLGtCQUFBLENBQW1CLEtBQUssQ0FBQyx1QkFBekIsRUFEbEI7SUFBQSxDQUZWO0FBQUEsSUFLQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLGtCQUFrQixDQUFDLE9BQXBCLENBQUEsRUFEVTtJQUFBLENBTFo7QUFBQSxJQVFBLFNBQUEsRUFBVyxTQUFBLEdBQUE7YUFDVDtBQUFBLFFBQUEsdUJBQUEsRUFBeUIsSUFBQyxDQUFBLGtCQUFrQixDQUFDLFNBQXBCLENBQUEsQ0FBekI7UUFEUztJQUFBLENBUlg7R0FIRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/sarah/.atom/packages/jekyll-snippets/lib/jekyll-snippets.coffee
