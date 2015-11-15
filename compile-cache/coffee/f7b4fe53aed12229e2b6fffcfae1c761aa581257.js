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
        "default": ['.*'],
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
      },
      builtinProviderBlacklist: {
        title: 'Built-In Provider Blacklist',
        description: 'Don\'t use the built-in provider for these selector(s).',
        type: 'string',
        "default": '.source.gfm',
        order: 11
      },
      backspaceTriggersAutocomplete: {
        title: 'Allow Backspace To Trigger Autocomplete',
        description: 'If enabled, typing `backspace` will show the suggestion list if suggestions are available. If disabled, suggestions will not be shown while backspacing.',
        type: 'boolean',
        "default": true,
        order: 12
      },
      suggestionListFollows: {
        title: 'Suggestions List Follows',
        description: 'With "Cursor" the suggestion list appears at the cursor\'s position. With "Word" it appers at the beginning of the word that\'s being completed.',
        type: 'string',
        "default": 'Cursor',
        "enum": ['Cursor', 'Word'],
        order: 13
      }
    },
    activate: function() {
      return this.getAutocompleteManager();
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
      deprecate('registerProviderForEditor and registerProviderForEditorView are no longer supported. Please switch to the new API: https://github.com/atom-community/autocomplete-plus/wiki/Provider-API');
      return this.getAutocompleteManager().providerManager.registerLegacyProvider(provider, '.' + (editor != null ? (_ref2 = editor.getGrammar()) != null ? _ref2.scopeName : void 0 : void 0));
    },
    unregisterProvider: function(provider) {
      var _ref;
      if (((_ref = this.getAutocompleteManager()) != null ? _ref.providerManager : void 0) == null) {
        return;
      }
      deprecate('unregisterProvider is no longer supported. Please switch to the new API: https://github.com/atom-community/autocomplete-plus/wiki/Provider-API');
      return this.getAutocompleteManager().providerManager.unregisterLegacyProvider(provider);
    },
    getAutocompleteManager: function() {
      var AutocompleteManager;
      if (this.activateTimeout != null) {
        clearTimeout(this.activateTimeout);
        this.activateTimeout = null;
      }
      if (this.autocompleteManager != null) {
        return this.autocompleteManager;
      }
      AutocompleteManager = require('./autocomplete-manager');
      this.autocompleteManager = new AutocompleteManager();
      return this.autocompleteManager;
    },
    Provider: Provider,
    Suggestion: Suggestion,
    consumeProvider: function(provider) {
      if ((provider != null ? provider.provider : void 0) == null) {
        return;
      }
      return this.getAutocompleteManager().providerManager.registerProvider(provider.provider);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtCQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBQVgsQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQURiLENBQUE7O0FBQUEsRUFFQyxZQUFhLE9BQUEsQ0FBUSxNQUFSLEVBQWIsU0FGRCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxvQkFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sK0JBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSx5TEFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxJQUhUO0FBQUEsUUFJQSxLQUFBLEVBQU8sQ0FKUDtPQURGO0FBQUEsTUFNQSxtQkFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sb0NBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSw4S0FEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxHQUhUO0FBQUEsUUFJQSxLQUFBLEVBQU8sQ0FKUDtPQVBGO0FBQUEsTUFZQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxxQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHlEQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLEVBSFQ7QUFBQSxRQUlBLEtBQUEsRUFBTyxDQUpQO09BYkY7QUFBQSxNQWtCQSxpQkFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sb0NBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSwrSEFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFFBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxLQUhU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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-plus/lib/main.coffee