(function() {
  module.exports = {
    AppleScript: {
      'Selection Based': {
        command: 'osascript',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'osascript',
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'Behat Feature': {
      "File Based": {
        command: "behat",
        args: function(context) {
          return ['--ansi', context.filepath];
        }
      },
      "Line Based": {
        command: "behat",
        args: function(context) {
          return ['--ansi', context.fileColonLine()];
        }
      }
    },
    Batch: {
      "File Based": {
        command: "",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    CoffeeScript: {
      "Selection Based": {
        command: "coffee",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "coffee",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'CoffeeScript (Literate)': {
      "Selection Based": {
        command: "coffee",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "coffee",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Elixir: {
      "Selection Based": {
        command: "elixir",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "elixir",
        args: function(context) {
          return ['-r', context.filepath];
        }
      }
    },
    Erlang: {
      "Selection Based": {
        command: "erl",
        args: function(context) {
          return ['-noshell', '-eval', "" + (context.getCode()) + ", init:stop()."];
        }
      }
    },
    'F#': {
      "File Based": {
        command: "fsharpi",
        args: function(context) {
          return ['--exec', context.filepath];
        }
      }
    },
    Gherkin: {
      "File Based": {
        command: "cucumber",
        args: function(context) {
          return ['--color', context.filepath];
        }
      },
      "Line Based": {
        command: "cucumber",
        args: function(context) {
          return ['--color', context.fileColonLine()];
        }
      }
    },
    Go: {
      "File Based": {
        command: "go",
        args: function(context) {
          return ['run', context.filepath];
        }
      }
    },
    Groovy: {
      "Selection Based": {
        command: "groovy",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "groovy",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Haskell: {
      "File Based": {
        command: "runhaskell",
        args: function(context) {
          return [context.filepath];
        }
      },
      "Selection Based": {
        command: "ghc",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      }
    },
    IcedCoffeeScript: {
      "Selection Based": {
        command: "iced",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "iced",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    JavaScript: {
      "Selection Based": {
        command: "node",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "node",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Julia: {
      "Selection Based": {
        command: "julia",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "julia",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    LilyPond: {
      "File Based": {
        command: "lilypond",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    LiveScript: {
      "Selection Based": {
        command: "livescript",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "livescript",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Lua: {
      "Selection Based": {
        command: "lua",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "lua",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    MoonScript: {
      "Selection Based": {
        command: "moon",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "moon",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    newLISP: {
      "Selection Based": {
        command: "newlisp",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "newlisp",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    PHP: {
      "Selection Based": {
        command: "php",
        args: function(context) {
          return ['-r', context.getCode()];
        }
      },
      "File Based": {
        command: "php",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Perl: {
      "Selection Based": {
        command: "perl",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "perl",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    PowerShell: {
      "File Based": {
        command: "powershell",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Python: {
      "Selection Based": {
        command: "python",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "python",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    R: {
      "File Based": {
        command: "Rscript",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    RSpec: {
      "Selection Based": {
        command: "ruby",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "rspec",
        args: function(context) {
          return ['--tty', '--color', context.filepath];
        }
      },
      "Line Based": {
        command: "rspec",
        args: function(context) {
          return ['--tty', '--color', context.fileColonLine()];
        }
      }
    },
    Ruby: {
      "Selection Based": {
        command: "ruby",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "ruby",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'Ruby on Rails': {
      "Selection Based": {
        command: "rails",
        args: function(context) {
          return ['runner', context.getCode()];
        }
      },
      "File Based": {
        command: "rails",
        args: function(context) {
          return ['runner', context.filepath];
        }
      }
    },
    'Shell Script (Bash)': {
      "Selection Based": {
        command: "bash",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "bash",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Makefile: {
      "Selection Based": {
        command: "bash",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "make",
        args: function(context) {
          return ['-f', context.filepath];
        }
      }
    },
    Scala: {
      "Selection Based": {
        command: "scala",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "scala",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Scheme: {
      "Selection Based": {
        command: "guile",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "guile",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Swift: {
      "File Based": {
        command: "xcrun",
        args: function(context) {
          return ['swift', context.filepath];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBR0E7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFdBQUEsRUFDRTtBQUFBLE1BQUEsaUJBQUEsRUFDRTtBQUFBLFFBQUEsT0FBQSxFQUFTLFdBQVQ7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQsR0FBQTtpQkFBYyxDQUFDLElBQUQsRUFBTyxPQUFPLENBQUMsT0FBUixDQUFBLENBQVAsRUFBZDtRQUFBLENBRE47T0FERjtBQUFBLE1BR0EsWUFBQSxFQUNFO0FBQUEsUUFBQSxPQUFBLEVBQVMsV0FBVDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRCxHQUFBO2lCQUFhLENBQUMsT0FBTyxDQUFDLFFBQVQsRUFBYjtRQUFBLENBRE47T0FKRjtLQURGO0FBQUEsSUFRQSxlQUFBLEVBQ0U7QUFBQSxNQUFBLFlBQUEsRUFDRTtBQUFBLFFBQUEsT0FBQSxFQUFTLE9BQVQ7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQsR0FBQTtpQkFBYSxDQUFDLFFBQUQsRUFBVyxPQUFPLENBQUMsUUFBbkIsRUFBYjtRQUFBLENBRE47T0FERjtBQUFBLE1BR0EsWUFBQSxFQUNFO0FBQUEsUUFBQSxPQUFBLEVBQVMsT0FBVDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRCxHQUFBO2lCQUFhLENBQUMsUUFBRCxFQUFXLE9BQU8sQ0FBQyxhQUFSLENBQUEsQ0FBWCxFQUFiO1FBQUEsQ0FETjtPQUpGO0tBVEY7QUFBQSxJQWdCQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFlBQUEsRUFDRTtBQUFBLFFBQUEsT0FBQSxFQUFTLEVBQVQ7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQsR0FBQTtpQkFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFULEVBQWI7UUFBQSxDQUROO09BREY7S0Fq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
//# sourceURL=/Users/sarah/.atom/packages/script/lib/grammars.coffee