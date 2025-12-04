$(document).ready(function () {
  // Welcome animation
  var welcomeMessage = `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 Welcome to Mohammed Essaddek's Interactive Resume 🚀    ║
║                                                               ║
║   Type '[[b;#00ff41;]help]' to see available commands        ║
║   Type '[[b;#00d9ff;]about]' to learn more about me          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    `;

  var settings = {
    showForks: false,
    title: {
      color: "#00ff41",
      bold: true,
      italic: false,
    },
    command: {
      color: "#00d9ff",
      bold: true,
      italic: false,
      backgroundColor: "transparent",
    },
    name: {
      color: "#00ff41",
      bold: true,
    },
    extraDetails: "assets/json/resume.json",
    customCommands: [
      {
        name: "spiritanimal",
        title: "Spirit Animal",
        description: "the animal I most identify with",
        type: "basic",
        data: ["extra", "spiritanimal"],
      },
      {
        name: "geolocation",
        title: "Geolocation",
        description: "checks if geolocation is enabled",
        type: "system",
        handler: function () {
          return (
            "Geolocation is " +
            (navigator.geolocation ? "" : "not ") +
            "supported for this browser"
          );
        },
      },
      {
        name: "projectyears",
        title: "Project Years",
        description: "years since the project started",
        type: "calculated",
        data: ["extra", "project_start"],
        dataIsObject: true,
        handler: function (value) {
          var startYear = new Date(value.unixtime).getFullYear();
          var endYear = new Date().getFullYear();
          return (
            "Started " +
            (endYear - startYear) +
            " years ago to " +
            value.motivation
          );
        },
      },
      {
        name: "countries",
        title: "Countries",
        description: "countries that I've been to",
        type: "array",
        data: ["extra", "countriestravelledto"],
        handlers: {
          organisation: function (value) {
            return value.name;
          },
          title: function (value) {
            return value.cities.join(", ");
          },
          date: function (value) {
            return value.timeperiod;
          },
        },
      },
      {
        name: "location",
        title: "Location",
        description: "current location",
        type: "calculated",
        data: ["basics", "location"],
        dataIsObject: true,
        handler: function (data) {
          return "The great city of " + data.city;
        },
      },
    ],
  };

  // Initialize terminal with custom settings
  var term = $("body").CMDResume("assets/json/resume.json", settings);

  // Add welcome message after initialization
  setTimeout(function () {
    if (term && term.echo) {
      term.echo(welcomeMessage);
    }
  }, 100);

  // Add custom styling and animations
  $(document)
    .on("mouseenter", ".terminal a[href]", function () {
      $(this).css("text-shadow", "0 0 15px rgba(0, 255, 65, 0.8)");
    })
    .on("mouseleave", ".terminal a[href]", function () {
      $(this).css("text-shadow", "0 0 5px rgba(0, 217, 255, 0.5)");
    });

  // Smooth scroll for terminal
  $(".terminal-scroller").css({
    "scroll-behavior": "smooth",
  });

  // Auto-scroll to bottom after output
  function scrollToBottom() {
    var scroller = $(".terminal-scroller");
    if (scroller.length) {
      scroller.scrollTop(scroller[0].scrollHeight);
    }
  }

  // Monitor for new content and scroll
  var observer = new MutationObserver(function () {
    setTimeout(scrollToBottom, 100);
  });

  // Observe terminal output for changes
  setTimeout(function () {
    var terminalOutput = document.querySelector(".terminal-output");
    if (terminalOutput) {
      observer.observe(terminalOutput, {
        childList: true,
        subtree: true,
      });
    }
  }, 500);

  // Add typing sound effect (optional - visual feedback)
  var typingIndicator = false;
  $(document).on("keypress", ".cmd", function () {
    if (!typingIndicator) {
      typingIndicator = true;
      setTimeout(function () {
        typingIndicator = false;
      }, 100);
    }
  });
});
