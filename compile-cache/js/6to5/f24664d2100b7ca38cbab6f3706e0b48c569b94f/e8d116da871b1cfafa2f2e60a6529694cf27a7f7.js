
var observerTree;
var observerPanes;
var timeoutTree;
var timeoutPanes;
var timeoutTreeObserver;
var timeoutPanesObserver;
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

                clearTimeout(timeoutPanes);

                timeoutPanes = setTimeout(function () {
                    that.colorAllPanes();
                }, 100);
            });

            clearTimeout(timeoutPanesObserver);

            timeoutPanesObserver = setTimeout(function () {
                observerPanes.observe(targetPanes, observerConfig);
            }, 150);
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

                clearTimeout(timeoutTree);

                timeoutTree = setTimeout(function () {
                    that.colorAll();
                }, 100);
            });

            clearTimeout(timeoutTreeObserver);

            timeoutTreeObserver = setTimeout(function () {
                observerTree.observe(targetTree, observerConfig);
            }, 150);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9maWxldHlwZS1jb2xvci9saWIvZmlsZXR5cGUtY29sb3Itdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBSSxZQUFZLENBQUM7QUFDakIsSUFBSSxhQUFhLENBQUM7QUFDbEIsSUFBSSxXQUFXLENBQUM7QUFDaEIsSUFBSSxZQUFZLENBQUM7QUFDakIsSUFBSSxtQkFBbUIsQ0FBQztBQUN4QixJQUFJLG9CQUFvQixDQUFDO0FBQ3pCLElBQUksSUFBSSxHQUFRLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDckMsSUFBSSxTQUFTLEdBQUcsQ0FBQSxHQUFFLENBQUMsY0FBYyxDQUFDO0FBQ2xDLElBQUksU0FBUyxHQUFHLFVBQVMsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUNwQyxTQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtBQUNwQixZQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDN0Q7O0FBRUQsYUFBUyxJQUFJLEdBQUc7QUFDWixZQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztLQUM1QjtBQUNELFFBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNsQyxTQUFLLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDN0IsU0FBSyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25DLFdBQU8sS0FBSyxDQUFDO0NBQ2hCLENBQUM7O0FBRUYsSUFBSSxjQUFjLEdBQUc7QUFDakIsY0FBVSxFQUFFLElBQUk7QUFDaEIsYUFBUyxFQUFFLElBQUk7QUFDZixpQkFBYSxFQUFFLEtBQUs7QUFDcEIsV0FBTyxFQUFFLElBQUk7Q0FDaEIsQ0FBQzs7QUFFRixN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R0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3RDLGdCQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsZ0JBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDekI7S0FDSixDQUFDOztBQUVGLHFCQUFpQixDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsVUFBUyxFQUFFLEVBQUU7QUFDcEQsWUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQzs7QUFFNUIsWUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNwQyxZQUFJLFNBQVMsR0FBRyxnQ0FBZ0MsR0FBRyxHQUFHLENBQUM7QUFDdkQsWUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN0QixVQUFFLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxTQUFTLEdBQUcsR0FBRyxHQUFHLFNBQVMsQ0FBQztLQUNqRCxDQUFDOztBQUVGLHFCQUFpQixDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsVUFBUyxFQUFFLEVBQUU7QUFDcEQsVUFBRSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNsRSxVQUFFLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzdELENBQUM7O0FBRUYsV0FBTyxpQkFBaUIsQ0FBQztDQUU1QixDQUFBLENBQUUsSUFBSSxDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL2ZpbGV0eXBlLWNvbG9yL2xpYi9maWxldHlwZS1jb2xvci12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG52YXIgb2JzZXJ2ZXJUcmVlO1xudmFyIG9ic2VydmVyUGFuZXM7XG52YXIgdGltZW91dFRyZWU7XG52YXIgdGltZW91dFBhbmVzO1xudmFyIHRpbWVvdXRUcmVlT2JzZXJ2ZXI7XG52YXIgdGltZW91dFBhbmVzT2JzZXJ2ZXI7XG52YXIgVmlldyAgICAgID0gcmVxdWlyZSgnYXRvbScpLlZpZXc7XG52YXIgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG52YXIgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkge1xuICAgIGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHtcbiAgICAgICAgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGN0b3IoKSB7XG4gICAgICAgIHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDtcbiAgICB9XG4gICAgY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xuICAgIGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7XG4gICAgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTtcbiAgICByZXR1cm4gY2hpbGQ7XG59O1xuXG52YXIgb2JzZXJ2ZXJDb25maWcgPSB7XG4gICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgY2hhcmFjdGVyRGF0YTogZmFsc2UsXG4gICAgc3VidHJlZTogdHJ1ZVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaWxldHlwZUNvbG9yVmlldyA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoRmlsZXR5cGVDb2xvclZpZXcsIF9zdXBlcik7XG5cbiAgICBmdW5jdGlvbiBGaWxldHlwZUNvbG9yVmlldygpIHtcblxuICAgICAgICByZXR1cm4gRmlsZXR5cGVDb2xvclZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgRmlsZXR5cGVDb2xvclZpZXcuY29udGVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kaXYoe1xuICAgICAgICAgICAgLy9cImNsYXNzXCI6ICdmaWxldHlwZS1jb2xvciBvdmVybGF5IGZyb20tdG9wJ1xuICAgICAgICB9LCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgLy9fdGhpcy5kaXYoXCJUaGUgRmlsZXR5cGVDb2xvciBwYWNrYWdlIGlzIEFsaXZlISBJdCdzIEdPTkUhXCIsIHtcImNsYXNzXCI6IFwibWVzc2FnZVwifSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKSk7XG4gICAgfTtcblxuICAgIEZpbGV0eXBlQ29sb3JWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24oc2VyaWFsaXplU3RhdGUpIHtcbiAgICAgICAgdmFyIGF1dG9Jbml0ID0gYXRvbS5jb25maWcuZ2V0KCdmaWxldHlwZS1jb2xvci5lbmFibGVkJyk7XG5cbiAgICAgICAgaWYoIWF1dG9Jbml0KSB7XG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2ZpbGV0eXBlLWNvbG9yLmVuYWJsZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgIGF1dG9Jbml0ID0gJ2ZhbHNlJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGF1dG9Jbml0ID09ICd0cnVlJykge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHNlbGYudG9nZ2xlKCk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZVZpZXcuY29tbWFuZChcImZpbGV0eXBlLWNvbG9yOnRvZ2dsZVwiLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMudG9nZ2xlKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKSk7XG4gICAgfTtcblxuICAgIEZpbGV0eXBlQ29sb3JWaWV3LnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uKCkge307XG5cbiAgICBGaWxldHlwZUNvbG9yVmlldy5wcm90b3R5cGUuZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uKCkge307XG5cbiAgICBGaWxldHlwZUNvbG9yVmlldy5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24oKSB7fTtcblxuICAgIEZpbGV0eXBlQ29sb3JWaWV3LnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRldGFjaCgpO1xuICAgIH07XG5cbiAgICBGaWxldHlwZUNvbG9yVmlldy5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuaGFzUGFyZW50KCkpIHtcblxuICAgICAgICAgICAgdGhpcy5jbGVhckFsbCgpO1xuICAgICAgICAgICAgdGhpcy5jbGVhckFsbFBhbmVzKCk7XG5cbiAgICAgICAgICAgIGlmIChvYnNlcnZlclRyZWUpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlclRyZWUuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIG9ic2VydmVyUGFuZXMuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2ZpbGV0eXBlLWNvbG9yLmVuYWJsZWQnLCAnZmFsc2UnKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGV0YWNoKCk7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRyZWUtdmlldycpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb2xvckFsbCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVHJlZVZpZXdPYnNlcnZlcigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNvbG9yQWxsUGFuZXMoKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGFuZVZpZXdPYnNlcnZlcigpO1xuXG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2ZpbGV0eXBlLWNvbG9yLmVuYWJsZWQnLCAndHJ1ZScpO1xuXG4gICAgICAgICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2VWaWV3LmFwcGVuZCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBGaWxldHlwZUNvbG9yVmlldy5wcm90b3R5cGUuY3JlYXRlUGFuZVZpZXdPYnNlcnZlciA9IGZ1bmN0aW9uKG11dGF0aW9uKSB7XG5cbiAgICAgICAgdmFyIHRhcmdldFBhbmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhbmVzIC5wYW5lIHVsJyk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBvYnNlcnZlclBhbmVzID0gbmV3IFdlYktpdE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24obXV0YXRpb25zKSB7XG5cbiAgICAgICAgICAgIG9ic2VydmVyUGFuZXMuZGlzY29ubmVjdCgpO1xuXG4gICAgICAgICAgICBtdXRhdGlvbnMuZm9yRWFjaChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHZhciB0aGF0ID0gc2VsZjtcblxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0UGFuZXMpO1xuXG4gICAgICAgICAgICAgICAgdGltZW91dFBhbmVzID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5jb2xvckFsbFBhbmVzKCk7XG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0UGFuZXNPYnNlcnZlcik7XG5cbiAgICAgICAgICAgIHRpbWVvdXRQYW5lc09ic2VydmVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlclBhbmVzLm9ic2VydmUodGFyZ2V0UGFuZXMsIG9ic2VydmVyQ29uZmlnKTtcbiAgICAgICAgICAgIH0sIDE1MCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG9ic2VydmVyUGFuZXMub2JzZXJ2ZSh0YXJnZXRQYW5lcywgb2JzZXJ2ZXJDb25maWcpO1xuICAgIH07XG5cbiAgICBGaWxldHlwZUNvbG9yVmlldy5wcm90b3R5cGUuY3JlYXRlVHJlZVZpZXdPYnNlcnZlciA9IGZ1bmN0aW9uKG11dGF0aW9uKSB7XG5cbiAgICAgICAgdmFyIHRhcmdldFRyZWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHJlZS12aWV3Jyk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICBvYnNlcnZlclRyZWUgPSBuZXcgV2ViS2l0TXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbihtdXRhdGlvbnMpIHtcblxuICAgICAgICAgICAgb2JzZXJ2ZXJUcmVlLmRpc2Nvbm5lY3QoKTtcblxuICAgICAgICAgICAgbXV0YXRpb25zLmZvckVhY2goZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHNlbGY7XG5cbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dFRyZWUpO1xuXG4gICAgICAgICAgICAgICAgdGltZW91dFRyZWUgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmNvbG9yQWxsKCk7XG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0VHJlZU9ic2VydmVyKTtcblxuICAgICAgICAgICAgdGltZW91dFRyZWVPYnNlcnZlciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXJUcmVlLm9ic2VydmUodGFyZ2V0VHJlZSwgb2JzZXJ2ZXJDb25maWcpO1xuICAgICAgICAgICAgfSwgMTUwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb2JzZXJ2ZXJUcmVlLm9ic2VydmUodGFyZ2V0VHJlZSwgb2JzZXJ2ZXJDb25maWcpO1xuICAgIH07XG5cbiAgICBGaWxldHlwZUNvbG9yVmlldy5wcm90b3R5cGUuYXR0ck1vZGlmaWVkID0gZnVuY3Rpb24obXV0YXRpb24pIHtcbiAgICAgICAgLy8gdmFyIG5hbWUgPSBtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lLFxuICAgICAgICAvLyBuZXdWYWx1ZSA9IG11dGF0aW9uLnRhcmdldC5nZXRBdHRyaWJ1dGUobmFtZSksXG4gICAgICAgIC8vIG9sZFZhbHVlID0gbXV0YXRpb24ub2xkVmFsdWU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG5hbWUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG11dGF0aW9uLnRhcmdldCk7XG4gICAgfTtcblxuICAgIEZpbGV0eXBlQ29sb3JWaWV3LnByb3RvdHlwZS5jb2xvckFsbCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHRyZWVWaWV3ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50cmVlLXZpZXdcIik7XG4gICAgICAgIGVsZW1lbnRzID0gdHJlZVZpZXcucXVlcnlTZWxlY3RvckFsbChcImxpLmZpbGUgc3BhblwiKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZWwgPSBlbGVtZW50c1tpXTtcbiAgICAgICAgICAgIHRoaXMuY29sb3JFbGVtZW50KGVsKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIEZpbGV0eXBlQ29sb3JWaWV3LnByb3RvdHlwZS5jb2xvckFsbFBhbmVzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgcGFuZVZpZXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhbmVzXCIpO1xuICAgICAgICBlbGVtZW50cyA9IHBhbmVWaWV3LnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaSAudGl0bGVcIik7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGVsID0gZWxlbWVudHNbaV07XG4gICAgICAgICAgICB0aGlzLmNvbG9yRWxlbWVudChlbCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRmlsZXR5cGVDb2xvclZpZXcucHJvdG90eXBlLmNsZWFyQWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50cmVlLXZpZXcnKSlcbiAgICAgICAge1xuICAgICAgICAgICAgdHJlZVZpZXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRyZWUtdmlld1wiKTtcbiAgICAgICAgICAgIGVsZW1lbnRzID0gdHJlZVZpZXcucXVlcnlTZWxlY3RvckFsbChcImxpLmZpbGUgc3BhblwiKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBlbCA9IGVsZW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJFbGVtZW50KGVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBGaWxldHlwZUNvbG9yVmlldy5wcm90b3R5cGUuY2xlYXJBbGxQYW5lcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBwYW5lVmlldyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFuZXNcIik7XG4gICAgICAgIGVsZW1lbnRzID0gcGFuZVZpZXcucXVlcnlTZWxlY3RvckFsbChcImxpIC50aXRsZVwiKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZWwgPSBlbGVtZW50c1tpXTtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJFbGVtZW50KGVsKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBGaWxldHlwZUNvbG9yVmlldy5wcm90b3R5cGUuY29sb3JFbGVtZW50ID0gZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIGZpbGVOYW1lID0gZWwuaW5uZXJIVE1MO1xuXG4gICAgICAgIHZhciBleHQgPSBmaWxlTmFtZS5zcGxpdCgnLicpLnBvcCgpO1xuICAgICAgICB2YXIgY2xhc3NOYW1lID0gXCJmaWxldHlwZS1jb2xvciBmaWxldHlwZS1jb2xvci1cIiArIGV4dDtcbiAgICAgICAgdGhpcy5jbGVhckVsZW1lbnQoZWwpO1xuICAgICAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUgKyBcIiBcIiArIGNsYXNzTmFtZTtcbiAgICB9O1xuXG4gICAgRmlsZXR5cGVDb2xvclZpZXcucHJvdG90eXBlLmNsZWFyRWxlbWVudCA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKC9cXHNmaWxldHlwZS1jb2xvci1bXFxTXSsvLCAnJyk7XG4gICAgICAgIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKCdmaWxldHlwZS1jb2xvcicsICcnKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEZpbGV0eXBlQ29sb3JWaWV3O1xuXG59KShWaWV3KTtcbiJdfQ==