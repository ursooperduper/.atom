(function() {
  var clangSourceScopeDictionary;

  clangSourceScopeDictionary = {
    'source.c++': 'c++',
    'source.c': 'c',
    'source.objc': 'objective-c',
    'source.objc++': 'objective-c++'
  };

  module.exports = {
    getFirstCursorSourceScopeLang: function(editor, scopeDictionary) {
      var scopes;
      if (scopeDictionary == null) {
        scopeDictionary = clangSourceScopeDictionary;
      }
      scopes = this.getFirstCursorScopes(editor);
      return this.getSourceScopeLang(scopes);
    },
    getFirstCursorScopes: function(editor) {
      var firstCursorPosition, scopes;
      firstCursorPosition = editor.getCursors()[0].getBufferPosition();
      return scopes = editor.scopesForBufferPosition(firstCursorPosition);
    },
    getSourceScopeLang: function(scopes, scopeDictionary) {
      var lang, scope, _i, _len;
      if (scopeDictionary == null) {
        scopeDictionary = clangSourceScopeDictionary;
      }
      lang = null;
      for (_i = 0, _len = scopes.length; _i < _len; _i++) {
        scope = scopes[_i];
        if (scope in scopeDictionary) {
          return scopeDictionary[scope];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBCQUFBOztBQUFBLEVBQUEsMEJBQUEsR0FBNkI7QUFBQSxJQUMzQixZQUFBLEVBQWtCLEtBRFM7QUFBQSxJQUUzQixVQUFBLEVBQWtCLEdBRlM7QUFBQSxJQUczQixhQUFBLEVBQWtCLGFBSFM7QUFBQSxJQUkzQixlQUFBLEVBQWtCLGVBSlM7R0FBN0IsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLDZCQUFBLEVBQStCLFNBQUMsTUFBRCxFQUFTLGVBQVQsR0FBQTtBQUM3QixVQUFBLE1BQUE7O1FBRHNDLGtCQUFnQjtPQUN0RDtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxvQkFBRCxDQUFzQixNQUF0QixDQUFULENBQUE7QUFDQSxhQUFPLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixNQUFwQixDQUFQLENBRjZCO0lBQUEsQ0FBL0I7QUFBQSxJQUlBLG9CQUFBLEVBQXNCLFNBQUMsTUFBRCxHQUFBO0FBQ3BCLFVBQUEsMkJBQUE7QUFBQSxNQUFBLG1CQUFBLEdBQXNCLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBb0IsQ0FBQSxDQUFBLENBQUUsQ0FBQyxpQkFBdkIsQ0FBQSxDQUF0QixDQUFBO2FBQ0EsTUFBQSxHQUFTLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixtQkFBL0IsRUFGVztJQUFBLENBSnRCO0FBQUEsSUFRQSxrQkFBQSxFQUFvQixTQUFDLE1BQUQsRUFBUyxlQUFULEdBQUE7QUFDbEIsVUFBQSxxQkFBQTs7UUFEMkIsa0JBQWdCO09BQzNDO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBUCxDQUFBO0FBQ0EsV0FBQSw2Q0FBQTsyQkFBQTtBQUNFLFFBQUEsSUFBRyxLQUFBLElBQVMsZUFBWjtBQUNFLGlCQUFPLGVBQWdCLENBQUEsS0FBQSxDQUF2QixDQURGO1NBREY7QUFBQSxPQUZrQjtJQUFBLENBUnBCO0dBUkYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-clang/lib/util.coffee