(function() {
  var AtomProcessingView;

  module.exports = AtomProcessingView = (function() {
    function AtomProcessingView(serializeState) {
      var message;
      this.element = document.createElement('div');
      this.element.classList.add('atom-processing');
      message = document.createElement('div');
      message.textContent = "The AtomProcessing package is Alive! It's ALIVE!";
      message.classList.add('message');
      this.element.appendChild(message);
    }

    AtomProcessingView.prototype.serialize = function() {};

    AtomProcessingView.prototype.destroy = function() {
      return this.element.remove();
    };

    AtomProcessingView.prototype.getElement = function() {
      return this.element;
    };

    return AtomProcessingView;

  })();

}).call(this);
