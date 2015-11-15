(function() {
  var AutocompleteManager, Provider, Suggestion, deprecate, _;

  _ = require('underscore-plus');

  AutocompleteManager = require('./autocomplete-manager');

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
      deprecate("registerProviderForEditor and registerProviderForEditorView are no longer supported.\nUse [service-hub](https://github.com/atom/service-hub) instead:\n  ```\n  # Example:\n  provider =\n    requestHandler: (options) ->\n      # Build your suggestions here...\n\n      # Return your suggestions as an array of anonymous objects\n      [{\n        word: 'ohai',\n        prefix: 'ohai',\n        label: '<span style=\"color: red\">ohai</span>',\n        renderLabelAsHtml: true,\n        className: 'ohai'\n      }]\n    selector: '.source.js,.source.coffee' # This provider will be run on JavaScript and Coffee files\n    dispose: ->\n      # Your dispose logic here\n  registration = atom.services.provide('autocomplete.provider', '1.0.0', {provider: provider})\n  ```");
      return this.autocompleteManager.providerManager.registerLegacyProvider(provider, '.' + (editor != null ? (_ref2 = editor.getGrammar()) != null ? _ref2.scopeName : void 0 : void 0));
    },
    unregisterProvider: function(provider) {
      var _ref;
      if (((_ref = this.autocompleteManager) != null ? _ref.providerManager : void 0) == null) {
        return;
      }
      deprecate("unregisterProvider is no longer supported.\nUse [service-hub](https://github.com/atom/service-hub) instead:\n  ```\n  # Example:\n  provider =\n    requestHandler: (options) ->\n      # Build your suggestions here...\n\n      # Return your suggestions as an array of anonymous objects\n      [{\n        word: 'ohai',\n        prefix: 'ohai',\n        label: '<span style=\"color: red\">ohai</span>',\n        renderLabelAsHtml: true,\n        className: 'ohai'\n      }]\n    selector: '.source.js,.source.coffee' # This provider will be run on JavaScript and Coffee files\n    dispose: ->\n      # Your dispose logic here\n  registration = atom.services.provide('autocomplete.provider', '1.0.0', {provider: provider})\n  registration.dispose() # << unregisters your provider\n  ```");
      return this.autocompleteManager.providerManager.unregisterLegacyProvider(provider);
    },
    Provider: Provider,
    Suggestion: Suggestion
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVEQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsd0JBQVIsQ0FEdEIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUZYLENBQUE7O0FBQUEsRUFHQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FIYixDQUFBOztBQUFBLEVBSUMsWUFBYSxPQUFBLENBQVEsTUFBUixFQUFiLFNBSkQsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsb0JBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLCtCQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEseUxBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsSUFIVDtBQUFBLFFBSUEsS0FBQSxFQUFPLENBSlA7T0FERjtBQUFBLE1BTUEsbUJBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLG9DQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsOEtBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsR0FIVDtBQUFBLFFBSUEsS0FBQSxFQUFPLENBSlA7T0FQRjtBQUFBLE1BWUEsY0FBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8scUJBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSx5REFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxFQUhUO0FBQUEsUUFJQSxLQUFBLEVBQU8sQ0FKUDtPQWJGO0FBQUEsTUFrQkEsaUJBQUEsRUFDRTtBQUFB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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-plus/lib/main.coffee