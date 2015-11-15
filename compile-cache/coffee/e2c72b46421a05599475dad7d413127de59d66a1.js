(function() {
  var $, Config, Editor, EditorComponent, EditorView, Grim, KeymapManager, Point, Project, TokenizedBuffer, Workspace, WorkspaceView, addCustomMatchers, clipboard, emitObject, ensureNoDeprecatedFunctionsCalled, ensureNoPathSubscriptions, fixturePackagesPath, fs, isCoreSpec, keyBindingsToRestore, path, pathwatcher, resourcePath, specDirectory, specPackageName, specPackagePath, specProjectPath, _, _ref, _ref1, _ref2,
    __slice = [].slice;

  require('../src/window');

  atom.initialize();

  atom.restoreWindowDimensions();

  require('../vendor/jasmine-jquery');

  path = require('path');

  _ = require('underscore-plus');

  fs = require('fs-plus');

  Grim = require('grim');

  KeymapManager = require('../src/keymap-extensions');

  _ref = require('atom'), $ = _ref.$, WorkspaceView = _ref.WorkspaceView, Workspace = _ref.Workspace;

  Config = require('../src/config');

  Point = require('text-buffer').Point;

  Project = require('../src/project');

  Editor = require('../src/editor');

  EditorView = require('../src/editor-view');

  TokenizedBuffer = require('../src/tokenized-buffer');

  EditorComponent = require('../src/editor-component');

  pathwatcher = require('pathwatcher');

  clipboard = require('clipboard');

  atom.themes.loadBaseStylesheets();

  atom.themes.requireStylesheet('../static/jasmine');

  atom.themes.initialLoadComplete = true;

  fixturePackagesPath = path.resolve(__dirname, './fixtures/packages');

  atom.packages.packageDirPaths.unshift(fixturePackagesPath);

  atom.keymaps.loadBundledKeymaps();

  keyBindingsToRestore = atom.keymaps.getKeyBindings();

  $(window).on('core:close', function() {
    return window.close();
  });

  $(window).on('beforeunload', function() {
    atom.storeWindowDimensions();
    return atom.saveSync();
  });

  $('html,body').css('overflow', 'auto');

  jasmine.getEnv().addEqualityTester(_.isEqual);

  if (process.platform === 'win32' && process.env.JANKY_SHA1) {
    jasmine.getEnv().defaultTimeoutInterval = 60000;
  } else {
    jasmine.getEnv().defaultTimeoutInterval = 5000;
  }

  specPackageName = null;

  specPackagePath = null;

  specProjectPath = null;

  isCoreSpec = false;

  _ref1 = atom.getLoadSettings(), specDirectory = _ref1.specDirectory, resourcePath = _ref1.resourcePath;

  if (specDirectory) {
    specPackagePath = path.resolve(specDirectory, '..');
    try {
      specPackageName = (_ref2 = JSON.parse(fs.readFileSync(path.join(specPackagePath, 'package.json')))) != null ? _ref2.name : void 0;
    } catch (_error) {}
    specProjectPath = path.join(specDirectory, 'fixtures');
  }

  isCoreSpec = specDirectory === fs.realpathSync(__dirname);

  beforeEach(function() {
    var clipboardContent, config, projectPath, resolvePackagePath, serializedWindowState, spy;
    if (isCoreSpec) {
      Grim.clearDeprecations();
    }
    $.fx.off = true;
    projectPath = specProjectPath != null ? specProjectPath : path.join(this.specDirectory, 'fixtures');
    atom.project = new Project({
      path: projectPath
    });
    atom.workspace = new Workspace();
    atom.keymaps.keyBindings = _.clone(keyBindingsToRestore);
    window.resetTimeouts();
    atom.packages.packageStates = {};
    serializedWindowState = null;
    spyOn(atom, 'saveSync');
    atom.syntax.clearGrammarOverrides();
    atom.syntax.clearProperties();
    spy = spyOn(atom.packages, 'resolvePackagePath').andCallFake(function(packageName) {
      if (specPackageName && packageName === specPackageName) {
        return resolvePackagePath(specPackagePath);
      } else {
        return resolvePackagePath(packageName);
      }
    });
    resolvePackagePath = _.bind(spy.originalValue, atom.packages);
    spyOn(atom.menu, 'sendToBrowserProcess');
    config = new Config({
      resourcePath: resourcePath,
      configDirPath: atom.getConfigDirPath()
    });
    spyOn(config, 'load');
    spyOn(config, 'save');
    config.setDefaults('core', WorkspaceView.configDefaults);
    config.setDefaults('editor', EditorView.configDefaults);
    config.set("core.destroyEmptyPanes", false);
    config.set("editor.fontFamily", "Courier");
    config.set("editor.fontSize", 16);
    config.set("editor.autoIndent", false);
    config.set("core.disabledPackages", ["package-that-throws-an-exception", "package-with-broken-package-json", "package-with-broken-keymap"]);
    config.save.reset();
    atom.config = config;
    spyOn(EditorView.prototype, 'requestDisplayUpdate').andCallFake(function() {
      return this.updateDisplay();
    });
    EditorComponent.performSyncUpdates = true;
    spyOn(WorkspaceView.prototype, 'setTitle').andCallFake(function(title) {
      this.title = title;
    });
    spyOn(window, "setTimeout").andCallFake(window.fakeSetTimeout);
    spyOn(window, "clearTimeout").andCallFake(window.fakeClearTimeout);
    spyOn(pathwatcher.File.prototype, "detectResurrectionAfterDelay").andCallFake(function() {
      return this.detectResurrection();
    });
    spyOn(Editor.prototype, "shouldPromptToSave").andReturn(false);
    TokenizedBuffer.prototype.chunkSize = Infinity;
    spyOn(TokenizedBuffer.prototype, "tokenizeInBackground").andCallFake(function() {
      return this.tokenizeNextChunk();
    });
    clipboardContent = 'initial clipboard content';
    spyOn(clipboard, 'writeText').andCallFake(function(text) {
      return clipboardContent = text;
    });
    spyOn(clipboard, 'readText').andCallFake(function() {
      return clipboardContent;
    });
    return addCustomMatchers(this);
  });

  afterEach(function() {
    var _ref3, _ref4;
    atom.packages.deactivatePackages();
    atom.menu.template = [];
    if ((_ref3 = atom.workspaceView) != null) {
      if (typeof _ref3.remove === "function") {
        _ref3.remove();
      }
    }
    atom.workspaceView = null;
    delete atom.state.workspace;
    if ((_ref4 = atom.project) != null) {
      _ref4.destroy();
    }
    atom.project = null;
    atom.themes.removeStylesheet('global-editor-styles');
    delete atom.state.packageStates;
    if (!window.debugContent) {
      $('#jasmine-content').empty();
    }
    jasmine.unspy(atom, 'saveSync');
    ensureNoPathSubscriptions();
    atom.syntax.clearObservers();
    return waits(0);
  });

  ensureNoPathSubscriptions = function() {
    var watchedPaths;
    watchedPaths = pathwatcher.getWatchedPaths();
    pathwatcher.closeAllWatchers();
    if (watchedPaths.length > 0) {
      throw new Error("Leaking subscriptions for paths: " + watchedPaths.join(", "));
    }
  };

  ensureNoDeprecatedFunctionsCalled = function() {
    var deprecations, error, originalPrepareStackTrace;
    deprecations = Grim.getDeprecations();
    if (deprecations.length > 0) {
      originalPrepareStackTrace = Error.prepareStackTrace;
      Error.prepareStackTrace = function(error, stack) {
        var deprecation, functionName, location, output, _i, _j, _k, _len, _len1, _len2, _ref3, _ref4;
        output = [];
        for (_i = 0, _len = deprecations.length; _i < _len; _i++) {
          deprecation = deprecations[_i];
          output.push("" + deprecation.originName + " is deprecated. " + deprecation.message);
          output.push(_.multiplyString("-", output[output.length - 1].length));
          _ref3 = deprecation.getStacks();
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            stack = _ref3[_j];
            for (_k = 0, _len2 = stack.length; _k < _len2; _k++) {
              _ref4 = stack[_k], functionName = _ref4.functionName, location = _ref4.location;
              output.push("" + functionName + " -- " + location);
            }
          }
          output.push("");
        }
        return output.join("\n");
      };
      error = new Error("Deprecated function(s) " + (deprecations.map(function(_arg) {
        var originName;
        originName = _arg.originName;
        return originName;
      }).join(', ')) + ") were called.");
      error.stack;
      Error.prepareStackTrace = originalPrepareStackTrace;
      throw error;
    }
  };

  emitObject = jasmine.StringPrettyPrinter.prototype.emitObject;

  jasmine.StringPrettyPrinter.prototype.emitObject = function(obj) {
    if (obj.inspect) {
      return this.append(obj.inspect());
    } else {
      return emitObject.call(this, obj);
    }
  };

  jasmine.unspy = function(object, methodName) {
    if (!object[methodName].hasOwnProperty('originalValue')) {
      throw new Error("Not a spy");
    }
    return object[methodName] = object[methodName].originalValue;
  };

  addCustomMatchers = function(spec) {
    return spec.addMatchers({
      toBeInstanceOf: function(expected) {
        var notText;
        notText = this.isNot ? " not" : "";
        this.message = (function(_this) {
          return function() {
            return "Expected " + (jasmine.pp(_this.actual)) + " to" + notText + " be instance of " + expected.name + " class";
          };
        })(this);
        return this.actual instanceof expected;
      },
      toHaveLength: function(expected) {
        var notText;
        if (this.actual == null) {
          this.message = (function(_this) {
            return function() {
              return "Expected object " + _this.actual + " has no length method";
            };
          })(this);
          return false;
        } else {
          notText = this.isNot ? " not" : "";
          this.message = (function(_this) {
            return function() {
              return "Expected object with length " + _this.actual.length + " to" + notText + " have length " + expected;
            };
          })(this);
          return this.actual.length === expected;
        }
      },
      toExistOnDisk: function(expected) {
        var notText;
        notText = this.isNot && " not" || "";
        this.message = function() {
          return "Expected path '" + this.actual + "'" + notText + " to exist.";
        };
        return fs.existsSync(this.actual);
      },
      toHaveFocus: function() {
        var element, notText;
        notText = this.isNot && " not" || "";
        if (!document.hasFocus()) {
          console.error("Specs will fail because the Dev Tools have focus. To fix this close the Dev Tools or click the spec runner.");
        }
        this.message = function() {
          return "Expected element '" + this.actual + "' or its descendants" + notText + " to have focus.";
        };
        element = this.actual;
        if (element.jquery) {
          element = element.get(0);
        }
        return element.webkitMatchesSelector(":focus") || element.querySelector(":focus");
      },
      toShow: function() {
        var element, notText, _ref3;
        notText = this.isNot ? " not" : "";
        element = this.actual;
        if (element.jquery) {
          element = element.get(0);
        }
        this.message = function() {
          return "Expected element '" + element + "' or its descendants " + notText + " to show.";
        };
        return (_ref3 = element.style.display) === 'block' || _ref3 === 'inline-block' || _ref3 === 'static' || _ref3 === 'fixed';
      }
    });
  };

  window.keyIdentifierForKey = function(key) {
    var charCode;
    if (key.length > 1) {
      return key;
    } else {
      charCode = key.toUpperCase().charCodeAt(0);
      return "U+00" + charCode.toString(16);
    }
  };

  window.keydownEvent = function(key, properties) {
    var originalEvent, originalEventProperties, _ref3, _ref4;
    if (properties == null) {
      properties = {};
    }
    originalEventProperties = {};
    originalEventProperties.ctrl = properties.ctrlKey;
    originalEventProperties.alt = properties.altKey;
    originalEventProperties.shift = properties.shiftKey;
    originalEventProperties.cmd = properties.metaKey;
    originalEventProperties.target = (_ref3 = (_ref4 = properties.target) != null ? _ref4[0] : void 0) != null ? _ref3 : properties.target;
    originalEventProperties.which = properties.which;
    originalEvent = KeymapManager.keydownEvent(key, originalEventProperties);
    properties = $.extend({
      originalEvent: originalEvent
    }, properties);
    return $.Event("keydown", properties);
  };

  window.mouseEvent = function(type, properties) {
    var editorView, left, point, top, _ref3;
    if (properties.point) {
      point = properties.point, editorView = properties.editorView;
      _ref3 = this.pagePixelPositionForPoint(editorView, point), top = _ref3.top, left = _ref3.left;
      properties.pageX = left + 1;
      properties.pageY = top + 1;
    }
    if (properties.originalEvent == null) {
      properties.originalEvent = {
        detail: 1
      };
    }
    return $.Event(type, properties);
  };

  window.clickEvent = function(properties) {
    if (properties == null) {
      properties = {};
    }
    return window.mouseEvent("click", properties);
  };

  window.mousedownEvent = function(properties) {
    if (properties == null) {
      properties = {};
    }
    return window.mouseEvent('mousedown', properties);
  };

  window.mousemoveEvent = function(properties) {
    if (properties == null) {
      properties = {};
    }
    return window.mouseEvent('mousemove', properties);
  };

  window.waitsForPromise = function() {
    var args, fn, shouldReject, timeout, _ref3;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (args.length > 1) {
      _ref3 = args[0], shouldReject = _ref3.shouldReject, timeout = _ref3.timeout;
    } else {
      shouldReject = false;
    }
    fn = _.last(args);
    return window.waitsFor(timeout, function(moveOn) {
      var promise;
      promise = fn();
      if (shouldReject) {
        promise.fail(moveOn);
        return promise.done(function() {
          jasmine.getEnv().currentSpec.fail("Expected promise to be rejected, but it was resolved");
          return moveOn();
        });
      } else {
        promise.done(moveOn);
        return promise.fail(function(error) {
          jasmine.getEnv().currentSpec.fail("Expected promise to be resolved, but it was rejected with " + (jasmine.pp(error)));
          return moveOn();
        });
      }
    });
  };

  window.resetTimeouts = function() {
    window.now = 0;
    window.timeoutCount = 0;
    window.intervalCount = 0;
    window.timeouts = [];
    return window.intervalTimeouts = {};
  };

  window.fakeSetTimeout = function(callback, ms) {
    var id;
    id = ++window.timeoutCount;
    window.timeouts.push([id, window.now + ms, callback]);
    return id;
  };

  window.fakeClearTimeout = function(idToClear) {
    return window.timeouts = window.timeouts.filter(function(_arg) {
      var id;
      id = _arg[0];
      return id !== idToClear;
    });
  };

  window.fakeSetInterval = function(callback, ms) {
    var action, id;
    id = ++window.intervalCount;
    action = function() {
      callback();
      return window.intervalTimeouts[id] = window.fakeSetTimeout(action, ms);
    };
    window.intervalTimeouts[id] = window.fakeSetTimeout(action, ms);
    return id;
  };

  window.fakeClearInterval = function(idToClear) {
    return window.fakeClearTimeout(this.intervalTimeouts[idToClear]);
  };

  window.advanceClock = function(delta) {
    var callback, callbacks, _i, _len, _results;
    if (delta == null) {
      delta = 1;
    }
    window.now += delta;
    callbacks = [];
    window.timeouts = window.timeouts.filter(function(_arg) {
      var callback, id, strikeTime;
      id = _arg[0], strikeTime = _arg[1], callback = _arg[2];
      if (strikeTime <= window.now) {
        callbacks.push(callback);
        return false;
      } else {
        return true;
      }
    });
    _results = [];
    for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
      callback = callbacks[_i];
      _results.push(callback());
    }
    return _results;
  };

  window.pagePixelPositionForPoint = function(editorView, point) {
    var left, top;
    point = Point.fromObject(point);
    top = editorView.renderedLines.offset().top + point.row * editorView.lineHeight;
    left = editorView.renderedLines.offset().left + point.column * editorView.charWidth - editorView.renderedLines.scrollLeft();
    return {
      top: top,
      left: left
    };
  };

  window.tokensText = function(tokens) {
    return _.pluck(tokens, 'value').join('');
  };

  window.setEditorWidthInChars = function(editorView, widthInChars, charWidth) {
    if (charWidth == null) {
      charWidth = editorView.charWidth;
    }
    editorView.width(charWidth * widthInChars + editorView.gutter.outerWidth());
    return $(window).trigger('resize');
  };

  window.setEditorHeightInLines = function(editorView, heightInLines, lineHeight) {
    var _ref3;
    if (lineHeight == null) {
      lineHeight = editorView.lineHeight;
    }
    if (editorView.hasClass('react')) {
      editorView.height(editorView.getEditor().getLineHeightInPixels() * heightInLines);
      return (_ref3 = editorView.component) != null ? _ref3.measureHeightAndWidth() : void 0;
    } else {
      editorView.height(lineHeight * heightInLines + editorView.renderedLines.position().top);
      return $(window).trigger('resize');
    }
  };

  $.fn.resultOfTrigger = function(type) {
    var event;
    event = $.Event(type);
    this.trigger(event);
    return event.result;
  };

  $.fn.enableKeymap = function() {
    return this.on('keydown', function(e) {
      var originalEvent, _ref3;
      originalEvent = (_ref3 = e.originalEvent) != null ? _ref3 : e;
      if (originalEvent.target == null) {
        Object.defineProperty(originalEvent, 'target', {
          get: function() {
            return e.target;
          }
        });
      }
      atom.keymaps.handleKeyboardEvent(originalEvent);
      return !e.originalEvent.defaultPrevented;
    });
  };

  $.fn.attachToDom = function() {
    return this.appendTo($('#jasmine-content'));
  };

  $.fn.simulateDomAttachment = function() {
    return $('<html>').append(this);
  };

  $.fn.textInput = function(data) {
    return this.each(function() {
      var event;
      event = document.createEvent('TextEvent');
      event.initTextEvent('textInput', true, true, window, data);
      event = $.event.fix(event);
      return $(this).trigger(event);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJaQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQSxPQUFBLENBQVEsZUFBUixDQUFBLENBQUE7O0FBQUEsRUFDQSxJQUFJLENBQUMsVUFBTCxDQUFBLENBREEsQ0FBQTs7QUFBQSxFQUVBLElBQUksQ0FBQyx1QkFBTCxDQUFBLENBRkEsQ0FBQTs7QUFBQSxFQUlBLE9BQUEsQ0FBUSwwQkFBUixDQUpBLENBQUE7O0FBQUEsRUFLQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FMUCxDQUFBOztBQUFBLEVBTUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQU5KLENBQUE7O0FBQUEsRUFPQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FQTCxDQUFBOztBQUFBLEVBUUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBUlAsQ0FBQTs7QUFBQSxFQVNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLDBCQUFSLENBVGhCLENBQUE7O0FBQUEsRUFVQSxPQUFnQyxPQUFBLENBQVEsTUFBUixDQUFoQyxFQUFDLFNBQUEsQ0FBRCxFQUFJLHFCQUFBLGFBQUosRUFBbUIsaUJBQUEsU0FWbkIsQ0FBQTs7QUFBQSxFQVdBLE1BQUEsR0FBUyxPQUFBLENBQVEsZUFBUixDQVhULENBQUE7O0FBQUEsRUFZQyxRQUFTLE9BQUEsQ0FBUSxhQUFSLEVBQVQsS0FaRCxDQUFBOztBQUFBLEVBYUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxnQkFBUixDQWJWLENBQUE7O0FBQUEsRUFjQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVIsQ0FkVCxDQUFBOztBQUFBLEVBZUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxvQkFBUixDQWZiLENBQUE7O0FBQUEsRUFnQkEsZUFBQSxHQUFrQixPQUFBLENBQVEseUJBQVIsQ0FoQmxC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
//# sourceURL=/Applications/Atom.app/Contents/Resources/app/spec/spec-helper.coffee