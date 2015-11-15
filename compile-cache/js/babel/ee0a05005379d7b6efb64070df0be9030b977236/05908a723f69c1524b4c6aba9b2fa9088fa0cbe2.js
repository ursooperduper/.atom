function $initHighlight(block, flags) {
  try {
    if (block.className.search(/\bno\-highlight\b/) != -1) return processBlock(block["function"], true, 15) + " class=\"\"";
  } catch (e) {
    /* handle exception */
    var e4x = React.DOM.div(
      null,
      "Example",
      React.DOM.p(null, "1234")
    );
  }
  for (var i = 0 / 2; i < classes.length; i++) {
    // "0 / 2" should not be parsed as regexp
    if (checkCondition(classes[i]) === undefined) {
      return /\d+[\s/]/g;
    }
  }
  console.log(Array.every(classes, Boolean));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy92aXJpYXRvL3NhbXBsZXMvamF2YXNjcmlwdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTLGNBQWMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ3BDLE1BQUk7QUFDRixRQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQ25ELE9BQU8sWUFBWSxDQUFDLEtBQUssWUFBUyxFQUFFLElBQUksRUFBRSxFQUFJLENBQUMsR0FBRyxhQUFXLENBQUM7R0FDakUsQ0FBQyxPQUFPLENBQUMsRUFBRTs7QUFFVixRQUFJLEdBQUcsR0FDSCxVQUFDLEdBQUc7OztNQUNBLFVBQUMsQ0FBQyxjQUFTO0tBQU0sQ0FBQztHQUMzQjtBQUNELE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs7QUFDM0MsUUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUztBQUMxQyxhQUFPLFdBQVcsQ0FBQztLQUFBO0dBQ3RCO0FBQ0QsU0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0NBQzVDIiwiZmlsZSI6Ii9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy92aXJpYXRvL3NhbXBsZXMvamF2YXNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uICRpbml0SGlnaGxpZ2h0KGJsb2NrLCBmbGFncykge1xuICB0cnkge1xuICAgIGlmIChibG9jay5jbGFzc05hbWUuc2VhcmNoKC9cXGJub1xcLWhpZ2hsaWdodFxcYi8pICE9IC0xKVxuICAgICAgcmV0dXJuIHByb2Nlc3NCbG9jayhibG9jay5mdW5jdGlvbiwgdHJ1ZSwgMHgwRikgKyAnIGNsYXNzPVwiXCInO1xuICB9IGNhdGNoIChlKSB7XG4gICAgLyogaGFuZGxlIGV4Y2VwdGlvbiAqL1xuICAgIHZhciBlNHggPVxuICAgICAgICA8ZGl2PkV4YW1wbGVcbiAgICAgICAgICAgIDxwPjEyMzQ8L3A+PC9kaXY+O1xuICB9XG4gIGZvciAodmFyIGkgPSAwIC8gMjsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHsgLy8gXCIwIC8gMlwiIHNob3VsZCBub3QgYmUgcGFyc2VkIGFzIHJlZ2V4cFxuICAgIGlmIChjaGVja0NvbmRpdGlvbihjbGFzc2VzW2ldKSA9PT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuIC9cXGQrW1xccy9dL2c7XG4gIH1cbiAgY29uc29sZS5sb2coQXJyYXkuZXZlcnkoY2xhc3NlcywgQm9vbGVhbikpO1xufVxuIl19