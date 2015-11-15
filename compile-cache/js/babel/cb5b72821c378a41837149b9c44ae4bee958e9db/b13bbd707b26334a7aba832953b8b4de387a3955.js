Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* globals atom */

var _eventKit = require('event-kit');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _reactDomPragma = require('react-dom-pragma');

var _reactDomPragma2 = _interopRequireDefault(_reactDomPragma);

var _lazyReq = require('lazy-req');

var _lazyReq2 = _interopRequireDefault(_lazyReq);

'use babel';

var lazyReq = (0, _lazyReq2['default'])(require);
var lodash = lazyReq('lodash');
var jshint = lazyReq('jshint');
var jsxhint = lazyReq('jshint-jsx');
var cli = lazyReq('jshint/src/cli');
var loadConfig = lazyReq('./load-config');
var plugin = {};
var markersByEditorId = {};
var errorsByEditorId = {};
var subscriptionTooltips = new _eventKit.CompositeDisposable();
var _ = undefined;

var SUPPORTED_GRAMMARS = ['source.js', 'source.jsx', 'source.js.jsx'];

var jsHintStatusBar = document.createElement('span');
jsHintStatusBar.setAttribute('id', 'jshint-statusbar');
jsHintStatusBar.classList.add('inline-block');

var updateStatusText = function updateStatusText(line, character, reason) {
	jsHintStatusBar.textContent = line && character && reason ? 'JSHint ' + line + ':' + character + ' ' + reason : '';
};

var getMarkersForEditor = function getMarkersForEditor() {
	var editor = atom.workspace.getActiveTextEditor();

	if (editor && markersByEditorId[editor.id]) {
		return markersByEditorId[editor.id];
	}

	return {};
};

var getErrorsForEditor = function getErrorsForEditor() {
	var editor = atom.workspace.getActiveTextEditor();

	if (editor && errorsByEditorId[editor.id]) {
		return errorsByEditorId[editor.id];
	}

	return [];
};

var destroyMarkerAtRow = function destroyMarkerAtRow(row) {
	var editor = atom.workspace.getActiveTextEditor();
	if (markersByEditorId[editor.id] && markersByEditorId[editor.id][row]) {
		markersByEditorId[editor.id][row].destroy();
		delete markersByEditorId[editor.id][row];
	}
};

var getRowForError = function getRowForError(error) {
	var line = error[0].line || 1; // JSHint reports `line: 0` when config error
	var row = line - 1;
	return row;
};

var clearOldMarkers = function clearOldMarkers(errors) {
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
};

var saveMarker = function saveMarker(marker, row) {
	var editor = atom.workspace.getActiveTextEditor();

	if (!markersByEditorId[editor.id]) {
		markersByEditorId[editor.id] = {};
	}

	markersByEditorId[editor.id][row] = marker;
};

var getMarkerAtRow = function getMarkerAtRow(row) {
	var editor = atom.workspace.getActiveTextEditor();

	if (!markersByEditorId[editor.id]) {
		return null;
	}

	return markersByEditorId[editor.id][row];
};

var updateStatusbar = function updateStatusbar() {
	var statusBar = atom.views.getView(atom.workspace).querySelector('.status-bar');
	if (!statusBar) {
		return;
	}

	if (!jsHintStatusBar.parentNode) {
		statusBar.addLeftTile({ item: jsHintStatusBar });
	}

	var editor = atom.workspace.getActiveTextEditor();
	if (!editor || !errorsByEditorId[editor.id]) {
		updateStatusText();
		return;
	}

	var line = editor.getCursorBufferPosition().row + 1;
	var error = errorsByEditorId[editor.id][line] || _.first(_.compact(errorsByEditorId[editor.id]));
	error = error[0];

	updateStatusText(error.line, error.character, error.reason);
};

var getReasonsForError = function getReasonsForError(error) {
	return _.map(error, function (el) {
		return el.character + ': ' + el.reason;
	});
};

var addReasons = function addReasons(marker, error) {
	var row = getRowForError(error);
	var editorElement = atom.views.getView(atom.workspace.getActiveTextEditor());
	var reasons = '<div class="jshint-errors">' + getReasonsForError(error).join('<br>') + '</div>';

	var target = editorElement.shadowRoot.querySelectorAll('.jshint-line-number.line-number-' + row);
	var tooltip = atom.tooltips.add(target, {
		title: reasons,
		placement: 'bottom',
		delay: { show: 200 }
	});
	subscriptionTooltips.add(tooltip);
};

var displayError = function displayError(error) {
	var row = getRowForError(error);

	if (getMarkerAtRow(row)) {
		return;
	}

	var editor = atom.workspace.getActiveTextEditor();
	var marker = editor.markBufferRange([[row, 0], [row, 1]]);
	editor.decorateMarker(marker, { type: 'line', 'class': 'jshint-line' });
	editor.decorateMarker(marker, { type: 'line-number', 'class': 'jshint-line-number' });
	saveMarker(marker, row);
	addReasons(marker, error);
};

var displayErrors = function displayErrors() {
	var errors = _.compact(getErrorsForEditor());
	clearOldMarkers(errors);
	updateStatusbar();
	_.each(errors, displayError);
};

var removeMarkersForEditorId = function removeMarkersForEditorId(id) {
	if (markersByEditorId[id]) {
		delete markersByEditorId[id];
	}
};

var removeErrorsForEditorId = function removeErrorsForEditorId(id) {
	if (errorsByEditorId[id]) {
		delete errorsByEditorId[id];
	}
};

var lint = function lint() {
	var editor = atom.workspace.getActiveTextEditor();

	if (!editor) {
		return;
	}

	if (SUPPORTED_GRAMMARS.indexOf(editor.getGrammar().scopeName) === -1) {
		return;
	}

	var file = editor.getURI();

	// Hack to make JSHint look for .jshintignore in the correct dir
	// Because JSHint doesn't use its `cwd` option
	process.chdir(_path2['default'].dirname(file));

	// Remove errors and don't lint if file is ignored in .jshintignore
	if (file && cli().gather({ args: [file] }).length === 0) {
		removeErrorsForEditorId(editor.id);
		displayErrors();
		removeMarkersForEditorId(editor.id);
		return;
	}

	var config = file ? loadConfig()(file) : {};

	var linter = atom.config.get('jshint.supportLintingJsx') || atom.config.get('jshint.transformJsx') ? jsxhint().JSXHINT : jshint().JSHINT;

	var origCode = editor.getText();
	var grammarScope = editor.getGrammar().scopeName;
	var isJsx = grammarScope === 'source.jsx' || grammarScope === 'source.js.jsx';
	var code = isJsx ? (0, _reactDomPragma2['default'])(origCode) : origCode;
	var pragmaWasAdded = code !== origCode;

	try {
		linter(code, config, config.globals);
	} catch (err) {}

	removeErrorsForEditorId(editor.id);

	// workaround the errors array sometimes containing `null`
	var errors = _.compact(linter.errors);

	if (errors.length > 0) {
		(function () {
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
		})();
	}

	displayErrors();
};

var debouncedLint = null;
var debouncedDisplayErrors = null;
var debouncedUpdateStatusbar = null;

var registerEvents = function registerEvents() {
	lint();
	var workspaceElement = atom.views.getView(atom.workspace);

	debouncedLint = debouncedLint || _.debounce(lint, 50);
	debouncedDisplayErrors = debouncedDisplayErrors || _.debounce(displayErrors, 200);
	debouncedUpdateStatusbar = debouncedUpdateStatusbar || _.debounce(updateStatusbar, 100);

	atom.workspace.observeTextEditors(function (editor) {
		var buffer = editor.getBuffer();

		editor.emitter.off('scroll-top-changed', debouncedDisplayErrors);
		editor.emitter.off('did-change-cursor-position', debouncedUpdateStatusbar);
		buffer.emitter.off('did-save did-change-modified', debouncedLint);

		if (!atom.config.get('jshint.validateOnlyOnSave')) {
			buffer.onDidChangeModified(debouncedLint);
		}

		buffer.onDidSave(debouncedLint);

		editor.onDidChangeScrollTop(debouncedDisplayErrors);
		editor.onDidChangeCursorPosition(debouncedUpdateStatusbar);
	});

	workspaceElement.addEventListener('editor:will-be-removed', function (e, editorView) {
		if (editorView && editorView.editor) {
			removeErrorsForEditorId(editorView.editor.id);
			removeMarkersForEditorId(editorView.editor.id);
		}
	});
};

var config = plugin.config = {
	validateOnlyOnSave: {
		type: 'boolean',
		'default': false
	},
	supportLintingJsx: {
		type: 'boolean',
		'default': false,
		title: 'Support Linting JSX'
	}
};

exports.config = config;
var activate = plugin.activate = function () {
	_ = lodash();
	registerEvents();
	atom.config.observe('jshint.validateOnlyOnSave', registerEvents);
	atom.commands.add('atom-workspace', 'jshint:lint', lint);
};

exports.activate = activate;
exports['default'] = plugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9qc2hpbnQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7d0JBR29DLFdBQVc7O29CQUM5QixNQUFNOzs7OzhCQUNJLGtCQUFrQjs7Ozt1QkFDckIsVUFBVTs7OztBQU5sQyxXQUFXLENBQUM7O0FBUVosSUFBTSxPQUFPLEdBQUcsMEJBQVksT0FBTyxDQUFDLENBQUM7QUFDckMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2pDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqQyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdEMsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDdEMsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzVDLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNsQixJQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUM3QixJQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztBQUM1QixJQUFNLG9CQUFvQixHQUFHLGNBZHBCLG1CQUFtQixFQWMwQixDQUFDO0FBQ3ZELElBQUksQ0FBQyxZQUFBLENBQUM7O0FBRU4sSUFBTSxrQkFBa0IsR0FBRyxDQUMxQixXQUFXLEVBQ1gsWUFBWSxFQUNaLGVBQWUsQ0FDZixDQUFDOztBQUVGLElBQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkQsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUN2RCxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFOUMsSUFBTSxnQkFBZ0IsR0FBRyxTQUFuQixnQkFBZ0IsQ0FBSSxJQUFJLEVBQUUsU0FB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Q2xCLE1BQUksRUFBRSxTQUFTO0FBQ2YsYUFBUyxLQUFLO0FBQ2QsT0FBSyxFQUFFLHFCQUFxQjtFQUM1QjtDQUNELENBQUM7OztBQUVLLElBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLEdBQUcsWUFBTTtBQUMvQyxFQUFDLEdBQUcsTUFBTSxFQUFFLENBQUM7QUFDYixlQUFjLEVBQUUsQ0FBQztBQUNqQixLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUNqRSxLQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7Q0FDekQsQ0FBQzs7O3FCQUVhLE1BQU0iLCJmaWxlIjoiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2pzaGludC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vKiBnbG9iYWxzIGF0b20gKi9cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcmVhY3REb21QcmFnbWEgZnJvbSAncmVhY3QtZG9tLXByYWdtYSc7XG5pbXBvcnQgbGF6eVJlcXVpcmUgZnJvbSAnbGF6eS1yZXEnO1xuXG5jb25zdCBsYXp5UmVxID0gbGF6eVJlcXVpcmUocmVxdWlyZSk7XG5jb25zdCBsb2Rhc2ggPSBsYXp5UmVxKCdsb2Rhc2gnKTtcbmNvbnN0IGpzaGludCA9IGxhenlSZXEoJ2pzaGludCcpO1xuY29uc3QganN4aGludCA9IGxhenlSZXEoJ2pzaGludC1qc3gnKTtcbmNvbnN0IGNsaSA9IGxhenlSZXEoJ2pzaGludC9zcmMvY2xpJyk7XG5jb25zdCBsb2FkQ29uZmlnID0gbGF6eVJlcSgnLi9sb2FkLWNvbmZpZycpO1xuY29uc3QgcGx1Z2luID0ge307XG5jb25zdCBtYXJrZXJzQnlFZGl0b3JJZCA9IHt9O1xuY29uc3QgZXJyb3JzQnlFZGl0b3JJZCA9IHt9O1xuY29uc3Qgc3Vic2NyaXB0aW9uVG9vbHRpcHMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xubGV0IF87XG5cbmNvbnN0IFNVUFBPUlRFRF9HUkFNTUFSUyA9IFtcblx0J3NvdXJjZS5qcycsXG5cdCdzb3VyY2UuanN4Jyxcblx0J3NvdXJjZS5qcy5qc3gnXG5dO1xuXG5jb25zdCBqc0hpbnRTdGF0dXNCYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5qc0hpbnRTdGF0dXNCYXIuc2V0QXR0cmlidXRlKCdpZCcsICdqc2hpbnQtc3RhdHVzYmFyJyk7XG5qc0hpbnRTdGF0dXNCYXIuY2xhc3NMaXN0LmFkZCgnaW5saW5lLWJsb2NrJyk7XG5cbmNvbnN0IHVwZGF0ZVN0YXR1c1RleHQgPSAobGluZSwgY2hhcmFjdGVyLCByZWFzb24pID0+IHtcblx0anNIaW50U3RhdHVzQmFyLnRleHRDb250ZW50ID0gbGluZSAmJiBjaGFyYWN0ZXIgJiYgcmVhc29uID8gYEpTSGludCAke2xpbmV9OiR7Y2hhcmFjdGVyfSAke3JlYXNvbn1gIDogJyc7XG59O1xuXG5jb25zdCBnZXRNYXJrZXJzRm9yRWRpdG9yID0gKCkgPT4ge1xuXHRjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cblx0aWYgKGVkaXRvciAmJiBtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdKSB7XG5cdFx0cmV0dXJuIG1hcmtlcnNCeUVkaXRvcklkW2VkaXRvci5pZF07XG5cdH1cblxuXHRyZXR1cm4ge307XG59O1xuXG5jb25zdCBnZXRFcnJvcnNGb3JFZGl0b3IgPSAoKSA9PiB7XG5cdGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuXHRpZiAoZWRpdG9yICYmIGVycm9yc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSkge1xuXHRcdHJldHVybiBlcnJvcnNCeUVkaXRvcklkW2VkaXRvci5pZF07XG5cdH1cblxuXHRyZXR1cm4gW107XG59O1xuXG5jb25zdCBkZXN0cm95TWFya2VyQXRSb3cgPSByb3cgPT4ge1xuXHRjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cdGlmIChtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdICYmIG1hcmtlcnNCeUVkaXRvcklkW2VkaXRvci5pZF1bcm93XSkge1xuXHRcdG1hcmtlcnNCeUVkaXRvcklkW2VkaXRvci5pZF1bcm93XS5kZXN0cm95KCk7XG5cdFx0ZGVsZXRlIG1hcmtlcnNCeUVkaXRvcklkW2VkaXRvci5pZF1bcm93XTtcblx0fVxufTtcblxuY29uc3QgZ2V0Um93Rm9yRXJyb3IgPSBlcnJvciA9PiB7XG5cdGNvbnN0IGxpbmUgPSBlcnJvclswXS5saW5lIHx8IDE7IC8vIEpTSGludCByZXBvcnRzIGBsaW5lOiAwYCB3aGVuIGNvbmZpZyBlcnJvclxuXHRjb25zdCByb3cgPSBsaW5lIC0gMTtcblx0cmV0dXJuIHJvdztcbn07XG5cbmNvbnN0IGNsZWFyT2xkTWFya2VycyA9IGVycm9ycyA9PiB7XG5cdHN1YnNjcmlwdGlvblRvb2x0aXBzLmRpc3Bvc2UoKTtcblxuXHRjb25zdCByb3dzID0gXy5tYXAoZXJyb3JzLCBlcnJvciA9PiBnZXRSb3dGb3JFcnJvcihlcnJvcikpO1xuXG5cdGNvbnN0IG9sZE1hcmtlcnMgPSBnZXRNYXJrZXJzRm9yRWRpdG9yKCk7XG5cdF8uZWFjaChfLmtleXMob2xkTWFya2VycyksIHJvdyA9PiB7XG5cdFx0aWYgKCFfLmNvbnRhaW5zKHJvd3MsIHJvdykpIHtcblx0XHRcdGRlc3Ryb3lNYXJrZXJBdFJvdyhyb3cpO1xuXHRcdH1cblx0fSk7XG59O1xuXG5jb25zdCBzYXZlTWFya2VyID0gKG1hcmtlciwgcm93KSA9PiB7XG5cdGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuXHRpZiAoIW1hcmtlcnNCeUVkaXRvcklkW2VkaXRvci5pZF0pIHtcblx0XHRtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdID0ge307XG5cdH1cblxuXHRtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdW3Jvd10gPSBtYXJrZXI7XG59O1xuXG5jb25zdCBnZXRNYXJrZXJBdFJvdyA9IHJvdyA9PiB7XG5cdGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuXHRpZiAoIW1hcmtlcnNCeUVkaXRvcklkW2VkaXRvci5pZF0pIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHJldHVybiBtYXJrZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdW3Jvd107XG59O1xuXG5jb25zdCB1cGRhdGVTdGF0dXNiYXIgPSAoKSA9PiB7XG5cdGNvbnN0IHN0YXR1c0JhciA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSkucXVlcnlTZWxlY3RvcignLnN0YXR1cy1iYXInKTtcblx0aWYgKCFzdGF0dXNCYXIpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRpZiAoIWpzSGludFN0YXR1c0Jhci5wYXJlbnROb2RlKSB7XG5cdFx0c3RhdHVzQmFyLmFkZExlZnRUaWxlKHtpdGVtOiBqc0hpbnRTdGF0dXNCYXJ9KTtcblx0fVxuXG5cdGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblx0aWYgKCFlZGl0b3IgfHwgIWVycm9yc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSkge1xuXHRcdHVwZGF0ZVN0YXR1c1RleHQoKTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBsaW5lID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93ICsgMTtcblx0bGV0IGVycm9yID0gZXJyb3JzQnlFZGl0b3JJZFtlZGl0b3IuaWRdW2xpbmVdIHx8IF8uZmlyc3QoXy5jb21wYWN0KGVycm9yc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSkpO1xuXHRlcnJvciA9IGVycm9yWzBdO1xuXG5cdHVwZGF0ZVN0YXR1c1RleHQoZXJyb3IubGluZSwgZXJyb3IuY2hhcmFjdGVyLCBlcnJvci5yZWFzb24pO1xufTtcblxuY29uc3QgZ2V0UmVhc29uc0ZvckVycm9yID0gZXJyb3IgPT4ge1xuXHRyZXR1cm4gXy5tYXAoZXJyb3IsIGVsID0+IGAke2VsLmNoYXJhY3Rlcn06ICR7ZWwucmVhc29ufWApO1xufTtcblxuXG5jb25zdCBhZGRSZWFzb25zID0gKG1hcmtlciwgZXJyb3IpID0+IHtcblx0Y29uc3Qgcm93ID0gZ2V0Um93Rm9yRXJyb3IoZXJyb3IpO1xuXHRjb25zdCBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSk7XG5cdGNvbnN0IHJlYXNvbnMgPSBgPGRpdiBjbGFzcz1cImpzaGludC1lcnJvcnNcIj4ke2dldFJlYXNvbnNGb3JFcnJvcihlcnJvcikuam9pbignPGJyPicpfTwvZGl2PmA7XG5cblx0Y29uc3QgdGFyZ2V0ID0gZWRpdG9yRWxlbWVudC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qc2hpbnQtbGluZS1udW1iZXIubGluZS1udW1iZXItJyArIHJvdyk7XG5cdGNvbnN0IHRvb2x0aXAgPSBhdG9tLnRvb2x0aXBzLmFkZCh0YXJnZXQsIHtcblx0XHR0aXRsZTogcmVhc29ucyxcblx0XHRwbGFjZW1lbnQ6ICdib3R0b20nLFxuXHRcdGRlbGF5OiB7c2hvdzogMjAwfVxuXHR9KTtcblx0c3Vic2NyaXB0aW9uVG9vbHRpcHMuYWRkKHRvb2x0aXApO1xufTtcblxuY29uc3QgZGlzcGxheUVycm9yID0gZXJyb3IgPT4ge1xuXHRjb25zdCByb3cgPSBnZXRSb3dGb3JFcnJvcihlcnJvcik7XG5cblx0aWYgKGdldE1hcmtlckF0Um93KHJvdykpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cdGNvbnN0IG1hcmtlciA9IGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UoW1tyb3csIDBdLCBbcm93LCAxXV0pO1xuXHRlZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2xpbmUnLCBjbGFzczogJ2pzaGludC1saW5lJ30pO1xuXHRlZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7dHlwZTogJ2xpbmUtbnVtYmVyJywgY2xhc3M6ICdqc2hpbnQtbGluZS1udW1iZXInfSk7XG5cdHNhdmVNYXJrZXIobWFya2VyLCByb3cpO1xuXHRhZGRSZWFzb25zKG1hcmtlciwgZXJyb3IpO1xufTtcblxuY29uc3QgZGlzcGxheUVycm9ycyA9ICgpID0+IHtcblx0Y29uc3QgZXJyb3JzID0gXy5jb21wYWN0KGdldEVycm9yc0ZvckVkaXRvcigpKTtcblx0Y2xlYXJPbGRNYXJrZXJzKGVycm9ycyk7XG5cdHVwZGF0ZVN0YXR1c2JhcigpO1xuXHRfLmVhY2goZXJyb3JzLCBkaXNwbGF5RXJyb3IpO1xufTtcblxuY29uc3QgcmVtb3ZlTWFya2Vyc0ZvckVkaXRvcklkID0gaWQgPT4ge1xuXHRpZiAobWFya2Vyc0J5RWRpdG9ySWRbaWRdKSB7XG5cdFx0ZGVsZXRlIG1hcmtlcnNCeUVkaXRvcklkW2lkXTtcblx0fVxufTtcblxuY29uc3QgcmVtb3ZlRXJyb3JzRm9yRWRpdG9ySWQgPSBpZCA9PiB7XG5cdGlmIChlcnJvcnNCeUVkaXRvcklkW2lkXSkge1xuXHRcdGRlbGV0ZSBlcnJvcnNCeUVkaXRvcklkW2lkXTtcblx0fVxufTtcblxuY29uc3QgbGludCA9ICgpID0+IHtcblx0Y29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG5cdGlmICghZWRpdG9yKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKFNVUFBPUlRFRF9HUkFNTUFSUy5pbmRleE9mKGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lKSA9PT0gLTEpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBmaWxlID0gZWRpdG9yLmdldFVSSSgpO1xuXG5cdC8vIEhhY2sgdG8gbWFrZSBKU0hpbnQgbG9vayBmb3IgLmpzaGludGlnbm9yZSBpbiB0aGUgY29ycmVjdCBkaXJcblx0Ly8gQmVjYXVzZSBKU0hpbnQgZG9lc24ndCB1c2UgaXRzIGBjd2RgIG9wdGlvblxuXHRwcm9jZXNzLmNoZGlyKHBhdGguZGlybmFtZShmaWxlKSk7XG5cblx0Ly8gUmVtb3ZlIGVycm9ycyBhbmQgZG9uJ3QgbGludCBpZiBmaWxlIGlzIGlnbm9yZWQgaW4gLmpzaGludGlnbm9yZVxuXHRpZiAoZmlsZSAmJiBjbGkoKS5nYXRoZXIoe2FyZ3M6IFtmaWxlXX0pLmxlbmd0aCA9PT0gMCkge1xuXHRcdHJlbW92ZUVycm9yc0ZvckVkaXRvcklkKGVkaXRvci5pZCk7XG5cdFx0ZGlzcGxheUVycm9ycygpO1xuXHRcdHJlbW92ZU1hcmtlcnNGb3JFZGl0b3JJZChlZGl0b3IuaWQpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IGNvbmZpZyA9IGZpbGUgPyBsb2FkQ29uZmlnKCkoZmlsZSkgOiB7fTtcblxuXHRjb25zdCBsaW50ZXIgPSAoYXRvbS5jb25maWcuZ2V0KCdqc2hpbnQuc3VwcG9ydExpbnRpbmdKc3gnKSB8fCBhdG9tLmNvbmZpZy5nZXQoJ2pzaGludC50cmFuc2Zvcm1Kc3gnKSkgPyBqc3hoaW50KCkuSlNYSElOVCA6IGpzaGludCgpLkpTSElOVDtcblxuXHRjb25zdCBvcmlnQ29kZSA9IGVkaXRvci5nZXRUZXh0KCk7XG5cdGNvbnN0IGdyYW1tYXJTY29wZSA9IGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lO1xuXHRjb25zdCBpc0pzeCA9IGdyYW1tYXJTY29wZSA9PT0gJ3NvdXJjZS5qc3gnIHx8IGdyYW1tYXJTY29wZSA9PT0gJ3NvdXJjZS5qcy5qc3gnO1xuXHRjb25zdCBjb2RlID0gaXNKc3ggPyByZWFjdERvbVByYWdtYShvcmlnQ29kZSkgOiBvcmlnQ29kZTtcblx0Y29uc3QgcHJhZ21hV2FzQWRkZWQgPSBjb2RlICE9PSBvcmlnQ29kZTtcblxuXHR0cnkge1xuXHRcdGxpbnRlcihjb2RlLCBjb25maWcsIGNvbmZpZy5nbG9iYWxzKTtcblx0fSBjYXRjaCAoZXJyKSB7fVxuXG5cdHJlbW92ZUVycm9yc0ZvckVkaXRvcklkKGVkaXRvci5pZCk7XG5cblx0Ly8gd29ya2Fyb3VuZCB0aGUgZXJyb3JzIGFycmF5IHNvbWV0aW1lcyBjb250YWluaW5nIGBudWxsYFxuXHRjb25zdCBlcnJvcnMgPSBfLmNvbXBhY3QobGludGVyLmVycm9ycyk7XG5cblx0aWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG5cdFx0Ly8gYWdncmVnYXRlIHNhbWUtbGluZSBlcnJvcnNcblx0XHRjb25zdCByZXQgPSBbXTtcblx0XHRfLmVhY2goZXJyb3JzLCBlbCA9PiB7XG5cdFx0XHRpZiAocHJhZ21hV2FzQWRkZWQpIHtcblx0XHRcdFx0ZWwubGluZS0tO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBsID0gZWwubGluZTtcblxuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkocmV0W2xdKSkge1xuXHRcdFx0XHRyZXRbbF0ucHVzaChlbCk7XG5cblx0XHRcdFx0cmV0W2xdID0gXy5zb3J0QnkocmV0W2xdLCBlbCA9PiBlbC5jaGFyYWN0ZXIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0W2xdID0gW2VsXTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGVycm9yc0J5RWRpdG9ySWRbZWRpdG9yLmlkXSA9IHJldDtcblx0fVxuXG5cdGRpc3BsYXlFcnJvcnMoKTtcbn07XG5cbmxldCBkZWJvdW5jZWRMaW50ID0gbnVsbDtcbmxldCBkZWJvdW5jZWREaXNwbGF5RXJyb3JzID0gbnVsbDtcbmxldCBkZWJvdW5jZWRVcGRhdGVTdGF0dXNiYXIgPSBudWxsO1xuXG5jb25zdCByZWdpc3RlckV2ZW50cyA9ICgpID0+IHtcblx0bGludCgpO1xuXHRjb25zdCB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKTtcblxuXHRkZWJvdW5jZWRMaW50ID0gZGVib3VuY2VkTGludCB8fCBfLmRlYm91bmNlKGxpbnQsIDUwKTtcblx0ZGVib3VuY2VkRGlzcGxheUVycm9ycyA9IGRlYm91bmNlZERpc3BsYXlFcnJvcnMgfHwgXy5kZWJvdW5jZShkaXNwbGF5RXJyb3JzLCAyMDApO1xuXHRkZWJvdW5jZWRVcGRhdGVTdGF0dXNiYXIgPSBkZWJvdW5jZWRVcGRhdGVTdGF0dXNiYXIgfHwgXy5kZWJvdW5jZSh1cGRhdGVTdGF0dXNiYXIsIDEwMCk7XG5cblx0YXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKGVkaXRvciA9PiB7XG5cdFx0Y29uc3QgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpO1xuXG5cdFx0ZWRpdG9yLmVtaXR0ZXIub2ZmKCdzY3JvbGwtdG9wLWNoYW5nZWQnLCBkZWJvdW5jZWREaXNwbGF5RXJyb3JzKTtcblx0XHRlZGl0b3IuZW1pdHRlci5vZmYoJ2RpZC1jaGFuZ2UtY3Vyc29yLXBvc2l0aW9uJywgZGVib3VuY2VkVXBkYXRlU3RhdHVzYmFyKTtcblx0XHRidWZmZXIuZW1pdHRlci5vZmYoJ2RpZC1zYXZlIGRpZC1jaGFuZ2UtbW9kaWZpZWQnLCBkZWJvdW5jZWRMaW50KTtcblxuXHRcdGlmICghYXRvbS5jb25maWcuZ2V0KCdqc2hpbnQudmFsaWRhdGVPbmx5T25TYXZlJykpIHtcblx0XHRcdGJ1ZmZlci5vbkRpZENoYW5nZU1vZGlmaWVkKGRlYm91bmNlZExpbnQpO1xuXHRcdH1cblxuXHRcdGJ1ZmZlci5vbkRpZFNhdmUoZGVib3VuY2VkTGludCk7XG5cblx0XHRlZGl0b3Iub25EaWRDaGFuZ2VTY3JvbGxUb3AoZGVib3VuY2VkRGlzcGxheUVycm9ycyk7XG5cdFx0ZWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oZGVib3VuY2VkVXBkYXRlU3RhdHVzYmFyKTtcblx0fSk7XG5cblx0d29ya3NwYWNlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdlZGl0b3I6d2lsbC1iZS1yZW1vdmVkJywgKGUsIGVkaXRvclZpZXcpID0+IHtcblx0XHRpZiAoZWRpdG9yVmlldyAmJiBlZGl0b3JWaWV3LmVkaXRvcikge1xuXHRcdFx0cmVtb3ZlRXJyb3JzRm9yRWRpdG9ySWQoZWRpdG9yVmlldy5lZGl0b3IuaWQpO1xuXHRcdFx0cmVtb3ZlTWFya2Vyc0ZvckVkaXRvcklkKGVkaXRvclZpZXcuZWRpdG9yLmlkKTtcblx0XHR9XG5cdH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHBsdWdpbi5jb25maWcgPSB7XG5cdHZhbGlkYXRlT25seU9uU2F2ZToge1xuXHRcdHR5cGU6ICdib29sZWFuJyxcblx0XHRkZWZhdWx0OiBmYWxzZVxuXHR9LFxuXHRzdXBwb3J0TGludGluZ0pzeDoge1xuXHRcdHR5cGU6ICdib29sZWFuJyxcblx0XHRkZWZhdWx0OiBmYWxzZSxcblx0XHR0aXRsZTogJ1N1cHBvcnQgTGludGluZyBKU1gnXG5cdH1cbn07XG5cbmV4cG9ydCBjb25zdCBhY3RpdmF0ZSA9IHBsdWdpbi5hY3RpdmF0ZSA9ICgpID0+IHtcblx0XyA9IGxvZGFzaCgpO1xuXHRyZWdpc3RlckV2ZW50cygpO1xuXHRhdG9tLmNvbmZpZy5vYnNlcnZlKCdqc2hpbnQudmFsaWRhdGVPbmx5T25TYXZlJywgcmVnaXN0ZXJFdmVudHMpO1xuXHRhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnanNoaW50OmxpbnQnLCBsaW50KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHBsdWdpbjtcbiJdfQ==