(function() {
  var AtomProcessing, AtomProcessingView, CompositeDisposable, child_process;

  AtomProcessingView = require('./atom-processing-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  child_process = require('child_process');

  module.exports = AtomProcessing = {
    atomProcessingView: null,
    modalPanel: null,
    subscriptions: null,
    activate: function(state) {
      this.atomProcessingView = new AtomProcessingView(state.atomProcessingViewState);
      this.modalPanel = atom.workspace.addModalPanel({
        item: this.atomProcessingView.getElement(),
        visible: false
      });
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'processing:run': (function(_this) {
          return function() {
            return _this.runSketch();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.modalPanel.destroy();
      this.subscriptions.dispose();
      return this.atomProcessingView.destroy();
    },
    serialize: function() {
      return {
        atomProcessingViewState: this.atomProcessingView.serialize()
      };
    },
    toggle: function() {
      console.log('AtomProcessing was toggled!');
      if (this.modalPanel.isVisible()) {
        return this.modalPanel.hide();
      } else {
        return this.modalPanel.show();
      }
    },
    runSketch: function() {
      var arr, command, editor, file, path;
      editor = atom.workspace.getActiveEditor();
      file = editor.getPath();
      arr = file.split("/");
      path = arr.slice(0, +(arr.length - 2) + 1 || 9e9).join("/");
      command = "processing-java --sketch=" + path + " --output=" + path + "/build --run --force";
      return child_process.exec(command, function(error, stdout, stderr) {
        if (error) {
          console.log(error.stack);
          console.log("Error code: " + error.code);
          console.log("Signal: " + error.signal);
        }
        console.log("STDOUT: " + stdout);
        return console.log("STDERR: " + stderr);
      });
    }
  };

}).call(this);
