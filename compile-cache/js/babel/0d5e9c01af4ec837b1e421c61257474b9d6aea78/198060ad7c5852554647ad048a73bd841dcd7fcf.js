"use strict";
var CompositeDisposable = require("atom").CompositeDisposable;
var emissary = require("emissary");
var lazyReq = require("lazy-req")(require);
var lodash = lazyReq("lodash");
var jshint = lazyReq("jshint");
var jsxhint = lazyReq("jshint-jsx");
var path = require("path");
var cli = lazyReq("jshint/src/cli");
var reactDomPragma = require("react-dom-pragma");
var loadConfig = lazyReq("./load-config");
var plugin = module.exports;
var _;
var markersByEditorId = {};
var errorsByEditorId = {};
var subscriptionTooltips = new CompositeDisposable();

emissary.Subscriber.extend(plugin);

var SUPPORTED_GRAMMARS = ["source.js", "source.jsx", "source.js.jsx"];

function getMarkersForEditor() {
	var editor = atom.workspace.getActiveTextEditor();

	if (editor && markersByEditorId[editor.id]) {
		return markersByEditorId[editor.id];
	}

	return {};
}

function getErrorsForEditor() {
	var editor = atom.workspace.getActiveTextEditor();

	if (editor && errorsByEditorId[editor.id]) {
		return errorsByEditorId[editor.id];
	}

	return [];
}

function clearOldMarkers(errors) {
	subscriptionTooltips.dispose();

	var rows = _.map(errors, function (error) {
		return getRowForError(error);
	});

	var oldMarkers = getMarkersForEditor();
	_.each(_.keys(oldMarkers), function (row) {
		if (!_.contains(rows, row)) {
			destroyMarkerAtRow(row);
		}
	});
}

function destroyMarkerAtRow(row) {
	var editor = atom.workspace.getActiveTextEditor();
	if (markersByEditorId[editor.id] && markersByEditorId[editor.id][row]) {
		markersByEditorId[editor.id][row].destroy();
		delete markersByEditorId[editor.id][row];
	}
}

function saveMarker(marker, row) {
	var editor = atom.workspace.getActiveTextEditor();

	if (!markersByEditorId[editor.id]) {
		markersByEditorId[editor.id] = {};
	}

	markersByEditorId[editor.id][row] = marker;
}

function getMarkerAtRow(row) {
	var editor = atom.workspace.getActiveTextEditor();

	if (!markersByEditorId[editor.id]) {
		return null;
	}

	return markersByEditorId[editor.id][row];
}

function updateStatusbar() {
	var statusBar = atom.views.getView(atom.workspace).querySelector(".status-bar");
	if (!statusBar) {
		return;
	}

	var jsHintStatusBar = statusBar.querySelector("#jshint-statusbar");
	if (jsHintStatusBar && jsHintStatusBar.parentNode) {
		jsHintStatusBar.parentNode.removeChild(jsHintStatusBar);
	}

	var editor = atom.workspace.getActiveTextEditor();
	if (!editor || !errorsByEditorId[editor.id]) {
		return;
	}

	var line = editor.getCursorBufferPosition().row + 1;
	var error = errorsByEditorId[editor.id][line] || _.first(_.compact(errorsByEditorId[editor.id]));
	error = error[0];

	statusBar.appendLeft("<span id=\"jshint-statusbar\" class=\"inline-block\">JSHint " + error.line + ":" + error.character + " " + error.reason + "</span>");
}

function getRowForError(error) {
	var line = error[0].line || 1; // JSHint reports `line: 0` when config error
	var row = line - 1;
	return row;
}

function displayError(error) {
	var row = getRowForError(error);

	if (getMarkerAtRow(row)) {
		return;
	}

	var editor = atom.workspace.getActiveTextEditor();
	var marker = editor.markBufferRange([[row, 0], [row, 1]]);
	editor.decorateMarker(marker, { type: "line", "class": "jshint-line" });
	editor.decorateMarker(marker, { type: "gutter", "class": "jshint-line-number" });
	saveMarker(marker, row);
	addReasons(marker, error);
}

function getReasonsForError(error) {
	return _.map(error, function (el) {
		return el.character + ": " + el.reason;
	});
}

function addReasons(marker, error) {
	var row = getRowForError(error);
	var editorElement = atom.views.getView(atom.workspace.getActiveTextEditor());
	var reasons = "<div class=\"jshint-errors\">" + getReasonsForError(error).join("<br />") + "</div>";

	var target = editorElement.shadowRoot.querySelectorAll(".jshint-line-number.line-number-" + row);
	var tooltip = atom.tooltips.add(target, {
		title: reasons,
		placement: "bottom",
		delay: { show: 200 }
	});
	subscriptionTooltips.add(tooltip);
}

function lint() {
	var editor = atom.workspace.getActiveTextEditor();

	if (!editor) {
		return;
	}

	if (SUPPORTED_GRAMMARS.indexOf(editor.getGrammar().scopeName) === -1) {
		return;
	}

	var file = editor.getUri();

	// Hack to make JSHint look for .jshintignore in the correct dir
	// Because JSHint doesn't use its `cwd` option
	process.chdir(path.dirname(file));

	// Remove errors and don't lint if file is ignored in .jshintignore
	if (file && cli().gather({ args: [file] }).length === 0) {
		removeErrorsForEditorId(editor.id);
		displayErrors();
		removeMarkersForEditorId(editor.id);
		return;
	}

	var config = file ? loadConfig()(file) : {};

	var linter = atom.config.get("jshint.supportLintingJsx") || atom.config.get("jshint.transformJsx") ? jsxhint().JSXHINT : jshint().JSHINT;

	var origCode = editor.getText();
	var code = editor.getGrammar().scopeName === "source.jsx" ? reactDomPragma(origCode) : origCode;
	var pragmaWasAdded = code !== origCode;

	try {
		linter(code, config, config.globals);
	} catch (err) {}

	removeErrorsForEditorId(editor.id);

	// workaround the errors array sometimes containing `null`
	var errors = _.compact(linter.errors);

	if (errors.length > 0) {
		// aggregate same-line errors
		var ret = [];
		_.each(errors, function (el) {
			if (pragmaWasAdded) {
				el.line--;
			}

			var l = el.line;

			if (Array.isArray(ret[l])) {
				ret[l].push(el);

				ret[l] = _.sortBy(ret[l], function (el) {
					return el.character;
				});
			} else {
				ret[l] = [el];
			}
		});

		errorsByEditorId[editor.id] = ret;
	}

	displayErrors();
}

function displayErrors() {
	var errors = _.compact(getErrorsForEditor());
	clearOldMarkers(errors);
	updateStatusbar();
	_.each(errors, displayError);
}

function removeMarkersForEditorId(id) {
	if (markersByEditorId[id]) {
		delete markersByEditorId[id];
	}
}

function removeErrorsForEditorId(id) {
	if (errorsByEditorId[id]) {
		delete errorsByEditorId[id];
	}
}

function registerEvents() {
	lint();
	var workspaceElement = atom.views.getView(atom.workspace);

	atom.workspace.eachEditor(function (editor) {
		var buffer = editor.getBuffer();
		var events = "saved contents-modified";

		editor.off("scroll-top-changed");
		plugin.unsubscribe(buffer);

		if (atom.config.get("jshint.validateOnlyOnSave")) {
			events = "saved";
		}

		editor.on("scroll-top-changed", _.debounce(displayErrors, 200));

		plugin.subscribe(buffer, events, _.debounce(lint, 50));
	});

	workspaceElement.addEventListener("editor:will-be-removed", function (e, editorView) {
		if (editorView && editorView.editor) {
			removeErrorsForEditorId(editorView.editor.id);
			removeMarkersForEditorId(editorView.editor.id);
		}
	});

	workspaceElement.addEventListener("cursor:moved", updateStatusbar);
}

plugin.config = {
	validateOnlyOnSave: {
		type: "boolean",
		"default": false
	},
	supportLintingJsx: {
		type: "boolean",
		"default": false,
		title: "Support Linting JSX"
	}
};

plugin.activate = function () {
	_ = lodash();
	registerEvents();
	plugin.subscribe(atom.config.observe("jshint.validateOnlyOnSave", registerEvents));
	atom.commands.add("atom-workspace", "jshint:lint", lint);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9qc2hpbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDO0FBQ2IsSUFBSSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsbUJBQW1CLENBQUM7QUFDOUQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ25DLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMzQyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNwQyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDcEMsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDakQsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzFDLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDNUIsSUFBSSxDQUFDLENBQUM7QUFDTixJQUFJLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUMzQixJQUFJLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLG9CQUFvQixHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQzs7QUFFckQsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRW5DLElBQUksa0JBQWtCLEdBQUcsQ0FDeEIsV0FBVyxFQUNYLFlBQVksRUFDWixlQUFlLENBQ2YsQ0FBQzs7QUFFRixTQUFT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QyxDQUFDOztBQUVILGlCQUFnQixDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxlQUFlLENBQUMsQ0FBQztDQUNuRTs7QUFFRCxNQUFNLENBQUMsTUFBTSxHQUFHO0FBQ2YsbUJBQWtCLEVBQUU7QUFDbkIsTUFBSSxFQUFFLFNBQVM7QUFDZixhQUFTLEtBQUs7RUFDZDtBQUNELGtCQUFpQixFQUFFO0FBQ2xCLE1BQUksRUFBRSxTQUFTO0FBQ2YsYUFBUyxLQUFLO0FBQ2QsT0FBSyxFQUFFLHFCQUFxQjtFQUM1QjtDQUNELENBQUM7O0FBRUYsTUFBTSxDQUFDLFFBQVEsR0FBRyxZQUFZO0FBQzdCLEVBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQztBQUNiLGVBQWMsRUFBRSxDQUFDO0FBQ2pCLE9BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsMkJBQTJCLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztBQUNuRixLQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7Q0FDekQsQ0FBQyIsImZpbGUiOiIvVXNlcnMvc2FyYWgvLmF0b20vcGFja2FnZXMvanNoaW50L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xudmFyIENvbXBvc2l0ZURpc3Bvc2FibGUgPSByZXF1aXJlKCdhdG9tJykuQ29tcG9zaXRlRGlzcG9zYWJsZTtcbnZhciBlbWlzc2FyeSA9IHJlcXVpcmUoJ2VtaXNzYXJ5Jyk7XG52YXIgbGF6eVJlcSA9IHJlcXVpcmUoJ2xhenktcmVxJykocmVxdWlyZSk7XG52YXIgbG9kYXNoID0gbGF6eVJlcSgnbG9kYXNoJyk7XG52YXIganNoaW50ID0gbGF6eVJlcSgnanNoaW50Jyk7XG52YXIganN4aGludCA9IGxhenlSZXEoJ2pzaGludC1qc3gnKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIGNsaSA9IGxhenlSZXEoJ2pzaGludC9zcmMvY2xpJyk7XG52YXIgcmVhY3REb21QcmFnbWEgPSByZXF1aXJlKCdyZWFjdC1kb20tcHJhZ21hJyk7XG52YXIgbG9hZENvbmZpZyA9IGxhenlSZXEoJy4vbG9hZC1jb25maWcnKTtcbnZhciBwbHVnaW4gPSBtb2R1bGUuZXhwb3J0cztcbnZhciBfO1xudmFyIG1hcmtlcnNCeUVkaXRvcklkID0ge307XG52YXIgZXJyb3JzQnlFZGl0b3JJZCA9IHt9O1xudmFyIHN1YnNjcmlwdGlvblRvb2x0aXBzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuZW1pc3NhcnkuU3Vic2NyaWJlci5leHRlbmQocGx1Z2luKTtcblxudmFyIFNVUFBPUlRFRF9HUkFNTUFSUyA9IFtcblx0J3NvdXJjZS5qcycsXG5cdCdzb3VyY2UuanN4Jyxcblx0J3NvdXJjZS5qcy5qc3gnXG5dO1xuXG5mdW5jdGlvbiBnZXRNYXJrZXJzRm9yRWRpdG9yKCkge1xuXHR2YXIgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG5cdGlmIChlZGl0b3IgJiYgbWFya2Vyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSkge1xuXHRcdHJldHVybiBtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdO1xuXHR9XG5cblx0cmV0dXJuIHt9O1xufVxuXG5mdW5jdGlvbiBnZXRFcnJvcnNGb3JFZGl0b3IoKSB7XG5cdHZhciBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cblx0aWYgKGVkaXRvciAmJiBlcnJvcnNCeUVkaXRvcklkW2VkaXRvci5pZF0pIHtcblx0XHRyZXR1cm4gZXJyb3JzQnlFZGl0b3JJZFtlZGl0b3IuaWRdO1xuXHR9XG5cblx0cmV0dXJuIFtdO1xufVxuXG5mdW5jdGlvbiBjbGVhck9sZE1hcmtlcnMoZXJyb3JzKSB7XG5cdHN1YnNjcmlwdGlvblRvb2x0aXBzLmRpc3Bvc2UoKTtcblxuXHR2YXIgcm93cyA9IF8ubWFwKGVycm9ycywgZnVuY3Rpb24gKGVycm9yKSB7XG5cdFx0cmV0dXJuIGdldFJvd0ZvckVycm9yKGVycm9yKTtcblx0fSk7XG5cblx0dmFyIG9sZE1hcmtlcnMgPSBnZXRNYXJrZXJzRm9yRWRpdG9yKCk7XG5cdF8uZWFjaChfLmtleXMob2xkTWFya2VycyksIGZ1bmN0aW9uIChyb3cpIHtcblx0XHRpZiAoIV8uY29udGFpbnMocm93cywgcm93KSkge1xuXHRcdFx0ZGVzdHJveU1hcmtlckF0Um93KHJvdyk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gZGVzdHJveU1hcmtlckF0Um93KHJvdykge1xuXHR2YXIgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXHRpZiAobWFya2Vyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSAmJiBtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdW3Jvd10pIHtcblx0XHRtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdW3Jvd10uZGVzdHJveSgpO1xuXHRcdGRlbGV0ZSBtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdW3Jvd107XG5cdH1cbn1cblxuZnVuY3Rpb24gc2F2ZU1hcmtlcihtYXJrZXIsIHJvdykge1xuXHR2YXIgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG5cdGlmICghbWFya2Vyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSkge1xuXHRcdG1hcmtlcnNCeUVkaXRvcklkW2VkaXRvci5pZF0gPSB7fTtcblx0fVxuXG5cdG1hcmtlcnNCeUVkaXRvcklkW2VkaXRvci5pZF1bcm93XSA9IG1hcmtlcjtcbn1cblxuZnVuY3Rpb24gZ2V0TWFya2VyQXRSb3cocm93KSB7XG5cdHZhciBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cblx0aWYgKCFtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRyZXR1cm4gbWFya2Vyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXVtyb3ddO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTdGF0dXNiYXIoKSB7XG5cdHZhciBzdGF0dXNCYXIgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLnF1ZXJ5U2VsZWN0b3IoJy5zdGF0dXMtYmFyJyk7XG5cdGlmICghc3RhdHVzQmFyKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIGpzSGludFN0YXR1c0JhciA9IHN0YXR1c0Jhci5xdWVyeVNlbGVjdG9yKCcjanNoaW50LXN0YXR1c2JhcicpO1xuXHRpZiAoanNIaW50U3RhdHVzQmFyICYmIGpzSGludFN0YXR1c0Jhci5wYXJlbnROb2RlKSB7XG5cdFx0anNIaW50U3RhdHVzQmFyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoanNIaW50U3RhdHVzQmFyKTtcblx0fVxuXG5cdHZhciBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cdGlmICghZWRpdG9yIHx8ICFlcnJvcnNCeUVkaXRvcklkW2VkaXRvci5pZF0pIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR2YXIgbGluZSA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLnJvdysxO1xuXHR2YXIgZXJyb3IgPSBlcnJvcnNCeUVkaXRvcklkW2VkaXRvci5pZF1bbGluZV0gfHwgXy5maXJzdChfLmNvbXBhY3QoZXJyb3JzQnlFZGl0b3JJZFtlZGl0b3IuaWRdKSk7XG5cdGVycm9yID0gZXJyb3JbMF07XG5cblx0c3RhdHVzQmFyLmFwcGVuZExlZnQoJzxzcGFuIGlkPVwianNoaW50LXN0YXR1c2JhclwiIGNsYXNzPVwiaW5saW5lLWJsb2NrXCI+SlNIaW50ICcgKyBlcnJvci5saW5lICsgJzonICsgZXJyb3IuY2hhcmFjdGVyICsgJyAnICsgZXJyb3IucmVhc29uICsgJzwvc3Bhbj4nKTtcbn1cblxuZnVuY3Rpb24gZ2V0Um93Rm9yRXJyb3IoZXJyb3IpIHtcblx0dmFyIGxpbmUgPSBlcnJvclswXS5saW5lIHx8IDE7IC8vIEpTSGludCByZXBvcnRzIGBsaW5lOiAwYCB3aGVuIGNvbmZpZyBlcnJvclxuXHR2YXIgcm93ID0gbGluZSAtIDE7XG5cdHJldHVybiByb3c7XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlFcnJvcihlcnJvcikge1xuXHR2YXIgcm93ID0gZ2V0Um93Rm9yRXJyb3IoZXJyb3IpO1xuXG5cdGlmIChnZXRNYXJrZXJBdFJvdyhyb3cpKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblx0dmFyIG1hcmtlciA9IGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UoW1tyb3csIDBdLCBbcm93LCAxXV0pO1xuXHRlZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2xpbmUnLCBjbGFzczogJ2pzaGludC1saW5lJ30pO1xuXHRlZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2d1dHRlcicsIGNsYXNzOiAnanNoaW50LWxpbmUtbnVtYmVyJ30pO1xuXHRzYXZlTWFya2VyKG1hcmtlciwgcm93KTtcblx0YWRkUmVhc29ucyhtYXJrZXIsIGVycm9yKTtcbn1cblxuZnVuY3Rpb24gZ2V0UmVhc29uc0ZvckVycm9yKGVycm9yKSB7XG5cdHJldHVybiBfLm1hcChlcnJvciwgZnVuY3Rpb24gKGVsKSB7XG5cdFx0cmV0dXJuIGVsLmNoYXJhY3RlciArICc6ICcgKyBlbC5yZWFzb247XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBhZGRSZWFzb25zKG1hcmtlciwgZXJyb3IpIHtcblx0dmFyIHJvdyA9IGdldFJvd0ZvckVycm9yKGVycm9yKTtcblx0dmFyIGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKTtcblx0dmFyIHJlYXNvbnMgPSAnPGRpdiBjbGFzcz1cImpzaGludC1lcnJvcnNcIj4nICsgZ2V0UmVhc29uc0ZvckVycm9yKGVycm9yKS5qb2luKCc8YnIgLz4nKSArICc8L2Rpdj4nO1xuXG5cdHZhciB0YXJnZXQgPSBlZGl0b3JFbGVtZW50LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvckFsbCgnLmpzaGludC1saW5lLW51bWJlci5saW5lLW51bWJlci0nICsgcm93KTtcblx0dmFyIHRvb2x0aXAgPSBhdG9tLnRvb2x0aXBzLmFkZCh0YXJnZXQsIHtcblx0XHR0aXRsZTogcmVhc29ucyxcblx0XHRwbGFjZW1lbnQ6ICdib3R0b20nLFxuXHRcdGRlbGF5OiB7IHNob3c6IDIwMCB9XG5cdH0pO1xuXHRzdWJzY3JpcHRpb25Ub29sdGlwcy5hZGQodG9vbHRpcCk7XG59XG5cbmZ1bmN0aW9uIGxpbnQoKSB7XG5cdHZhciBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cblx0aWYgKCFlZGl0b3IpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRpZiAoU1VQUE9SVEVEX0dSQU1NQVJTLmluZGV4T2YoZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUpID09PSAtMSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciBmaWxlID0gZWRpdG9yLmdldFVyaSgpO1xuXG5cdC8vIEhhY2sgdG8gbWFrZSBKU0hpbnQgbG9vayBmb3IgLmpzaGludGlnbm9yZSBpbiB0aGUgY29ycmVjdCBkaXJcblx0Ly8gQmVjYXVzZSBKU0hpbnQgZG9lc24ndCB1c2UgaXRzIGBjd2RgIG9wdGlvblxuXHRwcm9jZXNzLmNoZGlyKHBhdGguZGlybmFtZShmaWxlKSk7XG5cblx0Ly8gUmVtb3ZlIGVycm9ycyBhbmQgZG9uJ3QgbGludCBpZiBmaWxlIGlzIGlnbm9yZWQgaW4gLmpzaGludGlnbm9yZVxuXHRpZiAoZmlsZSAmJiBjbGkoKS5nYXRoZXIoe2FyZ3M6IFtmaWxlXX0pLmxlbmd0aCA9PT0gMCkge1xuXHRcdHJlbW92ZUVycm9yc0ZvckVkaXRvcklkKGVkaXRvci5pZCk7XG5cdFx0ZGlzcGxheUVycm9ycygpO1xuXHRcdHJlbW92ZU1hcmtlcnNGb3JFZGl0b3JJZChlZGl0b3IuaWQpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciBjb25maWcgPSBmaWxlID8gbG9hZENvbmZpZygpKGZpbGUpIDoge307XG5cblx0dmFyIGxpbnRlciA9IChhdG9tLmNvbmZpZy5nZXQoJ2pzaGludC5zdXBwb3J0TGludGluZ0pzeCcpIHx8IGF0b20uY29uZmlnLmdldCgnanNoaW50LnRyYW5zZm9ybUpzeCcpKSA/IGpzeGhpbnQoKS5KU1hISU5UIDoganNoaW50KCkuSlNISU5UO1xuXG5cdHZhciBvcmlnQ29kZSA9IGVkaXRvci5nZXRUZXh0KCk7XG5cdHZhciBjb2RlID0gZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUgPT09ICdzb3VyY2UuanN4JyA/IHJlYWN0RG9tUHJhZ21hKG9yaWdDb2RlKSA6IG9yaWdDb2RlO1xuXHR2YXIgcHJhZ21hV2FzQWRkZWQgPSBjb2RlICE9PSBvcmlnQ29kZTtcblxuXHR0cnkge1xuXHRcdGxpbnRlcihjb2RlLCBjb25maWcsIGNvbmZpZy5nbG9iYWxzKTtcblx0fSBjYXRjaCAoZXJyKSB7fVxuXG5cdHJlbW92ZUVycm9yc0ZvckVkaXRvcklkKGVkaXRvci5pZCk7XG5cblx0Ly8gd29ya2Fyb3VuZCB0aGUgZXJyb3JzIGFycmF5IHNvbWV0aW1lcyBjb250YWluaW5nIGBudWxsYFxuXHR2YXIgZXJyb3JzID0gXy5jb21wYWN0KGxpbnRlci5lcnJvcnMpO1xuXG5cdGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuXHRcdC8vIGFnZ3JlZ2F0ZSBzYW1lLWxpbmUgZXJyb3JzXG5cdFx0dmFyIHJldCA9IFtdO1xuXHRcdF8uZWFjaChlcnJvcnMsIGZ1bmN0aW9uIChlbCkge1xuXHRcdFx0aWYgKHByYWdtYVdhc0FkZGVkKSB7XG5cdFx0XHRcdGVsLmxpbmUtLTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGwgPSBlbC5saW5lO1xuXG5cdFx0XHRpZiAoQXJyYXkuaXNBcnJheShyZXRbbF0pKSB7XG5cdFx0XHRcdHJldFtsXS5wdXNoKGVsKTtcblxuXHRcdFx0XHRyZXRbbF0gPSBfLnNvcnRCeShyZXRbbF0sIGZ1bmN0aW9uIChlbCkge1xuXHRcdFx0XHRcdHJldHVybiBlbC5jaGFyYWN0ZXI7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0W2xdID0gW2VsXTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGVycm9yc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSA9IHJldDtcblx0fVxuXG5cdGRpc3BsYXlFcnJvcnMoKTtcbn1cblxuZnVuY3Rpb24gZGlzcGxheUVycm9ycygpIHtcblx0dmFyIGVycm9ycyA9IF8uY29tcGFjdChnZXRFcnJvcnNGb3JFZGl0b3IoKSk7XG5cdGNsZWFyT2xkTWFya2VycyhlcnJvcnMpO1xuXHR1cGRhdGVTdGF0dXNiYXIoKTtcblx0Xy5lYWNoKGVycm9ycywgZGlzcGxheUVycm9yKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlTWFya2Vyc0ZvckVkaXRvcklkKGlkKSB7XG5cdGlmIChtYXJrZXJzQnlFZGl0b3JJZFtpZF0pIHtcblx0XHRkZWxldGUgbWFya2Vyc0J5RWRpdG9ySWRbaWRdO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUVycm9yc0ZvckVkaXRvcklkKGlkKSB7XG5cdGlmIChlcnJvcnNCeUVkaXRvcklkW2lkXSkge1xuXHRcdGRlbGV0ZSBlcnJvcnNCeUVkaXRvcklkW2lkXTtcblx0fVxufVxuXG5mdW5jdGlvbiByZWdpc3RlckV2ZW50cygpIHtcblx0bGludCgpO1xuXHR2YXIgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSk7XG5cblx0YXRvbS53b3Jrc3BhY2UuZWFjaEVkaXRvcihmdW5jdGlvbiAoZWRpdG9yKSB7XG5cdFx0dmFyIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKTtcblx0XHR2YXIgZXZlbnRzID0gJ3NhdmVkIGNvbnRlbnRzLW1vZGlmaWVkJztcblxuXHRcdGVkaXRvci5vZmYoJ3Njcm9sbC10b3AtY2hhbmdlZCcpO1xuXHRcdHBsdWdpbi51bnN1YnNjcmliZShidWZmZXIpO1xuXG5cdFx0aWYgKGF0b20uY29uZmlnLmdldCgnanNoaW50LnZhbGlkYXRlT25seU9uU2F2ZScpKSB7XG5cdFx0XHRldmVudHMgPSAnc2F2ZWQnO1xuXHRcdH1cblxuXHRcdGVkaXRvci5vbignc2Nyb2xsLXRvcC1jaGFuZ2VkJywgXy5kZWJvdW5jZShkaXNwbGF5RXJyb3JzLCAyMDApKTtcblxuXHRcdHBsdWdpbi5zdWJzY3JpYmUoYnVmZmVyLCBldmVudHMsIF8uZGVib3VuY2UobGludCwgNTApKTtcblx0fSk7XG5cblx0d29ya3NwYWNlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdlZGl0b3I6d2lsbC1iZS1yZW1vdmVkJywgZnVuY3Rpb24gKGUsIGVkaXRvclZpZXcpIHtcblx0XHRpZiAoZWRpdG9yVmlldyAmJiBlZGl0b3JWaWV3LmVkaXRvcikge1xuXHRcdFx0cmVtb3ZlRXJyb3JzRm9yRWRpdG9ySWQoZWRpdG9yVmlldy5lZGl0b3IuaWQpO1xuXHRcdFx0cmVtb3ZlTWFya2Vyc0ZvckVkaXRvcklkKGVkaXRvclZpZXcuZWRpdG9yLmlkKTtcblx0XHR9XG5cdH0pO1xuXG5cdHdvcmtzcGFjZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY3Vyc29yOm1vdmVkJywgdXBkYXRlU3RhdHVzYmFyKTtcbn1cblxucGx1Z2luLmNvbmZpZyA9IHtcblx0dmFsaWRhdGVPbmx5T25TYXZlOiB7XG5cdFx0dHlwZTogJ2Jvb2xlYW4nLFxuXHRcdGRlZmF1bHQ6IGZhbHNlXG5cdH0sXG5cdHN1cHBvcnRMaW50aW5nSnN4OiB7XG5cdFx0dHlwZTogJ2Jvb2xlYW4nLFxuXHRcdGRlZmF1bHQ6IGZhbHNlLFxuXHRcdHRpdGxlOiAnU3VwcG9ydCBMaW50aW5nIEpTWCdcblx0fVxufTtcblxucGx1Z2luLmFjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xuXHRfID0gbG9kYXNoKCk7XG5cdHJlZ2lzdGVyRXZlbnRzKCk7XG5cdHBsdWdpbi5zdWJzY3JpYmUoYXRvbS5jb25maWcub2JzZXJ2ZSgnanNoaW50LnZhbGlkYXRlT25seU9uU2F2ZScsIHJlZ2lzdGVyRXZlbnRzKSk7XG5cdGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdqc2hpbnQ6bGludCcsIGxpbnQpO1xufTtcbiJdfQ==