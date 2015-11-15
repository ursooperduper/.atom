(function() {
  var clangSourceScopeDictionary;

  clangSourceScopeDictionary = {
    'source.cpp': 'c++',
    'source.c': 'c',
    'source.objc': 'objective-c',
    'source.objcpp': 'objective-c++',
    'source.c++': 'c++',
    'source.objc++': 'objective-c++'
  };

  module.exports = {
    getFirstCursorSourceScopeLang: function(editor) {
      var scopes;
      scopes = this.getFirstCursorScopes(editor);
      return this.getSourceScopeLang(scopes);
    },
    getFirstCursorScopes: function(editor) {
      var firstPosition, scopeDescriptor, scopes;
      if (editor.getCursors) {
        firstPosition = editor.getCursors()[0].getBufferPosition();
        scopeDescriptor = editor.scopeDescriptorForBufferPosition(firstPosition);
        return scopes = scopeDescriptor.getScopesArray();
      } else {
        return scopes = [];
      }
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
