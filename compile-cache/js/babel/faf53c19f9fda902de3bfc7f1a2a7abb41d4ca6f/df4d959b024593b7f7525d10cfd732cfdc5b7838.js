Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _atomLinter = require('atom-linter');

var _atomLinter2 = _interopRequireDefault(_atomLinter);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

'use babel';

exports['default'] = {
  config: {
    customTags: {
      type: 'array',
      'default': [],
      items: {
        type: 'string'
      },
      description: 'List of YAML custom tags.'
    }
  },

  activate: function activate() {
    var _this = this;

    require('atom-package-deps').install('linter-js-yaml');
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-js-yaml.customTags', function (customTags) {
      _this.Schema = _jsYaml2['default'].Schema.create(customTags.map(function (tag) {
        return new _jsYaml2['default'].Type(tag, { kind: 'scalar' });
      }));
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    return {
      grammarScopes: ['source.yaml', 'source.yml'],
      scope: 'file',
      name: 'Js-YAML',
      lintOnFly: true,
      lint: function lint(TextEditor) {
        var filePath = TextEditor.getPath();
        var fileText = TextEditor.buffer.cachedText;

        var messages = [];
        var processMessage = function processMessage(type, message) {
          var line = message.mark.line;
          var column = message.mark.column;
          return {
            type: type,
            text: message.reason,
            filePath: filePath,
            range: _atomLinter2['default'].rangeFromLineNumber(TextEditor, line, column)
          };
        };

        try {
          _jsYaml2['default'].safeLoadAll(fileText, function () {}, {
            filename: _path2['default'].basename(filePath),
            schema: _this2.Schema,
            onWarning: function onWarning(warning) {
              messages.push(processMessage('Warning', warning));
            }
          });
        } catch (error) {
          messages.push(processMessage('Error', error));
        }

        return messages;
      }
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9saW50ZXItanMteWFtbC9saWIvbGludGVyLWpzLXlhbWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUVpQixNQUFNOzs7O29CQUNhLE1BQU07OzBCQUN2QixhQUFhOzs7O3NCQUNmLFNBQVM7Ozs7QUFMMUIsV0FBVyxDQUFDOztxQkFPRztBQUNiLFFBQU0sRUFBRTtBQUNOLGNBQVUsRUFBRTtBQUNWLFVBQUksRUFBRSxPQUFPO0FBQ2IsaUJBQVMsRUFBRTtBQUNYLFdBQUssRUFBRTtBQUNMLFlBQUksRUFBRSxRQUFRO09BQ2Y7QUFDRCxpQkFBVyxFQUFFLDJCQUEyQjtLQUN6QztHQUNGOztBQUVELFVBQVEsRUFBQSxvQkFBRzs7O0FBQ1QsV0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDdkQsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQztBQUMvQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsRUFBRSxVQUFBLFVBQVUsRUFBSTtBQUNwRixZQUFLLE1BQU0sR0FBRyxvQkFBSyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDckQsZUFBTyxJQUFJLG9CQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztPQUMvQyxDQUFDLENBQUMsQ0FBQztLQUNMLENBQUMsQ0FBQyxDQUFDO0dBQ0w7O0FBRUQsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUM5Qjs7QUFFRCxlQUFhLEVBQUEseUJBQUc7OztBQUNkLFdBQU87QUFDTCxtQkFBYSxFQUFFLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQztBQUM1QyxXQUFLLEVBQUUsTUFBTTtBQUNiLFVBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxFQUFFLElBQUk7QUFDZixVQUFJLEVBQUUsY0FBQyxVQUFVLEVBQUs7QUFDcEIsWUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3RDLFlBQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDOztBQUU5QyxZQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDcEIsWUFBTSxjQUFjLEdBQUcsU0FBakIsY0FBYyxDQUFJLElBQUksRUFBRSxPQUFPLEVBQUs7QUFDeEMsY0FBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDL0IsY0FBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDbkMsaUJBQU87QUFDTCxnQkFBSSxFQUFFLElBQUk7QUFDVixnQkFBSSxFQUFFLE9BQU8sQ0FBQyxNQUFNO0FBQ3BCLG9CQUFRLEVBQUUsUUFBUTtBQUNsQixpQkFBSyxFQUFFLHdCQUFPLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDO1dBQzVELENBQUM7U0FDSCxDQUFDOztBQUVGLFlBQUk7QUFDRiw4QkFBSyxXQUFXLENBQUMsUUFBUSxFQUFFLFlBQU0sRUFBRSxFQUFFO0FBQ25DLG9CQUFRLEVBQUUsa0JBQUssUUFBUSxDQUFDLFFBQVEsQ0FBQztBQUNqQyxrQkFBTSxFQUFFLE9BQUssTUFBTTtBQUNuQixxQkFBUyxFQUFFLG1CQUFBLE9BQU8sRUFBSTtBQUNwQixzQkFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDbkQ7V0FDRixDQUFDLENBQUM7U0FDSixDQUFDLE9BQU8sS0FBSyxFQUFFO0FBQ2Qsa0JBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQy9DOztBQUVELGVBQU8sUUFBUSxDQUFDO09BQ2pCO0tBQ0YsQ0FBQztHQUNIO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1qcy15YW1sL2xpYi9saW50ZXItanMteWFtbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCBoZWxwZXIgZnJvbSAnYXRvbS1saW50ZXInO1xuaW1wb3J0IHlhbWwgZnJvbSAnanMteWFtbCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29uZmlnOiB7XG4gICAgY3VzdG9tVGFnczoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICB9LFxuICAgICAgZGVzY3JpcHRpb246ICdMaXN0IG9mIFlBTUwgY3VzdG9tIHRhZ3MuJyxcbiAgICB9LFxuICB9LFxuXG4gIGFjdGl2YXRlKCkge1xuICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLWpzLXlhbWwnKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWpzLXlhbWwuY3VzdG9tVGFncycsIGN1c3RvbVRhZ3MgPT4ge1xuICAgICAgdGhpcy5TY2hlbWEgPSB5YW1sLlNjaGVtYS5jcmVhdGUoY3VzdG9tVGFncy5tYXAodGFnID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyB5YW1sLlR5cGUodGFnLCB7IGtpbmQ6ICdzY2FsYXInIH0pO1xuICAgICAgfSkpO1xuICAgIH0pKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ3JhbW1hclNjb3BlczogWydzb3VyY2UueWFtbCcsICdzb3VyY2UueW1sJ10sXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbmFtZTogJ0pzLVlBTUwnLFxuICAgICAgbGludE9uRmx5OiB0cnVlLFxuICAgICAgbGludDogKFRleHRFZGl0b3IpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBUZXh0RWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgY29uc3QgZmlsZVRleHQgPSBUZXh0RWRpdG9yLmJ1ZmZlci5jYWNoZWRUZXh0O1xuXG4gICAgICAgIGNvbnN0IG1lc3NhZ2VzID0gW107XG4gICAgICAgIGNvbnN0IHByb2Nlc3NNZXNzYWdlID0gKHR5cGUsIG1lc3NhZ2UpID0+IHtcbiAgICAgICAgICBjb25zdCBsaW5lID0gbWVzc2FnZS5tYXJrLmxpbmU7XG4gICAgICAgICAgY29uc3QgY29sdW1uID0gbWVzc2FnZS5tYXJrLmNvbHVtbjtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgIHRleHQ6IG1lc3NhZ2UucmVhc29uLFxuICAgICAgICAgICAgZmlsZVBhdGg6IGZpbGVQYXRoLFxuICAgICAgICAgICAgcmFuZ2U6IGhlbHBlci5yYW5nZUZyb21MaW5lTnVtYmVyKFRleHRFZGl0b3IsIGxpbmUsIGNvbHVtbiksXG4gICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHlhbWwuc2FmZUxvYWRBbGwoZmlsZVRleHQsICgpID0+IHt9LCB7XG4gICAgICAgICAgICBmaWxlbmFtZTogcGF0aC5iYXNlbmFtZShmaWxlUGF0aCksXG4gICAgICAgICAgICBzY2hlbWE6IHRoaXMuU2NoZW1hLFxuICAgICAgICAgICAgb25XYXJuaW5nOiB3YXJuaW5nID0+IHtcbiAgICAgICAgICAgICAgbWVzc2FnZXMucHVzaChwcm9jZXNzTWVzc2FnZSgnV2FybmluZycsIHdhcm5pbmcpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgbWVzc2FnZXMucHVzaChwcm9jZXNzTWVzc2FnZSgnRXJyb3InLCBlcnJvcikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VzO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==
//# sourceURL=/Users/sarah/.atom/packages/linter-js-yaml/lib/linter-js-yaml.js
