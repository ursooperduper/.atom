
var observerTree;
var observerPanes;
var View = require("atom").View;
var __hasProp = ({}).hasOwnProperty;
var __extends = function (child, parent) {
    for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
    }

    function ctor() {
        this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
};

var observerConfig = {
    attributes: true,
    childList: true,
    characterData: false,
    subtree: true
};

module.exports = FiletypeColorView = (function (_super) {
    __extends(FiletypeColorView, _super);

    function FiletypeColorView() {
        return FiletypeColorView.__super__.constructor.apply(this, arguments);
    }

    FiletypeColorView.content = function () {
        return this.div({}, (function (_this) {
            return function () {
                return;
                //_this.div("The FiletypeColor package is Alive! It's GONE!", {"class": "message"});
            };
        })(this));
    };

    FiletypeColorView.prototype.initialize = function (serializeState) {
        var autoInit = atom.config.get("filetype-color.enabled");

        if (!autoInit) {
            atom.config.set("filetype-color.enabled", "false");
            autoInit = "false";
        }

        if (autoInit == "true") {
            var self = this;
            setTimeout(function () {
                self.toggle();
            }, 1000);
        }

        return atom.workspaceView.command("filetype-color:toggle", (function (_this) {
            return function () {
                return _this.toggle();
            };
        })(this));
    };

    FiletypeColorView.prototype.activate = function () {};

    FiletypeColorView.prototype.deactivate = function () {};

    FiletypeColorView.prototype.serialize = function () {};

    FiletypeColorView.prototype.destroy = function () {
        return this.detach();
    };

    FiletypeColorView.prototype.toggle = function () {
        if (this.hasParent()) {
            this.clearAll();
            this.clearAllPanes();

            if (observerTree) {
                observerTree.disconnect();
                observerPanes.disconnect();
            }

            atom.config.set("filetype-color.enabled", "false");

            return this.detach();
        } else {
            if (document.querySelector(".tree-view")) {
                this.colorAll();
                this.createTreeViewObserver();
            }

            this.colorAllPanes();
            this.createPaneViewObserver();

            atom.config.set("filetype-color.enabled", "true");

            return atom.workspaceView.append(this);
        }
    };

    FiletypeColorView.prototype.createPaneViewObserver = function (mutation) {
        var targetPanes = document.querySelector(".panes .pane ul");
        var self = this;

        observerPanes = new WebKitMutationObserver(function (mutations) {
            observerPanes.disconnect();

            mutations.forEach(function () {
                var that = self;

                setTimeout(function () {
                    that.colorAllPanes();
                }, 200);
            });

            setTimeout(function () {
                observerPanes.observe(targetPanes, observerConfig);
            }, 300);
        });

        observerPanes.observe(targetPanes, observerConfig);
    };

    FiletypeColorView.prototype.createTreeViewObserver = function (mutation) {
        var targetTree = document.querySelector(".tree-view");
        var self = this;

        observerTree = new WebKitMutationObserver(function (mutations) {
            observerTree.disconnect();

            mutations.forEach(function () {
                var that = self;

                setTimeout(function () {
                    that.colorAll();
                }, 200);
            });

            setTimeout(function () {
                observerTree.observe(targetTree, observerConfig);
            }, 300);
        });

        observerTree.observe(targetTree, observerConfig);
    };

    FiletypeColorView.prototype.attrModified = function (mutation) {};

    FiletypeColorView.prototype.colorAll = function () {


        treeView = document.querySelector(".tree-view");
        elements = treeView.querySelectorAll("li.file span");

        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            this.colorElement(el);
        }

    };

    FiletypeColorView.prototype.colorAllPanes = function () {
        paneView = document.querySelector(".panes");
        elements = paneView.querySelectorAll("li .title");

        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            this.colorElement(el);
        }
    };

    FiletypeColorView.prototype.clearAll = function () {
        if (document.querySelector(".tree-view")) {
            treeView = document.querySelector(".tree-view");
            elements = treeView.querySelectorAll("li.file span");

            for (var i = 0; i < elements.length; i++) {
                var el = elements[i];
                this.clearElement(el);
            }
        }
    };

    FiletypeColorView.prototype.clearAllPanes = function () {
        paneView = document.querySelector(".panes");
        elements = paneView.querySelectorAll("li .title");

        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            this.clearElement(el);
        }
    };

    FiletypeColorView.prototype.colorElement = function (el) {
        var fileName = el.innerHTML;

        var ext = fileName.split(".").pop();
        var className = "filetype-color filetype-color-" + ext;
        this.clearElement(el);
        el.className = el.className + " " + className;
    };

    FiletypeColorView.prototype.clearElement = function (el) {
        el.className = el.className.replace(/\sfiletype-color-[\S]+/, "");
        el.className = el.className.replace("filetype-color", "");
    };

    return FiletypeColorView;
})(View);
//"class": 'filetype-color overlay from-top'
// var name = mutation.attributeName,
// newValue = mutation.target.getAttribute(name),
// oldValue = mutation.oldValue;
// console.log(name, newValue, oldValue);
// console.log(mutation.target);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9maWxldHlwZS1jb2xvci9saWIvZmlsZXR5cGUtY29sb3Itdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBSTtBQUNKLElBQUk7QUFDSixJQUFJLE9BQVksUUFBUSxRQUFRO0FBQ2hDLElBQUksWUFBWSxDQUFBLElBQUc7QUFDbkIsSUFBSSxZQUFZLFVBQVMsT0FBTyxRQUFRO0FBQ3BDLFNBQUssSUFBSSxPQUFPLFFBQVE7QUFDcEIsWUFBSSxVQUFVLEtBQUssUUFBUSxNQUFNLE1BQU0sT0FBTyxPQUFPOzs7QUFHekQsYUFBUyxPQUFPO0FBQ1osYUFBSyxjQUFjOztBQUV2QixTQUFLLFlBQVksT0FBTztBQUN4QixVQUFNLFlBQVksSUFBSTtBQUN0QixVQUFNLFlBQVksT0FBTztBQUN6QixXQUFPOzs7QUFHWCxJQUFJLGlCQUFpQjtBQUNqQixnQkFBWTtBQUNaLGVBQVc7QUFDWCxtQkFBZTtBQUNmLGFBQVM7OztBQUdiLE9BQU8sVUFBVSxvQkFBb0IsQ0FBQyxVQUFTLFFBQVE7QUFDbkQsY0FBVSxtQkFBbUI7O0FBRTdCLGFBQVMsb0JBQW9CO0FBRXpCLGVBQU8sa0JBQWtCLFVBQVUsWUFBWSxNQUFNLE1BQU07OztBQUcvRCxzQkFBa0IsVUFBVSxZQUFXO0FBQ25DLGVBQU8sS0FBSyxJQUFJLElBRWIsQ0FBQyxVQUFTLE9BQU87QUFDaEIsbUJBQU8sWUFBVztBQUNkOzs7V0FHTDs7O0FBR1Asc0JBQWtCLFVBQVUsYUFBYSxVQUFTLGdCQUFnQjtBQUM5RCxZQUFJLFdBQVcsS0FBSyxPQUFPLElBQUk7O0FBRS9CLFlBQUcsQ0FBQyxVQUFVO0FBQ1YsaUJBQUssT0FBTyxJQUFJLDBCQUEwQjtBQUMxQyx1QkFBVzs7O0FBR2YsWUFBRyxZQUFZLFFBQVE7QUFDbkIsZ0JBQUksT0FBTztBQUNYLHVCQUFXLFlBQVU7QUFDakIscUJBQUs7ZUFDTjs7O0FBR1AsZUFBTyxLQUFLLGNBQWMsUUFB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QVcsR0FBRzs7QUFFbEIsWUFBSSxNQUFNLFNBQVMsTUFBTSxLQUFLO0FBQzlCLFlBQUksWUFBWSxtQ0FBbUM7QUFDbkQsYUFBSyxhQUFhO0FBQ2xCLFdBQUcsWUFBWSxHQUFHLFlBQVksTUFBTTs7O0FBR3hDLHNCQUFrQixVQUFVLGVBQWUsVUFBUyxJQUFJO0FBQ3BELFdBQUcsWUFBWSxHQUFHLFVBQVUsUUFBUSwwQkFBMEI7QUFDOUQsV0FBRyxZQUFZLEdBQUcsVUFBVSxRQUFRLGtCQUFrQjs7O0FBRzFELFdBQU87R0FFUiIsImZpbGUiOiIvVXNlcnMvc2FyYWgvLmF0b20vcGFja2FnZXMvZmlsZXR5cGUtY29sb3IvbGliL2ZpbGV0eXBlLWNvbG9yLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbnZhciBvYnNlcnZlclRyZWU7XG52YXIgb2JzZXJ2ZXJQYW5lcztcbnZhciBWaWV3ICAgICAgPSByZXF1aXJlKCdhdG9tJykuVmlldztcbnZhciBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7XG4gICAgZm9yICh2YXIga2V5IGluIHBhcmVudCkge1xuICAgICAgICBpZiAoX19oYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3RvcigpIHtcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkO1xuICAgIH1cbiAgICBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7XG4gICAgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTtcbiAgICBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlO1xuICAgIHJldHVybiBjaGlsZDtcbn07XG5cbnZhciBvYnNlcnZlckNvbmZpZyA9IHtcbiAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICBjaGFyYWN0ZXJEYXRhOiBmYWxzZSxcbiAgICBzdWJ0cmVlOiB0cnVlXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbGV0eXBlQ29sb3JWaWV3ID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhGaWxldHlwZUNvbG9yVmlldywgX3N1cGVyKTtcblxuICAgIGZ1bmN0aW9uIEZpbGV0eXBlQ29sb3JWaWV3KCkge1xuXG4gICAgICAgIHJldHVybiBGaWxldHlwZUNvbG9yVmlldy5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICBGaWxldHlwZUNvbG9yVmlldy5jb250ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpdih7XG4gICAgICAgICAgICAvL1wiY2xhc3NcIjogJ2ZpbGV0eXBlLWNvbG9yIG92ZXJsYXkgZnJvbS10b3AnXG4gICAgICAgIH0sIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAvL190aGlzLmRpdihcIlRoZSBGaWxldHlwZUNvbG9yIHBhY2thZ2UgaXMgQWxpdmUhIEl0J3MgR09ORSFcIiwge1wiY2xhc3NcIjogXCJtZXNzYWdlXCJ9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpKTtcbiAgICB9O1xuXG4gICAgRmlsZXR5cGVDb2xvclZpZXcucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbihzZXJpYWxpemVTdGF0ZSkge1xuICAgICAgICB2YXIgYXV0b0luaXQgPSBhdG9tLmNvbmZpZy5nZXQoJ2ZpbGV0eXBlLWNvbG9yLmVuYWJsZWQnKTtcblxuICAgICAgICBpZighYXV0b0luaXQpIHtcbiAgICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnZmlsZXR5cGUtY29sb3IuZW5hYmxlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgYXV0b0luaXQgPSAnZmFsc2UnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoYXV0b0luaXQgPT0gJ3RydWUnKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgc2VsZi50b2dnbGUoKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlVmlldy5jb21tYW5kKFwiZmlsZXR5cGUtY29sb3I6dG9nZ2xlXCIsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy50b2dnbGUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpKTtcbiAgICB9O1xuXG4gICAgRmlsZXR5cGVDb2xvclZpZXcucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24oKSB7fTtcblxuICAgIEZpbGV0eXBlQ29sb3JWaWV3LnByb3RvdHlwZS5kZWFjdGl2YXRlID0gZnVuY3Rpb24oKSB7fTtcblxuICAgIEZpbGV0eXBlQ29sb3JWaWV3LnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbigpIHt9O1xuXG4gICAgRmlsZXR5cGVDb2xvclZpZXcucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGV0YWNoKCk7XG4gICAgfTtcblxuICAgIEZpbGV0eXBlQ29sb3JWaWV3LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICBpZiAodGhpcy5oYXNQYXJlbnQoKSkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmNsZWFyQWxsKCk7XG4gICAgICAgICAgICB0aGlzLmNsZWFyQWxsUGFuZXMoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKG9ic2VydmVyVHJlZSkge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyVHJlZS5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXJQYW5lcy5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnZmlsZXR5cGUtY29sb3IuZW5hYmxlZCcsICdmYWxzZScpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZXRhY2goKTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHJlZS12aWV3JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9yQWxsKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVUcmVlVmlld09ic2VydmVyKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY29sb3JBbGxQYW5lcygpO1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVQYW5lVmlld09ic2VydmVyKCk7XG5cbiAgICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnZmlsZXR5cGUtY29sb3IuZW5hYmxlZCcsICd0cnVlJyk7XG5cbiAgICAgICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZVZpZXcuYXBwZW5kKHRoaXMpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEZpbGV0eXBlQ29sb3JWaWV3LnByb3RvdHlwZS5jcmVhdGVQYW5lVmlld09ic2VydmVyID0gZnVuY3Rpb24obXV0YXRpb24pIHtcbiAgICAgICAgXG4gICAgICAgIHZhciB0YXJnZXRQYW5lcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYW5lcyAucGFuZSB1bCcpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgb2JzZXJ2ZXJQYW5lcyA9IG5ldyBXZWJLaXRNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uKG11dGF0aW9ucykge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBvYnNlcnZlclBhbmVzLmRpc2Nvbm5lY3QoKTtcblxuICAgICAgICAgICAgbXV0YXRpb25zLmZvckVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIHRoYXQgPSBzZWxmO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuY29sb3JBbGxQYW5lcygpO1xuICAgICAgICAgICAgICAgIH0sIDIwMCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyUGFuZXMub2JzZXJ2ZSh0YXJnZXRQYW5lcywgb2JzZXJ2ZXJDb25maWcpO1xuICAgICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb2JzZXJ2ZXJQYW5lcy5vYnNlcnZlKHRhcmdldFBhbmVzLCBvYnNlcnZlckNvbmZpZyk7XG4gICAgfTtcblxuICAgIEZpbGV0eXBlQ29sb3JWaWV3LnByb3RvdHlwZS5jcmVhdGVUcmVlVmlld09ic2VydmVyID0gZnVuY3Rpb24obXV0YXRpb24pIHtcbiAgICAgICAgXG4gICAgICAgIHZhciB0YXJnZXRUcmVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRyZWUtdmlldycpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICBvYnNlcnZlclRyZWUgPSBuZXcgV2ViS2l0TXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbihtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgb2JzZXJ2ZXJUcmVlLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbXV0YXRpb25zLmZvckVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIHRoYXQgPSBzZWxmO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuY29sb3JBbGwoKTtcbiAgICAgICAgICAgICAgICB9LCAyMDApO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlclRyZWUub2JzZXJ2ZSh0YXJnZXRUcmVlLCBvYnNlcnZlckNvbmZpZyk7XG4gICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBvYnNlcnZlclRyZWUub2JzZXJ2ZSh0YXJnZXRUcmVlLCBvYnNlcnZlckNvbmZpZyk7XG4gICAgfTtcblxuICAgIEZpbGV0eXBlQ29sb3JWaWV3LnByb3RvdHlwZS5hdHRyTW9kaWZpZWQgPSBmdW5jdGlvbihtdXRhdGlvbikge1xuICAgICAgICAvLyB2YXIgbmFtZSA9IG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUsXG4gICAgICAgIC8vIG5ld1ZhbHVlID0gbXV0YXRpb24udGFyZ2V0LmdldEF0dHJpYnV0ZShuYW1lKSxcbiAgICAgICAgLy8gb2xkVmFsdWUgPSBtdXRhdGlvbi5vbGRWYWx1ZTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobmFtZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobXV0YXRpb24udGFyZ2V0KTtcbiAgICB9O1xuXG4gICAgRmlsZXR5cGVDb2xvclZpZXcucHJvdG90eXBlLmNvbG9yQWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuXG4gICAgICAgIHRyZWVWaWV3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50cmVlLXZpZXdcIik7XG4gICAgICAgIGVsZW1lbnRzID0gdHJlZVZpZXcucXVlcnlTZWxlY3RvckFsbChcImxpLmZpbGUgc3BhblwiKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZWwgPSBlbGVtZW50c1tpXTtcbiAgICAgICAgICAgIHRoaXMuY29sb3JFbGVtZW50KGVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFxuICAgIH07XG5cbiAgICBGaWxldHlwZUNvbG9yVmlldy5wcm90b3R5cGUuY29sb3JBbGxQYW5lcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgcGFuZVZpZXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhbmVzXCIpO1xuICAgICAgICBlbGVtZW50cyA9IHBhbmVWaWV3LnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaSAudGl0bGVcIik7XG4gICAgICAgIFxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZWwgPSBlbGVtZW50c1tpXTtcbiAgICAgICAgICAgIHRoaXMuY29sb3JFbGVtZW50KGVsKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBGaWxldHlwZUNvbG9yVmlldy5wcm90b3R5cGUuY2xlYXJBbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRyZWUtdmlldycpKVxuICAgICAgICB7XG4gICAgICAgICAgICB0cmVlVmlldyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudHJlZS12aWV3XCIpO1xuICAgICAgICAgICAgZWxlbWVudHMgPSB0cmVlVmlldy5xdWVyeVNlbGVjdG9yQWxsKFwibGkuZmlsZSBzcGFuXCIpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsID0gZWxlbWVudHNbaV07XG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhckVsZW1lbnQoZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIEZpbGV0eXBlQ29sb3JWaWV3LnByb3RvdHlwZS5jbGVhckFsbFBhbmVzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHBhbmVWaWV3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYW5lc1wiKTtcbiAgICAgICAgZWxlbWVudHMgPSBwYW5lVmlldy5xdWVyeVNlbGVjdG9yQWxsKFwibGkgLnRpdGxlXCIpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlbCA9IGVsZW1lbnRzW2ldO1xuICAgICAgICAgICAgdGhpcy5jbGVhckVsZW1lbnQoZWwpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEZpbGV0eXBlQ29sb3JWaWV3LnByb3RvdHlwZS5jb2xvckVsZW1lbnQgPSBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgZmlsZU5hbWUgPSBlbC5pbm5lckhUTUw7XG5cbiAgICAgICAgdmFyIGV4dCA9IGZpbGVOYW1lLnNwbGl0KCcuJykucG9wKCk7XG4gICAgICAgIHZhciBjbGFzc05hbWUgPSBcImZpbGV0eXBlLWNvbG9yIGZpbGV0eXBlLWNvbG9yLVwiICsgZXh0O1xuICAgICAgICB0aGlzLmNsZWFyRWxlbWVudChlbCk7XG4gICAgICAgIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZSArIFwiIFwiICsgY2xhc3NOYW1lO1xuICAgIH07XG5cbiAgICBGaWxldHlwZUNvbG9yVmlldy5wcm90b3R5cGUuY2xlYXJFbGVtZW50ID0gZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UoL1xcc2ZpbGV0eXBlLWNvbG9yLVtcXFNdKy8sICcnKTtcbiAgICAgICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UoJ2ZpbGV0eXBlLWNvbG9yJywgJycpO1xuICAgIH07XG5cbiAgICByZXR1cm4gRmlsZXR5cGVDb2xvclZpZXc7XG5cbn0pKFZpZXcpO1xuIl19