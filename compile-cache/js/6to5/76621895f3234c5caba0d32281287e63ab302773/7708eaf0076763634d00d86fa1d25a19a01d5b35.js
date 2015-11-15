/**
 * Module dependencies.
 */

var EventEmitter = require("events").EventEmitter;
var mixin = require("merge-descriptors");
var proto = require("./application");
var Route = require("./router/route");
var Router = require("./router");
var req = require("./request");
var res = require("./response");

/**
 * Expose `createApplication()`.
 */

exports = module.exports = createApplication;

/**
 * Create an express application.
 *
 * @return {Function}
 * @api public
 */

function createApplication() {
  var app = function (req, res, next) {
    app.handle(req, res, next);
  };

  mixin(app, proto);
  mixin(app, EventEmitter.prototype);

  app.request = { __proto__: req, app: app };
  app.response = { __proto__: res, app: app };
  app.init();
  return app;
}

/**
 * Expose the prototypes.
 */

exports.application = proto;
exports.request = req;
exports.response = res;

/**
 * Expose constructors.
 */

exports.Route = Route;
exports.Router = Router;

/**
 * Expose middleware
 */

exports.query = require("./middleware/query");
exports["static"] = require("serve-static");

/**
 * Replace removed middleware with an appropriate error message.
 */

["json", "urlencoded", "bodyParser", "compress", "cookieSession", "session", "logger", "cookieParser", "favicon", "responseTime", "errorHandler", "timeout", "methodOverride", "vhost", "csrf", "directory", "limit", "multipart", "staticCache"].forEach(function (name) {
  Object.defineProperty(exports, name, {
    get: function () {
      throw new Error("Most middleware (like " + name + ") is no longer bundled with Express and must be installed separately. Please see https://github.com/senchalabs/connect#middleware.");
    },
    configurable: true
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9zZXRpLXN5bnRheC9zYW1wbGUtZmlsZXMvSmF2YVNjcmlwdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBSUEsSUFBSSxlQUFlLFFBQVEsVUFBVTtBQUNyQyxJQUFJLFFBQVEsUUFBUTtBQUNwQixJQUFJLFFBQVEsUUFBUTtBQUNwQixJQUFJLFFBQVEsUUFBUTtBQUNwQixJQUFJLFNBQVMsUUFBUTtBQUNyQixJQUFJLE1BQU0sUUFBUTtBQUNsQixJQUFJLE1BQU0sUUFBUTs7Ozs7O0FBTWxCLFVBQVUsT0FBTyxVQUFVOzs7Ozs7Ozs7QUFTM0IsU0FBUyxvQkFBb0I7QUFDM0IsTUFBSSxNQUFNLFVBQVMsS0FBSyxLQUFLLE1BQU07QUFDakMsUUFBSSxPQUFPLEtBQUssS0FBSzs7O0FBR3ZCLFFBQU0sS0FBSztBQUNYLFFBQU0sS0FBSyxhQUFhOztBQUV4QixNQUFJLFVBQVUsRUFBRSxXQUFXLEtBQUssS0FBSztBQUNyQyxNQUFJLFdBQVcsRUFBRSxXQUFXLEtBQUssS0FBSztBQUN0QyxNQUFJO0FBQ0osU0FBTzs7Ozs7OztBQU9ULFFBQVEsY0FBYztBQUN0QixRQUFRLFVBQVU7QUFDbEIsUUFBUSxXQUFXOzs7Ozs7QUFNbkIsUUFBUSxRQUFRO0FBQ2hCLFFBQVEsU0FBUzs7Ozs7O0FBTWpCLFFBQVEsUUFBUSxRQUFRO0FBQ3hCLG9CQUFpQixRQUFROzs7Ozs7QUFNekIsQ0FDRSxRQUNBLGNBQ0EsY0FDQSxZQUNBLGlCQUNBLFdBQ0EsVUFDQSxnQkFDQSxXQUNBLGdCQUNBLGdCQUNBLFdBQ0Esa0JBQ0EsU0FDQSxRQUNBLGFBQ0EsU0FDQSxhQUNBLGVBQ0EsUUFBUSxVQUFVLE1BQU07QUFDeEIsU0FBTyxlQUFlLFNBQVMsTUFBTTtBQUNuQyxTQUFLLFlBQVk7QUFDZixZQUFNLElBQUksTUFBTSwyQkFBMkIsT0FBTzs7QUFFcEQsa0JBQWMiLCJmaWxlIjoiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL3NldGktc3ludGF4L3NhbXBsZS1maWxlcy9KYXZhU2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG52YXIgbWl4aW4gPSByZXF1aXJlKCdtZXJnZS1kZXNjcmlwdG9ycycpO1xudmFyIHByb3RvID0gcmVxdWlyZSgnLi9hcHBsaWNhdGlvbicpO1xudmFyIFJvdXRlID0gcmVxdWlyZSgnLi9yb3V0ZXIvcm91dGUnKTtcbnZhciBSb3V0ZXIgPSByZXF1aXJlKCcuL3JvdXRlcicpO1xudmFyIHJlcSA9IHJlcXVpcmUoJy4vcmVxdWVzdCcpO1xudmFyIHJlcyA9IHJlcXVpcmUoJy4vcmVzcG9uc2UnKTtcblxuLyoqXG4gKiBFeHBvc2UgYGNyZWF0ZUFwcGxpY2F0aW9uKClgLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUFwcGxpY2F0aW9uO1xuXG4vKipcbiAqIENyZWF0ZSBhbiBleHByZXNzIGFwcGxpY2F0aW9uLlxuICpcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVBcHBsaWNhdGlvbigpIHtcbiAgdmFyIGFwcCA9IGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgYXBwLmhhbmRsZShyZXEsIHJlcywgbmV4dCk7XG4gIH07XG5cbiAgbWl4aW4oYXBwLCBwcm90byk7XG4gIG1peGluKGFwcCwgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSk7XG5cbiAgYXBwLnJlcXVlc3QgPSB7IF9fcHJvdG9fXzogcmVxLCBhcHA6IGFwcCB9O1xuICBhcHAucmVzcG9uc2UgPSB7IF9fcHJvdG9fXzogcmVzLCBhcHA6IGFwcCB9O1xuICBhcHAuaW5pdCgpO1xuICByZXR1cm4gYXBwO1xufVxuXG4vKipcbiAqIEV4cG9zZSB0aGUgcHJvdG90eXBlcy5cbiAqL1xuXG5leHBvcnRzLmFwcGxpY2F0aW9uID0gcHJvdG87XG5leHBvcnRzLnJlcXVlc3QgPSByZXE7XG5leHBvcnRzLnJlc3BvbnNlID0gcmVzO1xuXG4vKipcbiAqIEV4cG9zZSBjb25zdHJ1Y3RvcnMuXG4gKi9cblxuZXhwb3J0cy5Sb3V0ZSA9IFJvdXRlO1xuZXhwb3J0cy5Sb3V0ZXIgPSBSb3V0ZXI7XG5cbi8qKlxuICogRXhwb3NlIG1pZGRsZXdhcmVcbiAqL1xuXG5leHBvcnRzLnF1ZXJ5ID0gcmVxdWlyZSgnLi9taWRkbGV3YXJlL3F1ZXJ5Jyk7XG5leHBvcnRzLnN0YXRpYyA9IHJlcXVpcmUoJ3NlcnZlLXN0YXRpYycpO1xuXG4vKipcbiAqIFJlcGxhY2UgcmVtb3ZlZCBtaWRkbGV3YXJlIHdpdGggYW4gYXBwcm9wcmlhdGUgZXJyb3IgbWVzc2FnZS5cbiAqL1xuXG5bXG4gICdqc29uJyxcbiAgJ3VybGVuY29kZWQnLFxuICAnYm9keVBhcnNlcicsXG4gICdjb21wcmVzcycsXG4gICdjb29raWVTZXNzaW9uJyxcbiAgJ3Nlc3Npb24nLFxuICAnbG9nZ2VyJyxcbiAgJ2Nvb2tpZVBhcnNlcicsXG4gICdmYXZpY29uJyxcbiAgJ3Jlc3BvbnNlVGltZScsXG4gICdlcnJvckhhbmRsZXInLFxuICAndGltZW91dCcsXG4gICdtZXRob2RPdmVycmlkZScsXG4gICd2aG9zdCcsXG4gICdjc3JmJyxcbiAgJ2RpcmVjdG9yeScsXG4gICdsaW1pdCcsXG4gICdtdWx0aXBhcnQnLFxuICAnc3RhdGljQ2FjaGUnLFxuXS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01vc3QgbWlkZGxld2FyZSAobGlrZSAnICsgbmFtZSArICcpIGlzIG5vIGxvbmdlciBidW5kbGVkIHdpdGggRXhwcmVzcyBhbmQgbXVzdCBiZSBpbnN0YWxsZWQgc2VwYXJhdGVseS4gUGxlYXNlIHNlZSBodHRwczovL2dpdGh1Yi5jb20vc2VuY2hhbGFicy9jb25uZWN0I21pZGRsZXdhcmUuJyk7XG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG59KTtcbiJdfQ==