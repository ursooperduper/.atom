/** @preserve
*  Copyright (c) 2014, Facebook, Inc.
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree. An additional grant
*  of patent rights can be found in the PATENTS file in the same directory.
*
*/
"use strict";

/**
* This is a very simple HTML to JSX converter. It turns out that browsers
* have good HTML parsers (who would have thought?) so we utilise this by
* inserting the HTML into a temporary DOM node, and then do a breadth-first
* traversal of the resulting DOM tree.
*/

// https://developer.mozilla.org/en-US/docs/Web/API/Node.nodeType
var NODE_TYPE = {
  ELEMENT: 1,
  TEXT: 3,
  COMMENT: 8
};

var ATTRIBUTE_MAPPING = {
  "for": "htmlFor",
  "class": "className"
};

var ELEMENT_ATTRIBUTE_MAPPING = {
  input: {
    checked: "defaultChecked",
    value: "defaultValue"
  }
};

/**
* Repeats a string a certain number of times.
* Also: the future is bright and consists of native string repetition:
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
*
* @param {string} string  String to repeat
* @param {number} times   Number of times to repeat string. Integer.
* @see http://jsperf.com/string-repeater/2
*/
function repeatString(string, times) {
  if (times === 1) {
    return string;
  }
  if (times < 0) {
    throw new Error();
  }
  var repeated = "";
  while (times) {
    if (times & 1) {
      repeated += string;
    }
    if (times >>= 1) {
      string += string;
    }
  }
  return repeated;
}

/**
* Determine if the string ends with the specified substring.
*
* @param {string} haystack String to search in
* @param {string} needle   String to search for
* @return {boolean}
*/
function endsWith(haystack, needle) {
  return haystack.slice(-needle.length) === needle;
}

/**
* Trim the specified substring off the string. If the string does not end
* with the specified substring, this is a no-op.
*
* @param {string} haystack String to search in
* @param {string} needle   String to search for
* @return {string}
*/
function trimEnd(haystack, needle) {
  return endsWith(haystack, needle) ? haystack.slice(0, -needle.length) : haystack;
}

/**
* Convert a hyphenated string to camelCase.
*/
function hyphenToCamelCase(string) {
  return string.replace(/-(.)/g, function (match, chr) {
    return chr.toUpperCase();
  });
}

/**
* Determines if the specified string consists entirely of whitespace.
*/
function isEmpty(string) {
  return !/[^\s]/.test(string);
}

/**
* Determines if the CSS value can be converted from a
* 'px' suffixed string to a numeric value
*
* @param {string} value CSS property value
* @return {boolean}
*/
function isConvertiblePixelValue(value) {
  return /^\d+px$/.test(value);
}

/**
* Determines if the specified string consists entirely of numeric characters.
*/
function isNumeric(input) {
  return input !== undefined && input !== null && (typeof input === "number" || parseInt(input, 10) == input);
}

var createElement = function createElement(tag) {
  return document.createElement(tag);
};

var tempEl = createElement("div");
/**
* Escapes special characters by converting them to their escaped equivalent
* (eg. "<" to "&lt;"). Only escapes characters that absolutely must be escaped.
*
* @param {string} value
* @return {string}
*/
function escapeSpecialChars(value) {
  // Uses this One Weird Trick to escape text - Raw text inserted as textContent
  // will have its escaped version in innerHTML.
  tempEl.textContent = value;
  return tempEl.innerHTML;
}

var HTMLtoJSX = function (config) {
  this.config = config || {};

  if (this.config.createClass === undefined) {
    this.config.createClass = true;
  }
  if (!this.config.indent) {
    this.config.indent = "  ";
  }
  if (!this.config.outputClassName) {
    this.config.outputClassName = "NewComponent";
  }
};

HTMLtoJSX.prototype = {
  /**
  * Reset the internal state of the converter
  */
  reset: function () {
    this.output = "";
    this.level = 0;
  },
  /**
  * Main entry point to the converter. Given the specified HTML, returns a
  * JSX object representing it.
  * @param {string} html HTML to convert
  * @return {string} JSX
  */
  convert: function (html) {
    this.reset();

    var containerEl = createElement("div");
    containerEl.innerHTML = "\n" + this._cleanInput(html) + "\n";

    if (this.config.createClass) {
      if (this.config.outputClassName) {
        this.output = "var " + this.config.outputClassName + " = React.createClass({\n";
      } else {
        this.output = "React.createClass({\n";
      }
      this.output += this.config.indent + "render: function() {" + "\n";
      this.output += this.config.indent + this.config.indent + "return (\n";
    }

    if (this._onlyOneTopLevel(containerEl)) {
      // Only one top-level element, the component can return it directly
      // No need to actually visit the container element
      this._traverse(containerEl);
    } else {
      // More than one top-level element, need to wrap the whole thing in a
      // container.
      this.output += this.config.indent + this.config.indent + this.config.indent;
      this.level++;
      this._visit(containerEl);
    }
    this.output = this.output.trim() + "\n";
    if (this.config.createClass) {
      this.output += this.config.indent + this.config.indent + ");\n";
      this.output += this.config.indent + "}\n";
      this.output += "});";
    }
    return this.output;
  },

  /**
  * Cleans up the specified HTML so it's in a format acceptable for
  * converting.
  *
  * @param {string} html HTML to clean
  * @return {string} Cleaned HTML
  */
  _cleanInput: function (html) {
    // Remove unnecessary whitespace
    html = html.trim();
    // Ugly method to strip script tags. They can wreak havoc on the DOM nodes
    // so let's not even put them in the DOM.
    html = html.replace(/<script([\s\S]*?)<\/script>/g, "");
    return html;
  },

  /**
  * Determines if there's only one top-level node in the DOM tree. That is,
  * all the HTML is wrapped by a single HTML tag.
  *
  * @param {DOMElement} containerEl Container element
  * @return {boolean}
  */
  _onlyOneTopLevel: function (containerEl) {
    // Only a single child element
    if (containerEl.childNodes.length === 1 && containerEl.childNodes[0].nodeType === NODE_TYPE.ELEMENT) {
      return true;
    }
    // Only one element, and all other children are whitespace
    var foundElement = false;
    for (var i = 0, count = containerEl.childNodes.length; i < count; i++) {
      var child = containerEl.childNodes[i];
      if (child.nodeType === NODE_TYPE.ELEMENT) {
        if (foundElement) {
          // Encountered an element after already encountering another one
          // Therefore, more than one element at root level
          return false;
        } else {
          foundElement = true;
        }
      } else if (child.nodeType === NODE_TYPE.TEXT && !isEmpty(child.textContent)) {
        // Contains text content
        return false;
      }
    }
    return true;
  },

  /**
  * Gets a newline followed by the correct indentation for the current
  * nesting level
  *
  * @return {string}
  */
  _getIndentedNewline: function () {
    return "\n" + repeatString(this.config.indent, this.level + 2);
  },

  /**
  * Handles processing the specified node
  *
  * @param {Node} node
  */
  _visit: function (node) {
    this._beginVisit(node);
    this._traverse(node);
    this._endVisit(node);
  },

  /**
  * Traverses all the children of the specified node
  *
  * @param {Node} node
  */
  _traverse: function (node) {
    this.level++;
    for (var i = 0, count = node.childNodes.length; i < count; i++) {
      this._visit(node.childNodes[i]);
    }
    this.level--;
  },

  /**
  * Handle pre-visit behaviour for the specified node.
  *
  * @param {Node} node
  */
  _beginVisit: function (node) {
    switch (node.nodeType) {
      case NODE_TYPE.ELEMENT:
        this._beginVisitElement(node);
        break;

      case NODE_TYPE.TEXT:
        this._visitText(node);
        break;

      case NODE_TYPE.COMMENT:
        this._visitComment(node);
        break;

      default:
        console.warn("Unrecognised node type: " + node.nodeType);
    }
  },

  /**
  * Handles post-visit behaviour for the specified node.
  *
  * @param {Node} node
  */
  _endVisit: function (node) {
    switch (node.nodeType) {
      case NODE_TYPE.ELEMENT:
        this._endVisitElement(node);
        break;
      // No ending tags required for these types
      case NODE_TYPE.TEXT:
      case NODE_TYPE.COMMENT:
        break;
    }
  },

  /**
  * Handles pre-visit behaviour for the specified element node
  *
  * @param {DOMElement} node
  */
  _beginVisitElement: function (node) {
    var tagName = node.tagName.toLowerCase();
    var attributes = [];
    for (var i = 0, count = node.attributes.length; i < count; i++) {
      attributes.push(this._getElementAttribute(node, node.attributes[i]));
    }

    this.output += "<" + tagName;
    if (attributes.length > 0) {
      this.output += " " + attributes.join(" ");
    }
    if (node.firstChild) {
      this.output += ">";
    }
  },

  /**
  * Handles post-visit behaviour for the specified element node
  *
  * @param {Node} node
  */
  _endVisitElement: function (node) {
    // De-indent a bit
    // TODO: It's inefficient to do it this way :/
    this.output = trimEnd(this.output, this.config.indent);
    if (node.firstChild) {
      this.output += "</" + node.tagName.toLowerCase() + ">";
    } else {
      this.output += " />";
    }
  },

  /**
  * Handles processing of the specified text node
  *
  * @param {TextNode} node
  */
  _visitText: function (node) {
    var text = node.textContent;
    // If there's a newline in the text, adjust the indent level
    if (text.indexOf("\n") > -1) {
      text = node.textContent.replace(/\n\s*/g, this._getIndentedNewline());
    }
    this.output += escapeSpecialChars(text);
  },

  /**
  * Handles processing of the specified text node
  *
  * @param {Text} node
  */
  _visitComment: function (node) {
    // Do not render the comment
    // Since we remove comments, we also need to remove the next line break so we
    // don't end up with extra whitespace after every comment
    //if (node.nextSibling && node.nextSibling.nodeType === NODE_TYPE.TEXT) {
    //  node.nextSibling.textContent = node.nextSibling.textContent.replace(/\n\s*/, '');
    //}
    this.output += "{/*" + node.textContent.replace("*/", "* /") + "*/}";
  },

  /**
  * Gets a JSX formatted version of the specified attribute from the node
  *
  * @param {DOMElement} node
  * @param {object}     attribute
  * @return {string}
  */
  _getElementAttribute: function (node, attribute) {
    switch (attribute.name) {
      case "style":
        return this._getStyleAttribute(attribute.value);
      default:
        var tagName = node.tagName.toLowerCase();
        var name = ELEMENT_ATTRIBUTE_MAPPING[tagName] && ELEMENT_ATTRIBUTE_MAPPING[tagName][attribute.name] || ATTRIBUTE_MAPPING[attribute.name] || attribute.name;
        var result = name;

        // Numeric values should be output as {123} not "123"
        if (isNumeric(attribute.value)) {
          result += "={" + attribute.value + "}";
        } else if (attribute.value.length > 0) {
          result += "=\"" + attribute.value.replace("\"", "&quot;") + "\"";
        }
        return result;
    }
  },

  /**
  * Gets a JSX formatted version of the specified element styles
  *
  * @param {string} styles
  * @return {string}
  */
  _getStyleAttribute: function (styles) {
    var jsxStyles = new StyleParser(styles).toJSXString();
    return "style={{" + jsxStyles + "}}";
  }
};

/**
* Handles parsing of inline styles
*
* @param {string} rawStyle Raw style attribute
* @constructor
*/
var StyleParser = function (rawStyle) {
  this.parse(rawStyle);
};
StyleParser.prototype = {
  /**
  * Parse the specified inline style attribute value
  * @param {string} rawStyle Raw style attribute
  */
  parse: function (rawStyle) {
    this.styles = {};
    rawStyle.split(";").forEach(function (style) {
      style = style.trim();
      var firstColon = style.indexOf(":");
      var key = style.substr(0, firstColon);
      var value = style.substr(firstColon + 1).trim();
      if (key !== "") {
        this.styles[key] = value;
      }
    }, this);
  },

  /**
  * Convert the style information represented by this parser into a JSX
  * string
  *
  * @return {string}
  */
  toJSXString: function () {
    var output = [];
    for (var key in this.styles) {
      if (!this.styles.hasOwnProperty(key)) {
        continue;
      }
      output.push(this.toJSXKey(key) + ": " + this.toJSXValue(this.styles[key]));
    }
    return output.join(", ");
  },

  /**
  * Convert the CSS style key to a JSX style key
  *
  * @param {string} key CSS style key
  * @return {string} JSX style key
  */
  toJSXKey: function (key) {
    return hyphenToCamelCase(key);
  },

  /**
  * Convert the CSS style value to a JSX style value
  *
  * @param {string} value CSS style value
  * @return {string} JSX style value
  */
  toJSXValue: function (value) {
    if (isNumeric(value)) {
      // If numeric, no quotes
      return value;
    } else if (isConvertiblePixelValue(value)) {
      // "500px" -> 500
      return trimEnd(value, "px");
    } else {
      // Probably a string, wrap it in quotes
      return "'" + value.replace(/'/g, "\"") + "'";
    }
  }
};

module.exports = HTMLtoJSX;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9yZWFjdC9saWIvaHRtbHRvanN4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQVNBLFlBQVksQ0FBQzs7Ozs7Ozs7OztBQVViLElBQUksU0FBUyxHQUFHO0FBQ2QsU0FBTyxFQUFFLENBQUM7QUFDVixNQUFJLEVBQUUsQ0FBQztBQUNQLFNBQU8sRUFBRSxDQUFDO0NBQ1gsQ0FBQzs7QUFFRixJQUFJLGlCQUFpQixHQUFHO0FBQ3RCLE9BQUssRUFBRSxTQUFTO0FBQ2hCLFNBQU8sRUFBRSxXQUFXO0NBQ3JCLENBQUM7O0FBRUYsSUFBSSx5QkFBeUIsR0FBRztBQUM5QixTQUFTO0FBQ1AsYUFBVyxnQkFBZ0I7QUFDM0IsV0FBUyxjQUFjO0dBQ3hCO0NBQ0YsQ0FBQzs7Ozs7Ozs7Ozs7QUFXRixTQUFTLFlBQVksQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQ25DLE1BQUksS0FBSyxLQUFLLENBQUMsRUFBRTtBQUNmLFdBQU8sTUFBTSxDQUFDO0dBQ2Y7QUFDRCxNQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7QUFBRSxVQUFNLElBQUksS0FBSyxFQUFFLENBQUM7R0FBRTtBQUNyQyxNQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbEIsU0FBTyxLQUFLLEVBQUU7QUFDWixRQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7QUFDYixjQUFRLElBQUksTUFBTSxDQUFDO0tBQ3BCO0FBQ0QsUUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO0FBQ2YsWUFBTSxJQUFJLE1BQU0sQ0FBQztLQUNsQjtHQUNGO0FBQ0QsU0FBTyxRQUFRLENBQUM7Q0FDakI7Ozs7Ozs7OztBQVNELFNBQVMsUUFBUSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUU7QUFDbEMsU0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLE1BQU0sQ0FBQztDQUNsRDs7Ozs7Ozs7OztBQVVELFNB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ZCxNQUFNLElBQUksdUJBQXVCLENBQUMsS0FBSyxDQUFDLEVBQUU7O0FBRXpDLGFBQU8sT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztLQUM3QixNQUFNOztBQUVMLGFBQU8sR0FBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUcsQ0FBQyxHQUFHLEdBQUksQ0FBQztLQUMvQztHQUNGO0NBQ0YsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvc2FyYWgvLmF0b20vcGFja2FnZXMvcmVhY3QvbGliL2h0bWx0b2pzeC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAcHJlc2VydmVcbiogIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiogIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4qXG4qICBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiogIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuKiAgb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4qXG4qL1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiogVGhpcyBpcyBhIHZlcnkgc2ltcGxlIEhUTUwgdG8gSlNYIGNvbnZlcnRlci4gSXQgdHVybnMgb3V0IHRoYXQgYnJvd3NlcnNcbiogaGF2ZSBnb29kIEhUTUwgcGFyc2VycyAod2hvIHdvdWxkIGhhdmUgdGhvdWdodD8pIHNvIHdlIHV0aWxpc2UgdGhpcyBieVxuKiBpbnNlcnRpbmcgdGhlIEhUTUwgaW50byBhIHRlbXBvcmFyeSBET00gbm9kZSwgYW5kIHRoZW4gZG8gYSBicmVhZHRoLWZpcnN0XG4qIHRyYXZlcnNhbCBvZiB0aGUgcmVzdWx0aW5nIERPTSB0cmVlLlxuKi9cblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUubm9kZVR5cGVcbnZhciBOT0RFX1RZUEUgPSB7XG4gIEVMRU1FTlQ6IDEsXG4gIFRFWFQ6IDMsXG4gIENPTU1FTlQ6IDhcbn07XG5cbnZhciBBVFRSSUJVVEVfTUFQUElORyA9IHtcbiAgJ2Zvcic6ICdodG1sRm9yJyxcbiAgJ2NsYXNzJzogJ2NsYXNzTmFtZSdcbn07XG5cbnZhciBFTEVNRU5UX0FUVFJJQlVURV9NQVBQSU5HID0ge1xuICAnaW5wdXQnOiB7XG4gICAgJ2NoZWNrZWQnOiAnZGVmYXVsdENoZWNrZWQnLFxuICAgICd2YWx1ZSc6ICdkZWZhdWx0VmFsdWUnXG4gIH1cbn07XG5cbi8qKlxuKiBSZXBlYXRzIGEgc3RyaW5nIGEgY2VydGFpbiBudW1iZXIgb2YgdGltZXMuXG4qIEFsc286IHRoZSBmdXR1cmUgaXMgYnJpZ2h0IGFuZCBjb25zaXN0cyBvZiBuYXRpdmUgc3RyaW5nIHJlcGV0aXRpb246XG4qIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1N0cmluZy9yZXBlYXRcbipcbiogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyAgU3RyaW5nIHRvIHJlcGVhdFxuKiBAcGFyYW0ge251bWJlcn0gdGltZXMgICBOdW1iZXIgb2YgdGltZXMgdG8gcmVwZWF0IHN0cmluZy4gSW50ZWdlci5cbiogQHNlZSBodHRwOi8vanNwZXJmLmNvbS9zdHJpbmctcmVwZWF0ZXIvMlxuKi9cbmZ1bmN0aW9uIHJlcGVhdFN0cmluZyhzdHJpbmcsIHRpbWVzKSB7XG4gIGlmICh0aW1lcyA9PT0gMSkge1xuICAgIHJldHVybiBzdHJpbmc7XG4gIH1cbiAgaWYgKHRpbWVzIDwgMCkgeyB0aHJvdyBuZXcgRXJyb3IoKTsgfVxuICB2YXIgcmVwZWF0ZWQgPSAnJztcbiAgd2hpbGUgKHRpbWVzKSB7XG4gICAgaWYgKHRpbWVzICYgMSkge1xuICAgICAgcmVwZWF0ZWQgKz0gc3RyaW5nO1xuICAgIH1cbiAgICBpZiAodGltZXMgPj49IDEpIHtcbiAgICAgIHN0cmluZyArPSBzdHJpbmc7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXBlYXRlZDtcbn1cblxuLyoqXG4qIERldGVybWluZSBpZiB0aGUgc3RyaW5nIGVuZHMgd2l0aCB0aGUgc3BlY2lmaWVkIHN1YnN0cmluZy5cbipcbiogQHBhcmFtIHtzdHJpbmd9IGhheXN0YWNrIFN0cmluZyB0byBzZWFyY2ggaW5cbiogQHBhcmFtIHtzdHJpbmd9IG5lZWRsZSAgIFN0cmluZyB0byBzZWFyY2ggZm9yXG4qIEByZXR1cm4ge2Jvb2xlYW59XG4qL1xuZnVuY3Rpb24gZW5kc1dpdGgoaGF5c3RhY2ssIG5lZWRsZSkge1xuICByZXR1cm4gaGF5c3RhY2suc2xpY2UoLW5lZWRsZS5sZW5ndGgpID09PSBuZWVkbGU7XG59XG5cbi8qKlxuKiBUcmltIHRoZSBzcGVjaWZpZWQgc3Vic3RyaW5nIG9mZiB0aGUgc3RyaW5nLiBJZiB0aGUgc3RyaW5nIGRvZXMgbm90IGVuZFxuKiB3aXRoIHRoZSBzcGVjaWZpZWQgc3Vic3RyaW5nLCB0aGlzIGlzIGEgbm8tb3AuXG4qXG4qIEBwYXJhbSB7c3RyaW5nfSBoYXlzdGFjayBTdHJpbmcgdG8gc2VhcmNoIGluXG4qIEBwYXJhbSB7c3RyaW5nfSBuZWVkbGUgICBTdHJpbmcgdG8gc2VhcmNoIGZvclxuKiBAcmV0dXJuIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gdHJpbUVuZChoYXlzdGFjaywgbmVlZGxlKSB7XG4gIHJldHVybiBlbmRzV2l0aChoYXlzdGFjaywgbmVlZGxlKVxuICA/IGhheXN0YWNrLnNsaWNlKDAsIC1uZWVkbGUubGVuZ3RoKVxuICA6IGhheXN0YWNrO1xufVxuXG4vKipcbiogQ29udmVydCBhIGh5cGhlbmF0ZWQgc3RyaW5nIHRvIGNhbWVsQ2FzZS5cbiovXG5mdW5jdGlvbiBoeXBoZW5Ub0NhbWVsQ2FzZShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC8tKC4pL2csIGZ1bmN0aW9uKG1hdGNoLCBjaHIpIHtcbiAgICByZXR1cm4gY2hyLnRvVXBwZXJDYXNlKCk7XG4gIH0pO1xufVxuXG4vKipcbiogRGV0ZXJtaW5lcyBpZiB0aGUgc3BlY2lmaWVkIHN0cmluZyBjb25zaXN0cyBlbnRpcmVseSBvZiB3aGl0ZXNwYWNlLlxuKi9cbmZ1bmN0aW9uIGlzRW1wdHkoc3RyaW5nKSB7XG4gIHJldHVybiAhL1teXFxzXS8udGVzdChzdHJpbmcpO1xufVxuXG4vKipcbiogRGV0ZXJtaW5lcyBpZiB0aGUgQ1NTIHZhbHVlIGNhbiBiZSBjb252ZXJ0ZWQgZnJvbSBhXG4qICdweCcgc3VmZml4ZWQgc3RyaW5nIHRvIGEgbnVtZXJpYyB2YWx1ZVxuKlxuKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgQ1NTIHByb3BlcnR5IHZhbHVlXG4qIEByZXR1cm4ge2Jvb2xlYW59XG4qL1xuZnVuY3Rpb24gaXNDb252ZXJ0aWJsZVBpeGVsVmFsdWUodmFsdWUpIHtcbiAgcmV0dXJuIC9eXFxkK3B4JC8udGVzdCh2YWx1ZSk7XG59XG5cbi8qKlxuKiBEZXRlcm1pbmVzIGlmIHRoZSBzcGVjaWZpZWQgc3RyaW5nIGNvbnNpc3RzIGVudGlyZWx5IG9mIG51bWVyaWMgY2hhcmFjdGVycy5cbiovXG5mdW5jdGlvbiBpc051bWVyaWMoaW5wdXQpIHtcbiAgcmV0dXJuIGlucHV0ICE9PSB1bmRlZmluZWRcbiAgJiYgaW5wdXQgIT09IG51bGxcbiAgJiYgKHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicgfHwgcGFyc2VJbnQoaW5wdXQsIDEwKSA9PSBpbnB1dCk7XG59XG5cbnZhciBjcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0YWcpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xufTtcblxudmFyIHRlbXBFbCA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuLyoqXG4qIEVzY2FwZXMgc3BlY2lhbCBjaGFyYWN0ZXJzIGJ5IGNvbnZlcnRpbmcgdGhlbSB0byB0aGVpciBlc2NhcGVkIGVxdWl2YWxlbnRcbiogKGVnLiBcIjxcIiB0byBcIiZsdDtcIikuIE9ubHkgZXNjYXBlcyBjaGFyYWN0ZXJzIHRoYXQgYWJzb2x1dGVseSBtdXN0IGJlIGVzY2FwZWQuXG4qXG4qIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuKiBAcmV0dXJuIHtzdHJpbmd9XG4qL1xuZnVuY3Rpb24gZXNjYXBlU3BlY2lhbENoYXJzKHZhbHVlKSB7XG4gIC8vIFVzZXMgdGhpcyBPbmUgV2VpcmQgVHJpY2sgdG8gZXNjYXBlIHRleHQgLSBSYXcgdGV4dCBpbnNlcnRlZCBhcyB0ZXh0Q29udGVudFxuICAvLyB3aWxsIGhhdmUgaXRzIGVzY2FwZWQgdmVyc2lvbiBpbiBpbm5lckhUTUwuXG4gIHRlbXBFbC50ZXh0Q29udGVudCA9IHZhbHVlO1xuICByZXR1cm4gdGVtcEVsLmlubmVySFRNTDtcbn1cblxudmFyIEhUTUx0b0pTWCA9IGZ1bmN0aW9uKGNvbmZpZykge1xuICB0aGlzLmNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuICBpZiAodGhpcy5jb25maWcuY3JlYXRlQ2xhc3MgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuY29uZmlnLmNyZWF0ZUNsYXNzID0gdHJ1ZTtcbiAgfVxuICBpZiAoIXRoaXMuY29uZmlnLmluZGVudCkge1xuICAgIHRoaXMuY29uZmlnLmluZGVudCA9ICcgICc7XG4gIH1cbiAgaWYgKCF0aGlzLmNvbmZpZy5vdXRwdXRDbGFzc05hbWUpIHtcbiAgICB0aGlzLmNvbmZpZy5vdXRwdXRDbGFzc05hbWUgPSAnTmV3Q29tcG9uZW50JztcbiAgfVxufTtcblxuSFRNTHRvSlNYLnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gICogUmVzZXQgdGhlIGludGVybmFsIHN0YXRlIG9mIHRoZSBjb252ZXJ0ZXJcbiAgKi9cbiAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMub3V0cHV0ID0gJyc7XG4gICAgdGhpcy5sZXZlbCA9IDA7XG4gIH0sXG4gIC8qKlxuICAqIE1haW4gZW50cnkgcG9pbnQgdG8gdGhlIGNvbnZlcnRlci4gR2l2ZW4gdGhlIHNwZWNpZmllZCBIVE1MLCByZXR1cm5zIGFcbiAgKiBKU1ggb2JqZWN0IHJlcHJlc2VudGluZyBpdC5cbiAgKiBAcGFyYW0ge3N0cmluZ30gaHRtbCBIVE1MIHRvIGNvbnZlcnRcbiAgKiBAcmV0dXJuIHtzdHJpbmd9IEpTWFxuICAqL1xuICBjb252ZXJ0OiBmdW5jdGlvbihodG1sKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuXG4gICAgdmFyIGNvbnRhaW5lckVsID0gY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGFpbmVyRWwuaW5uZXJIVE1MID0gJ1xcbicgKyB0aGlzLl9jbGVhbklucHV0KGh0bWwpICsgJ1xcbic7XG5cbiAgICBpZiAodGhpcy5jb25maWcuY3JlYXRlQ2xhc3MpIHtcbiAgICAgIGlmICh0aGlzLmNvbmZpZy5vdXRwdXRDbGFzc05hbWUpIHtcbiAgICAgICAgdGhpcy5vdXRwdXQgPSAndmFyICcgKyB0aGlzLmNvbmZpZy5vdXRwdXRDbGFzc05hbWUgKyAnID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xcbic7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm91dHB1dCA9ICdSZWFjdC5jcmVhdGVDbGFzcyh7XFxuJztcbiAgICAgIH1cbiAgICAgIHRoaXMub3V0cHV0ICs9IHRoaXMuY29uZmlnLmluZGVudCArICdyZW5kZXI6IGZ1bmN0aW9uKCkgeycgKyBcIlxcblwiO1xuICAgICAgdGhpcy5vdXRwdXQgKz0gdGhpcy5jb25maWcuaW5kZW50ICsgdGhpcy5jb25maWcuaW5kZW50ICsgJ3JldHVybiAoXFxuJztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb25seU9uZVRvcExldmVsKGNvbnRhaW5lckVsKSkge1xuICAgICAgLy8gT25seSBvbmUgdG9wLWxldmVsIGVsZW1lbnQsIHRoZSBjb21wb25lbnQgY2FuIHJldHVybiBpdCBkaXJlY3RseVxuICAgICAgLy8gTm8gbmVlZCB0byBhY3R1YWxseSB2aXNpdCB0aGUgY29udGFpbmVyIGVsZW1lbnRcbiAgICAgIHRoaXMuX3RyYXZlcnNlKGNvbnRhaW5lckVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTW9yZSB0aGFuIG9uZSB0b3AtbGV2ZWwgZWxlbWVudCwgbmVlZCB0byB3cmFwIHRoZSB3aG9sZSB0aGluZyBpbiBhXG4gICAgICAvLyBjb250YWluZXIuXG4gICAgICB0aGlzLm91dHB1dCArPSB0aGlzLmNvbmZpZy5pbmRlbnQgKyB0aGlzLmNvbmZpZy5pbmRlbnQgKyB0aGlzLmNvbmZpZy5pbmRlbnQ7XG4gICAgICB0aGlzLmxldmVsKys7XG4gICAgICB0aGlzLl92aXNpdChjb250YWluZXJFbCk7XG4gICAgfVxuICAgIHRoaXMub3V0cHV0ID0gdGhpcy5vdXRwdXQudHJpbSgpICsgJ1xcbic7XG4gICAgaWYgKHRoaXMuY29uZmlnLmNyZWF0ZUNsYXNzKSB7XG4gICAgICB0aGlzLm91dHB1dCArPSB0aGlzLmNvbmZpZy5pbmRlbnQgKyB0aGlzLmNvbmZpZy5pbmRlbnQgKyAnKTtcXG4nO1xuICAgICAgdGhpcy5vdXRwdXQgKz0gdGhpcy5jb25maWcuaW5kZW50ICsgJ31cXG4nO1xuICAgICAgdGhpcy5vdXRwdXQgKz0gJ30pOyc7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm91dHB1dDtcbiAgfSxcblxuICAvKipcbiAgKiBDbGVhbnMgdXAgdGhlIHNwZWNpZmllZCBIVE1MIHNvIGl0J3MgaW4gYSBmb3JtYXQgYWNjZXB0YWJsZSBmb3JcbiAgKiBjb252ZXJ0aW5nLlxuICAqXG4gICogQHBhcmFtIHtzdHJpbmd9IGh0bWwgSFRNTCB0byBjbGVhblxuICAqIEByZXR1cm4ge3N0cmluZ30gQ2xlYW5lZCBIVE1MXG4gICovXG4gIF9jbGVhbklucHV0OiBmdW5jdGlvbihodG1sKSB7XG4gICAgLy8gUmVtb3ZlIHVubmVjZXNzYXJ5IHdoaXRlc3BhY2VcbiAgICBodG1sID0gaHRtbC50cmltKCk7XG4gICAgLy8gVWdseSBtZXRob2QgdG8gc3RyaXAgc2NyaXB0IHRhZ3MuIFRoZXkgY2FuIHdyZWFrIGhhdm9jIG9uIHRoZSBET00gbm9kZXNcbiAgICAvLyBzbyBsZXQncyBub3QgZXZlbiBwdXQgdGhlbSBpbiB0aGUgRE9NLlxuICAgIGh0bWwgPSBodG1sLnJlcGxhY2UoLzxzY3JpcHQoW1xcc1xcU10qPyk8XFwvc2NyaXB0Pi9nLCAnJyk7XG4gICAgcmV0dXJuIGh0bWw7XG4gIH0sXG5cbiAgLyoqXG4gICogRGV0ZXJtaW5lcyBpZiB0aGVyZSdzIG9ubHkgb25lIHRvcC1sZXZlbCBub2RlIGluIHRoZSBET00gdHJlZS4gVGhhdCBpcyxcbiAgKiBhbGwgdGhlIEhUTUwgaXMgd3JhcHBlZCBieSBhIHNpbmdsZSBIVE1MIHRhZy5cbiAgKlxuICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gY29udGFpbmVyRWwgQ29udGFpbmVyIGVsZW1lbnRcbiAgKiBAcmV0dXJuIHtib29sZWFufVxuICAqL1xuICBfb25seU9uZVRvcExldmVsOiBmdW5jdGlvbihjb250YWluZXJFbCkge1xuICAgIC8vIE9ubHkgYSBzaW5nbGUgY2hpbGQgZWxlbWVudFxuICAgIGlmIChcbiAgICAgIGNvbnRhaW5lckVsLmNoaWxkTm9kZXMubGVuZ3RoID09PSAxXG4gICAgICAmJiBjb250YWluZXJFbC5jaGlsZE5vZGVzWzBdLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuRUxFTUVOVFxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIE9ubHkgb25lIGVsZW1lbnQsIGFuZCBhbGwgb3RoZXIgY2hpbGRyZW4gYXJlIHdoaXRlc3BhY2VcbiAgICB2YXIgZm91bmRFbGVtZW50ID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDAsIGNvdW50ID0gY29udGFpbmVyRWwuY2hpbGROb2Rlcy5sZW5ndGg7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICB2YXIgY2hpbGQgPSBjb250YWluZXJFbC5jaGlsZE5vZGVzW2ldO1xuICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuRUxFTUVOVCkge1xuICAgICAgICBpZiAoZm91bmRFbGVtZW50KSB7XG4gICAgICAgICAgLy8gRW5jb3VudGVyZWQgYW4gZWxlbWVudCBhZnRlciBhbHJlYWR5IGVuY291bnRlcmluZyBhbm90aGVyIG9uZVxuICAgICAgICAgIC8vIFRoZXJlZm9yZSwgbW9yZSB0aGFuIG9uZSBlbGVtZW50IGF0IHJvb3QgbGV2ZWxcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm91bmRFbGVtZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLlRFWFQgJiYgIWlzRW1wdHkoY2hpbGQudGV4dENvbnRlbnQpKSB7XG4gICAgICAgIC8vIENvbnRhaW5zIHRleHQgY29udGVudFxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIC8qKlxuICAqIEdldHMgYSBuZXdsaW5lIGZvbGxvd2VkIGJ5IHRoZSBjb3JyZWN0IGluZGVudGF0aW9uIGZvciB0aGUgY3VycmVudFxuICAqIG5lc3RpbmcgbGV2ZWxcbiAgKlxuICAqIEByZXR1cm4ge3N0cmluZ31cbiAgKi9cbiAgX2dldEluZGVudGVkTmV3bGluZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICdcXG4nICsgcmVwZWF0U3RyaW5nKHRoaXMuY29uZmlnLmluZGVudCwgdGhpcy5sZXZlbCArIDIpO1xuICB9LFxuXG4gIC8qKlxuICAqIEhhbmRsZXMgcHJvY2Vzc2luZyB0aGUgc3BlY2lmaWVkIG5vZGVcbiAgKlxuICAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICAqL1xuICBfdmlzaXQ6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICB0aGlzLl9iZWdpblZpc2l0KG5vZGUpO1xuICAgIHRoaXMuX3RyYXZlcnNlKG5vZGUpO1xuICAgIHRoaXMuX2VuZFZpc2l0KG5vZGUpO1xuICB9LFxuXG4gIC8qKlxuICAqIFRyYXZlcnNlcyBhbGwgdGhlIGNoaWxkcmVuIG9mIHRoZSBzcGVjaWZpZWQgbm9kZVxuICAqXG4gICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICovXG4gIF90cmF2ZXJzZTogZnVuY3Rpb24obm9kZSkge1xuICAgIHRoaXMubGV2ZWwrKztcbiAgICBmb3IgKHZhciBpID0gMCwgY291bnQgPSBub2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgdGhpcy5fdmlzaXQobm9kZS5jaGlsZE5vZGVzW2ldKTtcbiAgICB9XG4gICAgdGhpcy5sZXZlbC0tO1xuICB9LFxuXG4gIC8qKlxuICAqIEhhbmRsZSBwcmUtdmlzaXQgYmVoYXZpb3VyIGZvciB0aGUgc3BlY2lmaWVkIG5vZGUuXG4gICpcbiAgKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAgKi9cbiAgX2JlZ2luVmlzaXQ6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBzd2l0Y2ggKG5vZGUubm9kZVR5cGUpIHtcbiAgICAgIGNhc2UgTk9ERV9UWVBFLkVMRU1FTlQ6XG4gICAgICAgIHRoaXMuX2JlZ2luVmlzaXRFbGVtZW50KG5vZGUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBOT0RFX1RZUEUuVEVYVDpcbiAgICAgICAgdGhpcy5fdmlzaXRUZXh0KG5vZGUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBOT0RFX1RZUEUuQ09NTUVOVDpcbiAgICAgICAgdGhpcy5fdmlzaXRDb21tZW50KG5vZGUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignVW5yZWNvZ25pc2VkIG5vZGUgdHlwZTogJyArIG5vZGUubm9kZVR5cGUpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgKiBIYW5kbGVzIHBvc3QtdmlzaXQgYmVoYXZpb3VyIGZvciB0aGUgc3BlY2lmaWVkIG5vZGUuXG4gICpcbiAgKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAgKi9cbiAgX2VuZFZpc2l0OiBmdW5jdGlvbihub2RlKSB7XG4gICAgc3dpdGNoIChub2RlLm5vZGVUeXBlKSB7XG4gICAgICBjYXNlIE5PREVfVFlQRS5FTEVNRU5UOlxuICAgICAgICB0aGlzLl9lbmRWaXNpdEVsZW1lbnQobm9kZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBObyBlbmRpbmcgdGFncyByZXF1aXJlZCBmb3IgdGhlc2UgdHlwZXNcbiAgICAgICAgY2FzZSBOT0RFX1RZUEUuVEVYVDpcbiAgICAgICAgY2FzZSBOT0RFX1RZUEUuQ09NTUVOVDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAqIEhhbmRsZXMgcHJlLXZpc2l0IGJlaGF2aW91ciBmb3IgdGhlIHNwZWNpZmllZCBlbGVtZW50IG5vZGVcbiAgKlxuICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gbm9kZVxuICAqL1xuICBfYmVnaW5WaXNpdEVsZW1lbnQ6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICB2YXIgdGFnTmFtZSA9IG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhciBhdHRyaWJ1dGVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGNvdW50ID0gbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIGF0dHJpYnV0ZXMucHVzaCh0aGlzLl9nZXRFbGVtZW50QXR0cmlidXRlKG5vZGUsIG5vZGUuYXR0cmlidXRlc1tpXSkpO1xuICAgIH1cblxuICAgIHRoaXMub3V0cHV0ICs9ICc8JyArIHRhZ05hbWU7XG4gICAgaWYgKGF0dHJpYnV0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5vdXRwdXQgKz0gJyAnICsgYXR0cmlidXRlcy5qb2luKCcgJyk7XG4gICAgfVxuICAgIGlmIChub2RlLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHRoaXMub3V0cHV0ICs9ICc+JztcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICogSGFuZGxlcyBwb3N0LXZpc2l0IGJlaGF2aW91ciBmb3IgdGhlIHNwZWNpZmllZCBlbGVtZW50IG5vZGVcbiAgKlxuICAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICAqL1xuICBfZW5kVmlzaXRFbGVtZW50OiBmdW5jdGlvbihub2RlKSB7XG4gICAgLy8gRGUtaW5kZW50IGEgYml0XG4gICAgLy8gVE9ETzogSXQncyBpbmVmZmljaWVudCB0byBkbyBpdCB0aGlzIHdheSA6L1xuICAgIHRoaXMub3V0cHV0ID0gdHJpbUVuZCh0aGlzLm91dHB1dCwgdGhpcy5jb25maWcuaW5kZW50KTtcbiAgICBpZiAobm9kZS5maXJzdENoaWxkKSB7XG4gICAgICB0aGlzLm91dHB1dCArPSAnPC8nICsgbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkgKyAnPic7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3V0cHV0ICs9ICcgLz4nO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgKiBIYW5kbGVzIHByb2Nlc3Npbmcgb2YgdGhlIHNwZWNpZmllZCB0ZXh0IG5vZGVcbiAgKlxuICAqIEBwYXJhbSB7VGV4dE5vZGV9IG5vZGVcbiAgKi9cbiAgX3Zpc2l0VGV4dDogZnVuY3Rpb24obm9kZSkge1xuICAgIHZhciB0ZXh0ID0gbm9kZS50ZXh0Q29udGVudDtcbiAgICAvLyBJZiB0aGVyZSdzIGEgbmV3bGluZSBpbiB0aGUgdGV4dCwgYWRqdXN0IHRoZSBpbmRlbnQgbGV2ZWxcbiAgICBpZiAodGV4dC5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICB0ZXh0ID0gbm9kZS50ZXh0Q29udGVudC5yZXBsYWNlKC9cXG5cXHMqL2csIHRoaXMuX2dldEluZGVudGVkTmV3bGluZSgpKTtcbiAgICB9XG4gICAgdGhpcy5vdXRwdXQgKz0gZXNjYXBlU3BlY2lhbENoYXJzKHRleHQpO1xuICB9LFxuXG4gIC8qKlxuICAqIEhhbmRsZXMgcHJvY2Vzc2luZyBvZiB0aGUgc3BlY2lmaWVkIHRleHQgbm9kZVxuICAqXG4gICogQHBhcmFtIHtUZXh0fSBub2RlXG4gICovXG4gIF92aXNpdENvbW1lbnQ6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAvLyBEbyBub3QgcmVuZGVyIHRoZSBjb21tZW50XG4gICAgLy8gU2luY2Ugd2UgcmVtb3ZlIGNvbW1lbnRzLCB3ZSBhbHNvIG5lZWQgdG8gcmVtb3ZlIHRoZSBuZXh0IGxpbmUgYnJlYWsgc28gd2VcbiAgICAvLyBkb24ndCBlbmQgdXAgd2l0aCBleHRyYSB3aGl0ZXNwYWNlIGFmdGVyIGV2ZXJ5IGNvbW1lbnRcbiAgICAvL2lmIChub2RlLm5leHRTaWJsaW5nICYmIG5vZGUubmV4dFNpYmxpbmcubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUKSB7XG4gICAgLy8gIG5vZGUubmV4dFNpYmxpbmcudGV4dENvbnRlbnQgPSBub2RlLm5leHRTaWJsaW5nLnRleHRDb250ZW50LnJlcGxhY2UoL1xcblxccyovLCAnJyk7XG4gICAgLy99XG4gICAgdGhpcy5vdXRwdXQgKz0gJ3svKicgKyBub2RlLnRleHRDb250ZW50LnJlcGxhY2UoJyovJywgJyogLycpICsgJyovfSc7XG4gIH0sXG5cbiAgLyoqXG4gICogR2V0cyBhIEpTWCBmb3JtYXR0ZWQgdmVyc2lvbiBvZiB0aGUgc3BlY2lmaWVkIGF0dHJpYnV0ZSBmcm9tIHRoZSBub2RlXG4gICpcbiAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IG5vZGVcbiAgKiBAcGFyYW0ge29iamVjdH0gICAgIGF0dHJpYnV0ZVxuICAqIEByZXR1cm4ge3N0cmluZ31cbiAgKi9cbiAgX2dldEVsZW1lbnRBdHRyaWJ1dGU6IGZ1bmN0aW9uKG5vZGUsIGF0dHJpYnV0ZSkge1xuICAgIHN3aXRjaCAoYXR0cmlidXRlLm5hbWUpIHtcbiAgICAgIGNhc2UgJ3N0eWxlJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldFN0eWxlQXR0cmlidXRlKGF0dHJpYnV0ZS52YWx1ZSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YXIgdGFnTmFtZSA9IG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB2YXIgbmFtZSA9XG4gICAgICAgIChFTEVNRU5UX0FUVFJJQlVURV9NQVBQSU5HW3RhZ05hbWVdICYmXG4gICAgICAgICAgRUxFTUVOVF9BVFRSSUJVVEVfTUFQUElOR1t0YWdOYW1lXVthdHRyaWJ1dGUubmFtZV0pIHx8XG4gICAgICAgICAgQVRUUklCVVRFX01BUFBJTkdbYXR0cmlidXRlLm5hbWVdIHx8XG4gICAgICAgIGF0dHJpYnV0ZS5uYW1lO1xuICAgICAgICB2YXIgcmVzdWx0ID0gbmFtZTtcblxuICAgICAgICAvLyBOdW1lcmljIHZhbHVlcyBzaG91bGQgYmUgb3V0cHV0IGFzIHsxMjN9IG5vdCBcIjEyM1wiXG4gICAgICAgIGlmIChpc051bWVyaWMoYXR0cmlidXRlLnZhbHVlKSkge1xuICAgICAgICAgIHJlc3VsdCArPSAnPXsnICsgYXR0cmlidXRlLnZhbHVlICsgJ30nO1xuICAgICAgICB9IGVsc2UgaWYgKGF0dHJpYnV0ZS52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmVzdWx0ICs9ICc9XCInICsgYXR0cmlidXRlLnZhbHVlLnJlcGxhY2UoJ1wiJywgJyZxdW90OycpICsgJ1wiJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgKiBHZXRzIGEgSlNYIGZvcm1hdHRlZCB2ZXJzaW9uIG9mIHRoZSBzcGVjaWZpZWQgZWxlbWVudCBzdHlsZXNcbiAgKlxuICAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZXNcbiAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICovXG4gIF9nZXRTdHlsZUF0dHJpYnV0ZTogZnVuY3Rpb24oc3R5bGVzKSB7XG4gICAgdmFyIGpzeFN0eWxlcyA9IG5ldyBTdHlsZVBhcnNlcihzdHlsZXMpLnRvSlNYU3RyaW5nKCk7XG4gICAgcmV0dXJuICdzdHlsZT17eycgKyBqc3hTdHlsZXMgKyAnfX0nO1xuICB9XG59O1xuXG4vKipcbiogSGFuZGxlcyBwYXJzaW5nIG9mIGlubGluZSBzdHlsZXNcbipcbiogQHBhcmFtIHtzdHJpbmd9IHJhd1N0eWxlIFJhdyBzdHlsZSBhdHRyaWJ1dGVcbiogQGNvbnN0cnVjdG9yXG4qL1xudmFyIFN0eWxlUGFyc2VyID0gZnVuY3Rpb24ocmF3U3R5bGUpIHtcbiAgdGhpcy5wYXJzZShyYXdTdHlsZSk7XG59O1xuU3R5bGVQYXJzZXIucHJvdG90eXBlID0ge1xuICAvKipcbiAgKiBQYXJzZSB0aGUgc3BlY2lmaWVkIGlubGluZSBzdHlsZSBhdHRyaWJ1dGUgdmFsdWVcbiAgKiBAcGFyYW0ge3N0cmluZ30gcmF3U3R5bGUgUmF3IHN0eWxlIGF0dHJpYnV0ZVxuICAqL1xuICBwYXJzZTogZnVuY3Rpb24ocmF3U3R5bGUpIHtcbiAgICB0aGlzLnN0eWxlcyA9IHt9O1xuICAgIHJhd1N0eWxlLnNwbGl0KCc7JykuZm9yRWFjaChmdW5jdGlvbihzdHlsZSkge1xuICAgICAgc3R5bGUgPSBzdHlsZS50cmltKCk7XG4gICAgICB2YXIgZmlyc3RDb2xvbiA9IHN0eWxlLmluZGV4T2YoJzonKTtcbiAgICAgIHZhciBrZXkgPSBzdHlsZS5zdWJzdHIoMCwgZmlyc3RDb2xvbik7XG4gICAgICB2YXIgdmFsdWUgPSBzdHlsZS5zdWJzdHIoZmlyc3RDb2xvbiArIDEpLnRyaW0oKTtcbiAgICAgIGlmIChrZXkgIT09ICcnKSB7XG4gICAgICAgIHRoaXMuc3R5bGVzW2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfSxcblxuICAvKipcbiAgKiBDb252ZXJ0IHRoZSBzdHlsZSBpbmZvcm1hdGlvbiByZXByZXNlbnRlZCBieSB0aGlzIHBhcnNlciBpbnRvIGEgSlNYXG4gICogc3RyaW5nXG4gICpcbiAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICovXG4gIHRvSlNYU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMuc3R5bGVzKSB7XG4gICAgICBpZiAoIXRoaXMuc3R5bGVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBvdXRwdXQucHVzaCh0aGlzLnRvSlNYS2V5KGtleSkgKyAnOiAnICsgdGhpcy50b0pTWFZhbHVlKHRoaXMuc3R5bGVzW2tleV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dC5qb2luKCcsICcpO1xuICB9LFxuXG4gIC8qKlxuICAqIENvbnZlcnQgdGhlIENTUyBzdHlsZSBrZXkgdG8gYSBKU1ggc3R5bGUga2V5XG4gICpcbiAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IENTUyBzdHlsZSBrZXlcbiAgKiBAcmV0dXJuIHtzdHJpbmd9IEpTWCBzdHlsZSBrZXlcbiAgKi9cbiAgdG9KU1hLZXk6IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBoeXBoZW5Ub0NhbWVsQ2FzZShrZXkpO1xuICB9LFxuXG4gIC8qKlxuICAqIENvbnZlcnQgdGhlIENTUyBzdHlsZSB2YWx1ZSB0byBhIEpTWCBzdHlsZSB2YWx1ZVxuICAqXG4gICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIENTUyBzdHlsZSB2YWx1ZVxuICAqIEByZXR1cm4ge3N0cmluZ30gSlNYIHN0eWxlIHZhbHVlXG4gICovXG4gIHRvSlNYVmFsdWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKGlzTnVtZXJpYyh2YWx1ZSkpIHtcbiAgICAgIC8vIElmIG51bWVyaWMsIG5vIHF1b3Rlc1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0gZWxzZSBpZiAoaXNDb252ZXJ0aWJsZVBpeGVsVmFsdWUodmFsdWUpKSB7XG4gICAgICAvLyBcIjUwMHB4XCIgLT4gNTAwXG4gICAgICByZXR1cm4gdHJpbUVuZCh2YWx1ZSwgJ3B4Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFByb2JhYmx5IGEgc3RyaW5nLCB3cmFwIGl0IGluIHF1b3Rlc1xuICAgICAgcmV0dXJuICdcXCcnICsgdmFsdWUucmVwbGFjZSgvJy9nLCAnXCInKSArICdcXCcnO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIVE1MdG9KU1g7XG4iXX0=