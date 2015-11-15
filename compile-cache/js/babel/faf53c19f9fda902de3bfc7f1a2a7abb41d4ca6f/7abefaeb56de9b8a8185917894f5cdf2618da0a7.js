Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _indie = require('./indie');

var _indie2 = _interopRequireDefault(_indie);

'use babel';

var IndieRegistry = (function () {
  function IndieRegistry() {
    _classCallCheck(this, IndieRegistry);

    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();

    this.indieLinters = new Set();
    this.subscriptions.add(this.emitter);
  }

  _createClass(IndieRegistry, [{
    key: 'register',
    value: function register(linter) {
      var _this = this;

      _validate2['default'].linter(linter, true);
      var indieLinter = new _indie2['default'](linter);

      this.subscriptions.add(indieLinter);
      this.indieLinters.add(indieLinter);

      indieLinter.onDidDestroy(function () {
        _this.indieLinters['delete'](indieLinter);
      });
      indieLinter.onDidUpdateMessages(function (messages) {
        _this.emitter.emit('did-update-messages', { linter: indieLinter, messages: messages });
      });
      this.emit('observe', indieLinter);

      return indieLinter;
    }
  }, {
    key: 'has',
    value: function has(indieLinter) {
      return this.indieLinters.has(indieLinter);
    }
  }, {
    key: 'unregister',
    value: function unregister(indieLinter) {
      if (this.indieLinters.has(indieLinter)) {
        indieLinter.dispose();
      }
    }

    // Private method
  }, {
    key: 'observe',
    value: function observe(callback) {
      this.indieLinters.forEach(callback);
      return this.emitter.on('observe', callback);
    }

    // Private method
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return IndieRegistry;
})();

exports['default'] = IndieRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2luZGllLXJlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRTJDLE1BQU07O3dCQUM1QixZQUFZOzs7O3FCQUNmLFNBQVM7Ozs7QUFKM0IsV0FBVyxDQUFBOztJQU1VLGFBQWE7QUFDckIsV0FEUSxhQUFhLEdBQ2xCOzBCQURLLGFBQWE7O0FBRTlCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBOztBQUU1QixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDN0IsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQ3JDOztlQVBrQixhQUFhOztXQVN4QixrQkFBQyxNQUFNLEVBQUU7OztBQUNmLDRCQUFTLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDN0IsVUFBTSxXQUFXLEdBQUcsdUJBQVUsTUFBTSxDQUFDLENBQUE7O0FBRXJDLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ25DLFVBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBOztBQUVsQyxpQkFBVyxDQUFDLFlBQVksQ0FBQyxZQUFNO0FBQzdCLGNBQUssWUFBWSxVQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7T0FDdEMsQ0FBQyxDQUFBO0FBQ0YsaUJBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUMxQyxjQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsRUFBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUMsQ0FBQyxDQUFBO09BQzFFLENBQUMsQ0FBQTtBQUNGLFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFBOztBQUVqQyxhQUFPLFdBQVcsQ0FBQTtLQUNuQjs7O1dBQ0UsYUFBQyxXQUFXLEVBQUU7QUFDZixhQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0tBQzFDOzs7V0FDUyxvQkFBQyxXQUFXLEVBQUU7QUFDdEIsVUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUN0QyxtQkFBVyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3RCO0tBQ0Y7Ozs7O1dBR00saUJBQUMsUUFBUSxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ25DLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzVDOzs7OztXQUVrQiw2QkFBQyxRQUFRLEVBQUU7QUFDNUIsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUN4RDs7O1dBRU0sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0EvQ2tCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6Ii9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2luZGllLXJlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IFZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUnXG5pbXBvcnQgSW5kaWUgZnJvbSAnLi9pbmRpZSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kaWVSZWdpc3RyeSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG5cbiAgICB0aGlzLmluZGllTGludGVycyA9IG5ldyBTZXQoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICB9XG5cbiAgcmVnaXN0ZXIobGludGVyKSB7XG4gICAgVmFsaWRhdGUubGludGVyKGxpbnRlciwgdHJ1ZSlcbiAgICBjb25zdCBpbmRpZUxpbnRlciA9IG5ldyBJbmRpZShsaW50ZXIpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGluZGllTGludGVyKVxuICAgIHRoaXMuaW5kaWVMaW50ZXJzLmFkZChpbmRpZUxpbnRlcilcblxuICAgIGluZGllTGludGVyLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICB0aGlzLmluZGllTGludGVycy5kZWxldGUoaW5kaWVMaW50ZXIpXG4gICAgfSlcbiAgICBpbmRpZUxpbnRlci5vbkRpZFVwZGF0ZU1lc3NhZ2VzKG1lc3NhZ2VzID0+IHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywge2xpbnRlcjogaW5kaWVMaW50ZXIsIG1lc3NhZ2VzfSlcbiAgICB9KVxuICAgIHRoaXMuZW1pdCgnb2JzZXJ2ZScsIGluZGllTGludGVyKVxuXG4gICAgcmV0dXJuIGluZGllTGludGVyXG4gIH1cbiAgaGFzKGluZGllTGludGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5kaWVMaW50ZXJzLmhhcyhpbmRpZUxpbnRlcilcbiAgfVxuICB1bnJlZ2lzdGVyKGluZGllTGludGVyKSB7XG4gICAgaWYgKHRoaXMuaW5kaWVMaW50ZXJzLmhhcyhpbmRpZUxpbnRlcikpIHtcbiAgICAgIGluZGllTGludGVyLmRpc3Bvc2UoKVxuICAgIH1cbiAgfVxuXG4gIC8vIFByaXZhdGUgbWV0aG9kXG4gIG9ic2VydmUoY2FsbGJhY2spIHtcbiAgICB0aGlzLmluZGllTGludGVycy5mb3JFYWNoKGNhbGxiYWNrKVxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ29ic2VydmUnLCBjYWxsYmFjaylcbiAgfVxuICAvLyBQcml2YXRlIG1ldGhvZFxuICBvbkRpZFVwZGF0ZU1lc3NhZ2VzKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZS1tZXNzYWdlcycsIGNhbGxiYWNrKVxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/sarah/.atom/packages/linter/lib/indie-registry.js
