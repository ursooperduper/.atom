(function() {
  var CompositeDisposable, Disposable, Emitter, FuzzyProvider, Provider, ProviderManager, ScopedPropertyStore, Suggestion, Uuid, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('event-kit'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable, Emitter = _ref.Emitter;

  ScopedPropertyStore = require('scoped-property-store');

  _ = require('underscore-plus');

  Uuid = require('node-uuid');

  FuzzyProvider = require('./fuzzy-provider');

  Suggestion = require('./suggestion');

  Provider = require('./provider');

  module.exports = ProviderManager = (function() {
    ProviderManager.prototype.fuzzyProvider = null;

    ProviderManager.prototype.fuzzyRegistration = null;

    ProviderManager.prototype.store = null;

    ProviderManager.prototype.subscriptions = null;

    ProviderManager.prototype.legacyProviderRegistrations = null;

    ProviderManager.prototype.globalBlacklist = null;

    function ProviderManager() {
      this.unregisterLegacyProvider = __bind(this.unregisterLegacyProvider, this);
      this.shimLegacyProvider = __bind(this.shimLegacyProvider, this);
      this.registerLegacyProvider = __bind(this.registerLegacyProvider, this);
      this.registerProvider = __bind(this.registerProvider, this);
      this.consumeApi = __bind(this.consumeApi, this);
      this.removeProvider = __bind(this.removeProvider, this);
      this.providerUuid = __bind(this.providerUuid, this);
      this.isLegacyProvider = __bind(this.isLegacyProvider, this);
      this.isValidProvider = __bind(this.isValidProvider, this);
      this.addProvider = __bind(this.addProvider, this);
      this.setGlobalBlacklist = __bind(this.setGlobalBlacklist, this);
      this.toggleFuzzyProvider = __bind(this.toggleFuzzyProvider, this);
      this.providersForScopeChain = __bind(this.providersForScopeChain, this);
      this.subscriptions = new CompositeDisposable;
      this.globalBlacklist = new CompositeDisposable;
      this.legacyProviderRegistrations = new WeakMap();
      this.providers = new Map();
      this.store = new ScopedPropertyStore;
      this.subscriptions.add(atom.config.observe('autocomplete-plus.enableBuiltinProvider', (function(_this) {
        return function(value) {
          return _this.toggleFuzzyProvider(value);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('autocomplete-plus.scopeBlacklist', (function(_this) {
        return function(value) {
          return _this.setGlobalBlacklist(value);
        };
      })(this)));
      this.consumeApi();
    }

    ProviderManager.prototype.dispose = function() {
      var _ref1, _ref2, _ref3, _ref4, _ref5;
      this.toggleFuzzyProvider(false);
      if ((_ref1 = this.globalBlacklist) != null) {
        _ref1.dispose();
      }
      this.globalBlacklist = null;
      this.blacklist = null;
      if ((_ref2 = this.subscriptions) != null) {
        _ref2.dispose();
      }
      this.subscriptions = null;
      if ((_ref3 = this.store) != null) {
        _ref3.cache = {};
      }
      if ((_ref4 = this.store) != null) {
        _ref4.propertySets = [];
      }
      this.store = null;
      if ((_ref5 = this.providers) != null) {
        _ref5.clear();
      }
      this.providers = null;
      return this.legacyProviderRegistrations = null;
    };

    ProviderManager.prototype.providersForScopeChain = function(scopeChain) {
      var blacklist, blacklistedProviders, fuzzyProviderBlacklisted, providers;
      if (scopeChain == null) {
        return [];
      }
      if (this.store == null) {
        return [];
      }
      providers = [];
      if (_.contains(this.blacklist, scopeChain)) {
        return [];
      }
      providers = this.store.getAll(scopeChain);
      blacklist = _.chain(providers).map(function(p) {
        return p.value.globalBlacklist;
      }).filter(function(p) {
        return (p != null) && p === true;
      }).value();
      if ((blacklist != null) && blacklist.length) {
        return [];
      }
      blacklistedProviders = _.chain(providers).filter(function(p) {
        return (p.value.blacklisted != null) && p.value.blacklisted === true;
      }).map(function(p) {
        return p.value.provider;
      }).value();
      if (this.fuzzyProvider != null) {
        fuzzyProviderBlacklisted = _.chain(providers).filter(function(p) {
          return (p.value.providerblacklisted != null) && p.value.providerblacklisted === 'autocomplete-plus-fuzzyprovider';
        }).map(function(p) {
          return p.value.provider;
        }).value();
      }
      providers = _.chain(providers).filter(function(p) {
        return p.value.blacklisted == null;
      }).sortBy(function(p) {
        return -p.scopeSelector.length;
      }).map(function(p) {
        return p.value.provider;
      }).uniq().difference(blacklistedProviders).value();
      if ((fuzzyProviderBlacklisted != null) && fuzzyProviderBlacklisted.length && (this.fuzzyProvider != null)) {
        providers = _.without(providers, this.fuzzyProvider);
      }
      return providers;
    };

    ProviderManager.prototype.toggleFuzzyProvider = function(enabled) {
      if (enabled == null) {
        return;
      }
      if (enabled) {
        if ((this.fuzzyProvider != null) || (this.fuzzyRegistration != null)) {
          return;
        }
        this.fuzzyProvider = new FuzzyProvider();
        return this.fuzzyRegistration = this.registerProvider(this.fuzzyProvider);
      } else {
        if (this.fuzzyRegistration != null) {
          this.fuzzyRegistration.dispose();
        }
        if (this.fuzzyProvider != null) {
          this.fuzzyProvider.dispose();
        }
        this.fuzzyRegistration = null;
        return this.fuzzyProvider = null;
      }
    };

    ProviderManager.prototype.setGlobalBlacklist = function(blacklist) {
      var properties, registration;
      this.blacklist = blacklist;
      if (this.globalBlacklist != null) {
        this.globalBlacklist.dispose();
      }
      this.globalBlacklist = new CompositeDisposable;
      if (this.blacklist == null) {
        this.blacklist = [];
      }
      if (!this.blacklist.length) {
        return;
      }
      properties = {};
      properties[blacklist.join(',')] = {
        globalBlacklist: true
      };
      registration = this.store.addProperties('globalblacklist', properties);
      return this.globalBlacklist.add(registration);
    };

    ProviderManager.prototype.addProvider = function(provider) {
      var _ref1;
      if (!this.isValidProvider(provider)) {
        return;
      }
      if (!this.providers.has(provider)) {
        this.providers.set(provider, Uuid.v4());
      }
      if ((provider.dispose != null) && !_.contains((_ref1 = this.subscriptions) != null ? _ref1.disposables : void 0, provider)) {
        return this.subscriptions.add(provider);
      }
    };

    ProviderManager.prototype.isValidProvider = function(provider) {
      return (provider != null) && (provider.requestHandler != null) && typeof provider.requestHandler === 'function' && (provider.selector != null) && provider.selector !== '' && provider.selector !== false;
    };

    ProviderManager.prototype.isLegacyProvider = function(provider) {
      return (provider != null) && provider instanceof Provider;
    };

    ProviderManager.prototype.providerUuid = function(provider) {
      if (provider == null) {
        return false;
      }
      if (!this.providers.has(provider)) {
        return false;
      }
      return this.providers.get(provider);
    };

    ProviderManager.prototype.removeProvider = function(provider) {
      var _ref1, _ref2;
      if (!this.isValidProvider(provider)) {
        return;
      }
      if ((_ref1 = this.providers) != null ? _ref1.has(provider) : void 0) {
        this.providers["delete"](provider);
      }
      if ((provider.dispose != null) && _.contains((_ref2 = this.subscriptions) != null ? _ref2.disposables : void 0, provider)) {
        return this.subscriptions.remove(provider);
      }
    };

    ProviderManager.prototype.consumeApi = function() {
      return this.subscriptions.add(atom.services.consume('autocomplete.provider', '1.0.0', (function(_this) {
        return function(provider) {
          if ((provider != null ? provider.provider : void 0) == null) {
            return;
          }
          return _this.registerProvider(provider.provider);
        };
      })(this)));
    };

    ProviderManager.prototype.registerProvider = function(provider) {
      var blacklist, blacklistRegistration, blacklistid, blacklistproperties, id, properties, providerblacklist, providerblacklistRegistration, providerblacklistid, providerblacklistproperties, registration, selectors, _ref1, _ref2, _ref3;
      if (!this.isValidProvider(provider)) {
        return;
      }
      this.addProvider(provider);
      id = this.providerUuid(provider);
      if (id == null) {
        this.removeProvider(provider);
      }
      if (id == null) {
        return;
      }
      selectors = provider.selector.split(',');
      selectors = _.reject(selectors, (function(_this) {
        return function(s) {
          var p;
          p = _this.store.propertiesForSourceAndSelector(id, s);
          return (p != null) && (p.provider != null);
        };
      })(this));
      if (!selectors.length) {
        return;
      }
      properties = {};
      properties[selectors.join(',')] = {
        provider: provider
      };
      registration = this.store.addProperties(id, properties);
      blacklistRegistration = null;
      if ((_ref1 = provider.blacklist) != null ? _ref1.length : void 0) {
        blacklistid = id + '-blacklist';
        blacklist = provider.blacklist.split(',');
        blacklist = _.reject(blacklist, (function(_this) {
          return function(s) {
            var p;
            p = _this.store.propertiesForSourceAndSelector(blacklistid, s);
            return (p != null) && (p.provider != null) && (p.blacklisted != null) && p.blacklisted;
          };
        })(this));
        if (blacklist.length) {
          blacklistproperties = {};
          blacklistproperties[blacklist.join(',')] = {
            provider: provider,
            blacklisted: true
          };
          blacklistRegistration = this.store.addProperties(blacklistid, blacklistproperties);
        }
      }
      if ((_ref2 = provider.providerblacklist) != null ? (_ref3 = _ref2['autocomplete-plus-fuzzyprovider']) != null ? _ref3.length : void 0 : void 0) {
        providerblacklistid = id + '-providerblacklist';
        providerblacklist = provider.providerblacklist['autocomplete-plus-fuzzyprovider'].split(',');
        providerblacklist = _.reject(providerblacklist, (function(_this) {
          return function(s) {
            var p;
            p = _this.store.propertiesForSourceAndSelector(providerblacklistid, s);
            return (p != null) && (p.provider != null) && (p.providerblacklisted != null) && p.providerblacklisted === 'autocomplete-plus-fuzzyprovider';
          };
        })(this));
        if (providerblacklist.length) {
          providerblacklistproperties = {};
          providerblacklistproperties[providerblacklist.join(',')] = {
            provider: provider,
            providerblacklisted: 'autocomplete-plus-fuzzyprovider'
          };
          providerblacklistRegistration = this.store.addProperties(providerblacklistid, providerblacklistproperties);
        }
      }
      if (provider.dispose != null) {
        provider.dispose = _.wrap(provider.dispose, (function(_this) {
          return function(f) {
            if (typeof f === "function") {
              f();
            }
            if (registration != null) {
              registration.dispose();
            }
            if (blacklistRegistration != null) {
              blacklistRegistration.dispose();
            }
            if (typeof providerblacklistRegistation !== "undefined" && providerblacklistRegistation !== null) {
              providerblacklistRegistation.dispose();
            }
            return _this.removeProvider(provider);
          };
        })(this));
      }
      return new Disposable((function(_this) {
        return function() {
          if (registration != null) {
            registration.dispose();
          }
          if (blacklistRegistration != null) {
            blacklistRegistration.dispose();
          }
          if (typeof providerblacklistRegistation !== "undefined" && providerblacklistRegistation !== null) {
            providerblacklistRegistation.dispose();
          }
          return _this.removeProvider(provider);
        };
      })(this));
    };

    ProviderManager.prototype.registerLegacyProvider = function(legacyProvider, selector) {
      var legacyProviderRegistration;
      if (legacyProvider == null) {
        return;
      }
      if (!((selector != null) && selector.trim() !== '')) {
        return;
      }
      legacyProviderRegistration = this.legacyProviderRegistrations.get(legacyProvider.constructor);
      if (legacyProviderRegistration) {
        legacyProviderRegistration.service.dispose();
        if (legacyProviderRegistration.selectors.indexOf(selector) < 0) {
          legacyProviderRegistration.selectors.push(selector);
        }
      } else {
        legacyProviderRegistration = {
          selectors: [selector]
        };
        this.legacyProviderRegistrations.set(legacyProvider.constructor, legacyProviderRegistration);
      }
      selector = legacyProviderRegistration.selectors.join(',');
      legacyProviderRegistration.shim = this.shimLegacyProvider(legacyProvider, selector);
      legacyProviderRegistration.service = this.registerProvider(legacyProviderRegistration.shim);
      return legacyProviderRegistration.service;
    };

    ProviderManager.prototype.shimLegacyProvider = function(legacyProvider, selector) {
      var shim;
      if (!legacyProvider.buildSuggestionsShim) {
        legacyProvider.buildSuggestionsShim = Provider.prototype.buildSuggestionsShim;
      }
      shim = {
        legacyProvider: legacyProvider,
        requestHandler: legacyProvider.buildSuggestionsShim,
        selector: selector,
        dispose: function() {
          var requestHandler;
          requestHandler = null;
          if (legacyProvider.dispose != null) {
            legacyProvider.dispose();
          }
          legacyProvider = null;
          return selector = null;
        }
      };
      return shim;
    };

    ProviderManager.prototype.unregisterLegacyProvider = function(legacyProvider) {
      var legacyProviderRegistration;
      if (legacyProvider == null) {
        return;
      }
      legacyProviderRegistration = this.legacyProviderRegistrations.get(legacyProvider.constructor);
      if (legacyProviderRegistration) {
        legacyProviderRegistration.service.dispose();
        return this.legacyProviderRegistrations["delete"](legacyProvider.constructor);
      }
    };

    return ProviderManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtJQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUE2QyxPQUFBLENBQVEsV0FBUixDQUE3QyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGtCQUFBLFVBQXRCLEVBQWtDLGVBQUEsT0FBbEMsQ0FBQTs7QUFBQSxFQUNBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSx1QkFBUixDQUR0QixDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUZKLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFdBQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsYUFBQSxHQUFnQixPQUFBLENBQVEsa0JBQVIsQ0FKaEIsQ0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQUxiLENBQUE7O0FBQUEsRUFNQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FOWCxDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDhCQUFBLGFBQUEsR0FBZSxJQUFmLENBQUE7O0FBQUEsOEJBQ0EsaUJBQUEsR0FBbUIsSUFEbkIsQ0FBQTs7QUFBQSw4QkFFQSxLQUFBLEdBQU8sSUFGUCxDQUFBOztBQUFBLDhCQUdBLGFBQUEsR0FBZSxJQUhmLENBQUE7O0FBQUEsOEJBSUEsMkJBQUEsR0FBNkIsSUFKN0IsQ0FBQTs7QUFBQSw4QkFLQSxlQUFBLEdBQWlCLElBTGpCLENBQUE7O0FBT2EsSUFBQSx5QkFBQSxHQUFBO0FBQ1gsaUZBQUEsQ0FBQTtBQUFBLHFFQUFBLENBQUE7QUFBQSw2RUFBQSxDQUFBO0FBQUEsaUVBQUEsQ0FBQTtBQUFBLHFEQUFBLENBQUE7QUFBQSw2REFBQSxDQUFBO0FBQUEseURBQUEsQ0FBQTtBQUFBLGlFQUFBLENBQUE7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
//# sourceURL=/Users/sarah/.atom/packages/autocomplete-plus/lib/provider-manager.coffee