var thisIsAReallyReallyReallyLongCompletion = function () {};

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcGx1cy9zcGVjL2ZpeHR1cmVzL3NhbXBsZWxvbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSwwQ0FBMEMsWUFBWTs7QUFFMUQsSUFBSSxZQUFZLFlBQVk7QUFDMUIsTUFBSSxPQUFPLFVBQVMsT0FBTztBQUN6QixRQUFJLE1BQU0sVUFBVSxHQUFHLE9BQU87QUFDOUIsUUFBSSxRQUFRLE1BQU07UUFBUztRQUFTLE9BQU87UUFBSSxRQUFRO0FBQ3ZELFdBQU0sTUFBTSxTQUFTLEdBQUc7QUFDdEIsZ0JBQVUsTUFBTTtBQUNoQixnQkFBVSxRQUFRLEtBQUssS0FBSyxXQUFXLE1BQU0sS0FBSzs7QUFFcEQsV0FBTyxLQUFLLE1BQU0sT0FBTyxPQUFPLE9BQU8sS0FBSzs7O0FBRzlDLFNBQU8sS0FBSyxNQUFNLE1BQU0sTUFBTSIsImZpbGUiOiIvVXNlcnMvc2FyYWgvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBsdXMvc3BlYy9maXh0dXJlcy9zYW1wbGVsb25nLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHRoaXNJc0FSZWFsbHlSZWFsbHlSZWFsbHlMb25nQ29tcGxldGlvbiA9IGZ1bmN0aW9uICgpIHsgfTtcblxudmFyIHF1aWNrc29ydCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNvcnQgPSBmdW5jdGlvbihpdGVtcykge1xuICAgIGlmIChpdGVtcy5sZW5ndGggPD0gMSkgcmV0dXJuIGl0ZW1zO1xuICAgIHZhciBwaXZvdCA9IGl0ZW1zLnNoaWZ0KCksIGN1cnJlbnQsIGxlZnQgPSBbXSwgcmlnaHQgPSBbXTtcbiAgICB3aGlsZShpdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBjdXJyZW50ID0gaXRlbXMuc2hpZnQoKTtcbiAgICAgIGN1cnJlbnQgPCBwaXZvdCA/IGxlZnQucHVzaChjdXJyZW50KSA6IHJpZ2h0LnB1c2goY3VycmVudCk7XG4gICAgfVxuICAgIHJldHVybiBzb3J0KGxlZnQpLmNvbmNhdChwaXZvdCkuY29uY2F0KHNvcnQocmlnaHQpKTtcbiAgfTtcblxuICByZXR1cm4gc29ydChBcnJheS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbn07XG4iXX0=