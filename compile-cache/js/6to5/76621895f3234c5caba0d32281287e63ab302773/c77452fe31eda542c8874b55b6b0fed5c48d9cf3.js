var quicksort = function () {
  var sort = function (items) {
    if (items.length <= 1) return items;
    var pivot = items.shift(),
        current,
        left = [],
        right = [];
    while (items.length > 0) {
      current = items.shift();
      current < pivot ? left.push(current) : right.push(current);
    }
    return sort(left).concat(pivot).concat(sort(right));
  };

  return sort(Array.apply(this, arguments));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcGx1cy9zcGVjL2ZpeHR1cmVzL3NhbXBsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLFlBQVksWUFBWTtBQUMxQixNQUFJLE9BQU8sVUFBUyxPQUFPO0FBQ3pCLFFBQUksTUFBTSxVQUFVLEdBQUcsT0FBTztBQUM5QixRQUFJLFFBQVEsTUFBTTtRQUFTO1FBQVMsT0FBTztRQUFJLFFBQVE7QUFDdkQsV0FBTSxNQUFNLFNBQVMsR0FBRztBQUN0QixnQkFBVSxNQUFNO0FBQ2hCLGdCQUFVLFFBQVEsS0FBSyxLQUFLLFdBQVcsTUFBTSxLQUFLOztBQUVwRCxXQUFPLEtBQUssTUFBTSxPQUFPLE9BQU8sT0FBTyxLQUFLOzs7QUFHOUMsU0FBTyxLQUFLLE1BQU0sTUFBTSxNQUFNIiwiZmlsZSI6Ii9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcGx1cy9zcGVjL2ZpeHR1cmVzL3NhbXBsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBxdWlja3NvcnQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzb3J0ID0gZnVuY3Rpb24oaXRlbXMpIHtcbiAgICBpZiAoaXRlbXMubGVuZ3RoIDw9IDEpIHJldHVybiBpdGVtcztcbiAgICB2YXIgcGl2b3QgPSBpdGVtcy5zaGlmdCgpLCBjdXJyZW50LCBsZWZ0ID0gW10sIHJpZ2h0ID0gW107XG4gICAgd2hpbGUoaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgY3VycmVudCA9IGl0ZW1zLnNoaWZ0KCk7XG4gICAgICBjdXJyZW50IDwgcGl2b3QgPyBsZWZ0LnB1c2goY3VycmVudCkgOiByaWdodC5wdXNoKGN1cnJlbnQpO1xuICAgIH1cbiAgICByZXR1cm4gc29ydChsZWZ0KS5jb25jYXQocGl2b3QpLmNvbmNhdChzb3J0KHJpZ2h0KSk7XG4gIH07XG5cbiAgcmV0dXJuIHNvcnQoQXJyYXkuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG59O1xuIl19