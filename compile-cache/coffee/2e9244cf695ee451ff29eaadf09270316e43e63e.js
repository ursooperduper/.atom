(function() {
  var CSON, Configuration, fs, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require("path");

  CSON = require("season");

  fs = require("fs-plus");

  Configuration = (function() {
    function Configuration() {}

    Configuration.prefix = "markdown-writer";

    Configuration.defaults = {
      siteEngine: "general",
      projectConfigFile: "_mdwriter.cson",
      siteLocalDir: "/config/your/local/directory/in/settings",
      siteDraftsDir: "_drafts/",
      sitePostsDir: "_posts/{year}/",
      siteImagesDir: "images/{year}/{month}/",
      siteUrl: "",
      urlForTags: "",
      urlForPosts: "",
      urlForCategories: "",
      newDraftFileName: "{title}{extension}",
      newPostFileName: "{year}-{month}-{day}-{title}{extension}",
      frontMatter: "---\nlayout: <layout>\ntitle: \"<title>\"\ndate: \"<date>\"\n---",
      fileExtension: ".markdown",
      publishRenameBasedOnTitle: false,
      publishKeepFileExtname: false,
      inlineNewLineContinuation: false,
      siteLinkPath: path.join(atom.getConfigDirPath(), "" + Configuration.prefix + "-links.cson"),
      referenceInsertPosition: "paragraph",
      referenceIndentLength: 2,
      textStyles: {
        code: {
          before: "`",
          after: "`"
        },
        bold: {
          before: "**",
          after: "**"
        },
        italic: {
          before: "_",
          after: "_"
        },
        keystroke: {
          before: "<kbd>",
          after: "</kbd>"
        },
        strikethrough: {
          before: "~~",
          after: "~~"
        },
        codeblock: {
          before: "```\n",
          after: "\n```",
          regexBefore: "```(?:[\\w- ]+)?\\n",
          regexAfter: "\\n```"
        }
      },
      lineStyles: {
        h1: {
          before: "# "
        },
        h2: {
          before: "## "
        },
        h3: {
          before: "### "
        },
        h4: {
          before: "#### "
        },
        h5: {
          before: "##### "
        },
        ul: {
          before: "- ",
          regexMatchBefore: "(?:-|\\*|\\+)\\s",
          regexBefore: "(?:-|\\*|\\+|\\d+\\.)\\s"
        },
        ol: {
          before: "1. ",
          regexMatchBefore: "(?:\\d+\\.)\\s",
          regexBefore: "(?:-|\\*|\\+|\\d+\\.)\\s"
        },
        task: {
          before: "- [ ] ",
          regexMatchBefore: "(?:-|\\*|\\+|\\d+\\.)\\s+\\[ ]\\s",
          regexBefore: "(?:-|\\*|\\+|\\d+\\.)\\s*(?:\\[[xX ]])?\\s"
        },
        taskdone: {
          before: "- [X] ",
          regexMatchBefore: "(?:-|\\*|\\+|\\d+\\.)\\s+\\[[xX]]\\s",
          regexBefore: "(?:-|\\*|\\+|\\d+\\.)\\s*(?:\\[[xX ]])?\\s"
        },
        blockquote: {
          before: "> "
        }
      },
      imageTag: "![<alt>](<src>)",
      tableAlignment: "empty",
      tableExtraPipes: false,
      grammars: ['source.gfm', 'source.litcoffee', 'text.plain', 'text.plain.null-grammar']
    };

    Configuration.engines = {
      html: {
        imageTag: "<a href=\"<site>/<slug>.html\" target=\"_blank\">\n  <img class=\"align<align>\" alt=\"<alt>\" src=\"<src>\" width=\"<width>\" height=\"<height>\" />\n</a>"
      },
      jekyll: {
        textStyles: {
          codeblock: {
            before: "{% highlight %}\n",
            after: "\n{% endhighlight %}",
            regexBefore: "{% highlight(?: .+)? %}\n",
            regexAfter: "\n{% endhighlight %}"
          }
        }
      },
      octopress: {
        imageTag: "{% img {align} {src} {width} {height} '{alt}' %}"
      },
      hexo: {
        newPostFileName: "{title}{extension}",
        frontMatter: "layout: <layout>\ntitle: \"<title>\"\ndate: \"<date>\"\n---"
      }
    };

    Configuration.projectConfigs = {};

    Configuration.prototype.engineNames = function() {
      return Object.keys(this.constructor.engines);
    };

    Configuration.prototype.keyPath = function(key) {
      return "" + this.constructor.prefix + "." + key;
    };

    Configuration.prototype.get = function(key) {
      return this.getProject(key) || this.getUser(key) || this.getEngine(key) || this.getDefault(key);
    };

    Configuration.prototype.set = function(key, val) {
      return atom.config.set(this.keyPath(key), val);
    };

    Configuration.prototype.restoreDefault = function(key) {
      return atom.config.unset(this.keyPath(key));
    };

    Configuration.prototype.getDefault = function(key) {
      return this._valueForKeyPath(this.constructor.defaults, key);
    };

    Configuration.prototype.getEngine = function(key) {
      var engine;
      engine = this.getProject("siteEngine") || this.getUser("siteEngine") || this.getDefault("siteEngine");
      if (__indexOf.call(this.engineNames(), engine) >= 0) {
        return this._valueForKeyPath(this.constructor.engines[engine], key);
      }
    };

    Configuration.prototype.getCurrentDefault = function(key) {
      return this.getEngine(key) || this.getDefault(key);
    };

    Configuration.prototype.getUser = function(key) {
      return atom.config.get(this.keyPath(key), {
        sources: [atom.config.getUserConfigPath()]
      });
    };

    Configuration.prototype.getProject = function(key) {
      var config, project;
      if (!atom.project || atom.project.getPaths().length < 1) {
        return;
      }
      project = atom.project.getPaths()[0];
      config = this._loadProjectConfig(project);
      return this._valueForKeyPath(config, key);
    };

    Configuration.prototype._loadProjectConfig = function(project) {
      var config, file, filePath;
      if (this.constructor.projectConfigs[project]) {
        return this.constructor.projectConfigs[project];
      }
      file = this.getUser("projectConfigFile") || this.getDefault("projectConfigFile");
      filePath = path.join(project, file);
      if (fs.existsSync(filePath)) {
        config = CSON.readFileSync(filePath);
      }
      return this.constructor.projectConfigs[project] = config || {};
    };

    Configuration.prototype._valueForKeyPath = function(object, keyPath) {
      var key, keys, _i, _len;
      keys = keyPath.split('.');
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        object = object[key];
        if (object == null) {
          return;
        }
      }
      return object;
    };

    return Configuration;

  })();

  module.exports = new Configuration();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3NhcmFoLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29uZmlnLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2QkFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBSU07K0JBQ0o7O0FBQUEsSUFBQSxhQUFDLENBQUEsTUFBRCxHQUFTLGlCQUFULENBQUE7O0FBQUEsSUFFQSxhQUFDLENBQUEsUUFBRCxHQUVFO0FBQUEsTUFBQSxVQUFBLEVBQVksU0FBWjtBQUFBLE1BSUEsaUJBQUEsRUFBbUIsZ0JBSm5CO0FBQUEsTUFPQSxZQUFBLEVBQWMsMENBUGQ7QUFBQSxNQVNBLGFBQUEsRUFBZSxVQVRmO0FBQUEsTUFXQSxZQUFBLEVBQWMsZ0JBWGQ7QUFBQSxNQWFBLGFBQUEsRUFBZSx3QkFiZjtBQUFBLE1BZ0JBLE9BQUEsRUFBUyxFQWhCVDtBQUFBLE1BbUJBLFVBQUEsRUFBWSxFQW5CWjtBQUFBLE1Bb0JBLFdBQUEsRUFBYSxFQXBCYjtBQUFBLE1BcUJBLGdCQUFBLEVBQWtCLEVBckJsQjtBQUFBLE1Bd0JBLGdCQUFBLEVBQWtCLG9CQXhCbEI7QUFBQSxNQTBCQSxlQUFBLEVBQWlCLHlDQTFCakI7QUFBQSxNQTRCQSxXQUFBLEVBQWEsa0VBNUJiO0FBQUEsTUFxQ0EsYUFBQSxFQUFlLFdBckNmO0FBQUEsTUF3Q0EseUJBQUEsRUFBMkIsS0F4QzNCO0FBQUEsTUEwQ0Esc0JBQUEsRUFBd0IsS0ExQ3hCO0FBQUEsTUE2Q0EseUJBQUEsRUFBMkIsS0E3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

//# sourceURL=/Users/sarah/.atom/packages/markdown-writer/lib/config.coffee
