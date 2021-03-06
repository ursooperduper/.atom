var koa = require("koa");
var app = koa();

// x-response-time

app.use(function* (next) {
  var start = new Date();
  yield next;
  var ms = new Date() - start;
  this.set("X-Response-Time", ms + "ms");
});

// logger

app.use(function* (next) {
  var start = new Date();
  yield next;
  var ms = new Date() - start;
  console.log("%s %s - %s", this.method, this.url, ms);
});

// response

app.use(function* () {
  this.body = "Hello World";
});

app.listen(3000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9zZXRpLXN5bnRheC9zYW1wbGUtZmlsZXMvSmF2YVNjcmlwdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekIsSUFBSSxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7Ozs7QUFJaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLElBQUksRUFBQztBQUN0QixNQUFJLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ3ZCLFFBQU0sSUFBSSxDQUFDO0FBQ1gsTUFBSSxFQUFFLEdBQUcsSUFBSSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUM7QUFDNUIsTUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7Q0FDeEMsQ0FBQyxDQUFDOzs7O0FBSUgsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLElBQUksRUFBQztBQUN0QixNQUFJLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ3ZCLFFBQU0sSUFBSSxDQUFDO0FBQ1gsTUFBSSxFQUFFLEdBQUcsSUFBSSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUM7QUFDNUIsU0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0NBQ3RELENBQUMsQ0FBQzs7OztBQUlILEdBQUcsQ0FBQyxHQUFHLENBQUMsYUFBWTtBQUNsQixNQUFJLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQztDQUMzQixDQUFDLENBQUM7O0FBRUgsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvc2FyYWgvLmF0b20vcGFja2FnZXMvc2V0aS1zeW50YXgvc2FtcGxlLWZpbGVzL0phdmFTY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIga29hID0gcmVxdWlyZSgna29hJyk7XG52YXIgYXBwID0ga29hKCk7XG5cbi8vIHgtcmVzcG9uc2UtdGltZVxuXG5hcHAudXNlKGZ1bmN0aW9uICoobmV4dCl7XG4gIHZhciBzdGFydCA9IG5ldyBEYXRlKCk7XG4gIHlpZWxkIG5leHQ7XG4gIHZhciBtcyA9IG5ldyBEYXRlKCkgLSBzdGFydDtcbiAgdGhpcy5zZXQoJ1gtUmVzcG9uc2UtVGltZScsIG1zICsgJ21zJyk7XG59KTtcblxuLy8gbG9nZ2VyXG5cbmFwcC51c2UoZnVuY3Rpb24gKihuZXh0KXtcbiAgdmFyIHN0YXJ0ID0gbmV3IERhdGUoKTtcbiAgeWllbGQgbmV4dDtcbiAgdmFyIG1zID0gbmV3IERhdGUoKSAtIHN0YXJ0O1xuICBjb25zb2xlLmxvZygnJXMgJXMgLSAlcycsIHRoaXMubWV0aG9kLCB0aGlzLnVybCwgbXMpO1xufSk7XG5cbi8vIHJlc3BvbnNlXG5cbmFwcC51c2UoZnVuY3Rpb24gKigpe1xuICB0aGlzLmJvZHkgPSAnSGVsbG8gV29ybGQnO1xufSk7XG5cbmFwcC5saXN0ZW4oMzAwMCk7XG4iXX0=