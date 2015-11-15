(function() {
  var Provider, Suggestion, deprecate;

  Provider = require('./provider');

  Suggestion = require('./suggestion');

  deprecate = require('grim').deprecate;

  module.exports = {
    config: {
      enableAutoActivation: {
        title: 'Show Suggestions On Keystroke',
        description: 'Suggestions will show as you type if this preference is enabled. If it is disabled, you can still see suggestions by using the keymapping for autocomplete-plus:activate (shown below).',
        type: 'boolean',
        "default": true,
        order: 1
      },
      autoActivationDelay: {
        title: 'Delay Before Suggestions Are Shown',
        description: 'This prevents suggestions from being shown too frequently. Usually, the default works well. A lower value than the default has performance implications, and is not advised.',
        type: 'integer',
        "default": 100,
        order: 2
      },
      maxSuggestions: {
        title: 'Maximum Suggestions',
        description: 'The list of suggestions will be limited to this number.',
        type: 'integer',
        "default": 10,
        order: 3
      },
      confirmCompletion: {
        title: 'Keymap For Confirming A Suggestion',
        description: 'You should use the key(s) indicated here to confirm a suggestion from the suggestion list and have it inserted into the file.',
        type: 'string',
        "default": 'tab',
        "enum": ['tab', 'enter', 'tab and enter'],
        order: 4
      },
      navigateCompletions: {
        title: 'Keymap For Navigating The Suggestion List',
        description: 'You should use the keys indicated here to select suggestions in the suggestion list (moving up or down).',
        type: 'string',
        "default": 'up,down',
        "enum": ['up,down', 'ctrl-p,ctrl-n'],
        order: 5
      },
      fileBlacklist: {
        title: 'File Blacklist',
        description: 'Suggestions will not be provided for files matching this list.',
        type: 'array',
        "default": ['.*', '*.md'],
        items: {
          type: 'string'
        },
        order: 6
      },
      scopeBlacklist: {
        title: 'Scope Blacklist',
        description: 'Suggestions will not be provided for scopes matching this list. See: https://atom.io/docs/latest/advanced/scopes-and-scope-descriptors',
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        },
        order: 7
      },
      includeCompletionsFromAllBuffers: {
        title: 'Include Completions From All Buffers',
        description: 'For grammars with no registered provider(s), FuzzyProvider will include completions from all buffers, instead of just the buffer you are currently editing.',
        type: 'boolean',
        "default": false,
        order: 8
      },
      strictMatching: {
        title: 'Use Strict Matching For Built-In Provider',
        description: 'Fuzzy searching is performed if this is disabled; if it is enabled, suggestions must begin with the prefix from the current word.',
        type: 'boolean',
        "default": false,
        order: 9
      },
      enableBuiltinProvider: {
        title: 'Enable Built-In Provider',
        description: 'The package comes with a built-in provider that will provide suggestions using the words in your current buffer or all open buffers. You will get better suggestions by installing additional autocomplete+ providers. To stop using the built-in provider, disable this option.',
        type: 'boolean',
        "default": true,
        order: 10
      }
    },
    activate: function() {
      var AutocompleteManager;
      AutocompleteManager = require('./autocomplete-manager');
      return this.autocompleteManager = new AutocompleteManager();
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.autocompleteManager) != null) {
        _ref.dispose();
      }
      return this.autocompleteManager = null;
    },
    registerProviderForEditorView: function(provider, editorView) {
      return this.registerProviderForEditor(provider, editorView != null ? editorView.getModel() : void 0);
    },
    registerProviderForEditor: function(provider, editor) {
      var _ref, _ref1, _ref2;
      if (((_ref = this.autocompleteManager) != null ? _ref.providerManager : void 0) == null) {
        return;
      }
      if ((editor != null ? (_ref1 = editor.getGrammar()) != null ? _ref1.scopeName : void 0 : void 0) == null) {
        return;
      }
      deprecate('registerProviderForEditor and registerProviderForEditorView are no longer supported.\nUse [service-hub](https://github.com/atom/service-hub) instead:\n  ```\n  # Example:\n  provider =\n    requestHandler: (options) ->\n      # Build your suggestions here...\n\n      # Return your suggestions as an array of anonymous objects\n      [{\n        word: \'ohai\',\n        prefix: \'ohai\',\n        label: \'<span style=\'color: red\'>ohai</span>\',\n        renderLabelAsHtml: true,\n        className: \'ohai\'\n      }]\n    selector: \'.source.js,.source.coffee\' # This provider will be run on JavaScript and Coffee files\n    dispose: ->\n      # Your dispose logic here\n  registration = atom.services.provide(\'autocomplete.provider\', \'1.0.0\', {provider: provider})\n  ```');
      return this.autocompleteManager.providerManager.registerLegacyProvider(provider, '.' + (editor != null ? (_ref2 = editor.getGrammar()) != null ? _ref2.scopeName : void 0 : void 0));
    },
    unregisterProvider: function(provider) {
      var _ref;
      if (((_ref = this.autocompleteManager) != null ? _ref.providerManager : void 0) == null) {
        return;
      }
      deprecate('unregisterProvider is no longer supported.\nUse [service-hub](https://github.com/atom/service-hub) instead:\n  ```\n  # Example:\n  provider =\n    requestHandler: (options) ->\n      # Build your suggestions here...\n\n      # Return your suggestions as an array of anonymous objects\n      [{\n        word: \'ohai\',\n        prefix: \'ohai\',\n        label: \'<span style=\'color: red\'>ohai</span>\',\n        renderLabelAsHtml: true,\n        className: \'ohai\'\n      }]\n    selector: \'.source.js,.source.coffee\' # This provider will be run on JavaScript and Coffee files\n    dispose: ->\n      # Your dispose logic here\n  registration = atom.services.provide(\'autocomplete.provider\', \'1.0.0\', {provider: provider})\n  registration.dispose() # << unregisters your provider\n  ```');
      return this.autocompleteManager.providerManager.unregisterLegacyProvider(provider);
    },
    Provider: Provider,
    Suggestion: Suggestion
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtCQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBQVgsQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQURiLENBQUE7O0FBQUEsRUFFQyxZQUFhLE9BQUEsQ0FBUSxNQUFSLEVBQWIsU0FGRCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxvQkFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sK0JBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSx5TEFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxJQUhUO0FBQUEsUUFJQSxLQUFBLEVBQU8sQ0FKUDtPQURGO0FBQUEsTUFNQSxtQkFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sb0NBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSw4S0FEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxHQUhUO0FBQUEsUUFJQSxLQUFBLEVBQU8sQ0FKUDtPQVBGO0FBQUEsTUFZQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxxQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHlEQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLEVBSFQ7QUFBQSxRQUlBLEtBQUEsRUFBTyxDQUpQO09BYkY7QUFBQSxNQWtCQSxpQkFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sb0NBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSwrSEFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFFBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxLQUhUO0FBQUEsUUFJQSxNQUFBLEVBQU0sQ0FBQyxLQUFELEVBQVEsT0FBUixFQUFpQixlQUFqQixDQUpOO0FBQUEsUUFLQSxLQUFBLEVBQU8sQ0FMUDtPQW5CRjtBQUFBLE1BeUJBLG1CQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTywyQ0FBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLDBHQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLFNBSFQ7QUFBQSxRQUlBLE1BQUEsRUFBTSxDQUFDLFNBQUQsRUFBWSxlQUFaLENBSk47QUFBQSxRQUtBLEtBQUEsRUFBTyxDQUxQO09BMUJGO0FBQUEsTUFnQ0EsYUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sZ0JBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSxnRUFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLE9BRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxDQUFDLElBQUQsRUFBTyxNQUFQLENBSFQ7QUFBQSxRQUlBLEtBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0FMRjtBQUFBLFFBTUEsS0FBQSxFQUFPLENBTlA7T0FqQ0Y7QUFBQSxNQXdDQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxpQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHdJQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sT0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLEVBSFQ7QUFBQSxRQUlBLEtBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0FMRjtBQUFBLFFBTUEsS0FBQSxFQUFPLENBTlA7T0F6Q0Y7QUFBQSxNQWdEQSxnQ0FBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sc0NBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSw2SkFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxLQUhUO0FBQUEsUUFJQSxLQUFBLEVBQU8sQ0FKUDtPQWpERjtBQUFBLE1Bc0RBLGNBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLDJDQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsbUlBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsS0FIVDtBQUFBLFFBSUEsS0FBQSxFQUFPLENBSlA7T0F2REY7QUFBQSxNQTREQSxxQkFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sMEJBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSxrUkFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxJQUhUO0FBQUEsUUFJQSxLQUFBLEVBQU8sRUFKUDtPQTdERjtLQURGO0FBQUEsSUFxRUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsbUJBQUE7QUFBQSxNQUFBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSx3QkFBUixDQUF0QixDQUFBO2FBQ0EsSUFBQyxDQUFBLG1CQUFELEdBQTJCLElBQUEsbUJBQUEsQ0FBQSxFQUZuQjtJQUFBLENBckVWO0FBQUEsSUEwRUEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsSUFBQTs7WUFBb0IsQ0FBRSxPQUF0QixDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsbUJBQUQsR0FBdUIsS0FGYjtJQUFBLENBMUVaO0FBQUEsSUE4RUEsNkJBQUEsRUFBK0IsU0FBQyxRQUFELEVBQVcsVUFBWCxHQUFBO2FBQzdCLElBQUMsQ0FBQSx5QkFBRCxDQUEyQixRQUEzQix1QkFBcUMsVUFBVSxDQUFFLFFBQVosQ0FBQSxVQUFyQyxFQUQ2QjtJQUFBLENBOUUvQjtBQUFBLElBc0ZBLHlCQUFBLEVBQTJCLFNBQUMsUUFBRCxFQUFXLE1BQVgsR0FBQTtBQUN6QixVQUFBLGtCQUFBO0FBQUEsTUFBQSxJQUFjLG1GQUFkO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFDQSxNQUFBLElBQWMsb0dBQWQ7QUFBQSxjQUFBLENBQUE7T0FEQTtBQUFBLE1BRUEsU0FBQSxDQUFVLGd4QkFBVixDQUZBLENBQUE7QUF5QkEsYUFBTyxJQUFDLENBQUEsbUJBQW1CLENBQUMsZUFBZSxDQUFDLHNCQUFyQyxDQUE0RCxRQUE1RCxFQUFzRSxHQUFBLGtFQUEwQixDQUFFLDRCQUFsRyxDQUFQLENBMUJ5QjtJQUFBLENBdEYzQjtBQUFBLElBcUhBLGtCQUFBLEVBQW9CLFNBQUMsUUFBRCxHQUFBO0FBQ2xCLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBYyxtRkFBZDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxTQUFBLENBQVUsK3hCQUFWLENBREEsQ0FBQTthQXlCQSxJQUFDLENBQUEsbUJBQW1CLENBQUMsZUFBZSxDQUFDLHdCQUFyQyxDQUE4RCxRQUE5RCxFQTFCa0I7SUFBQSxDQXJIcEI7QUFBQSxJQWlKQSxRQUFBLEVBQVUsUUFqSlY7QUFBQSxJQWtKQSxVQUFBLEVBQVksVUFsSlo7R0FMRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-plus/lib/main.coffee