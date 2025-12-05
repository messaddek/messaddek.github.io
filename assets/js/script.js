$(document).ready(function () {
  // Language detection and management
  // Priority: URL parameter > localStorage > browser language
  function getLanguageFromURL() {
    var params = new URLSearchParams(window.location.search);
    var lang = params.get("lang");
    if (lang && (lang === "en" || lang === "fr")) {
      return lang;
    }
    return null;
  }

  function detectBrowserLanguage() {
    var browserLang = navigator.language || navigator.userLanguage;
    // Check if browser language starts with 'fr' (French)
    if (browserLang && browserLang.toLowerCase().startsWith("fr")) {
      return "fr";
    }
    // Default to English
    return "en";
  }

  var urlLang = getLanguageFromURL();
  if (urlLang) {
    localStorage.setItem("resumeLanguage", urlLang);
  }

  var currentLanguage =
    localStorage.getItem("resumeLanguage") || detectBrowserLanguage();

  function getResumeJsonPath(lang) {
    return "assets/json/resume-" + lang + ".json";
  }

  // Intelligent welcome message generator
  function generateWelcomeMessage(lang) {
    var isMobile = window.innerWidth <= 768;
    var isSmallMobile = window.innerWidth <= 480;

    var content = {
      en: {
        greeting: "Welcome to Mohammed Essaddek's Interactive Resume",
        emoji: "🚀",
        commands: [
          { cmd: "help", desc: "see available commands", color: "#00ff41" },
          { cmd: "about", desc: "learn more about me", color: "#00d9ff" },
          { cmd: "lang fr", desc: "switch to French", color: "#ff8c00" },
        ],
      },
      fr: {
        greeting: "Bienvenue sur le CV Interactif de Mohammed Essaddek",
        emoji: "🚀",
        commands: [
          { cmd: "help", desc: "voir les commandes", color: "#00ff41" },
          { cmd: "about", desc: "en savoir plus", color: "#00d9ff" },
          { cmd: "lang en", desc: "passer à l'anglais", color: "#ff8c00" },
        ],
      },
    };

    var data = content[lang];
    var output = "\n";

    if (isSmallMobile) {
      // Compact mobile view
      output += "[[b;#00ff41;]" + data.emoji + " " + data.greeting + "]\n\n";
      data.commands.forEach(function (item) {
        output +=
          "[[b;" + item.color + ";]" + item.cmd + "] - " + item.desc + "\n";
      });
    } else if (isMobile) {
      // Medium mobile view with simple border
      var border = "━".repeat(50);
      output += "┏" + border + "┓\n";
      output +=
        "┃ " +
        data.emoji +
        " [[b;#00ff41;]" +
        data.greeting +
        "] " +
        data.emoji +
        "\n";
      output += "┣" + border + "┫\n";
      data.commands.forEach(function (item) {
        output +=
          "┃ [[b;" + item.color + ";]" + item.cmd + "] → " + item.desc + "\n";
      });
      output += "┗" + border + "┛\n";
    } else {
      // Full desktop view with centered content
      var width = 67;
      var border = "═".repeat(width);
      var title = data.emoji + " " + data.greeting + " " + data.emoji;
      var titlePadding = Math.floor((width - title.length) / 2);

      output += "╔" + border + "╗\n";
      output += "║" + " ".repeat(width) + "║\n";
      output +=
        "║" +
        " ".repeat(titlePadding) +
        "[[b;#00ff41;]" +
        title +
        "]" +
        " ".repeat(width - titlePadding - title.length) +
        "║\n";
      output += "║" + " ".repeat(width) + "║\n";

      data.commands.forEach(function (item) {
        var line =
          "Type '[[b;" + item.color + ";]" + item.cmd + "]' to " + item.desc;
        var linePadding = Math.floor(
          (width - ("Type '" + item.cmd + "' to " + item.desc).length) / 2
        );
        output +=
          "║" +
          " ".repeat(linePadding) +
          line +
          " ".repeat(
            width -
              linePadding -
              ("Type '" + item.cmd + "' to " + item.desc).length
          ) +
          "║\n";
      });

      output += "║" + " ".repeat(width) + "║\n";
      output += "╚" + border + "╝\n";
    }

    return output;
  }

  var messages = {
    en: {
      welcome: generateWelcomeMessage("en"),
      langChanged: "Language changed to English. Reloading resume...",
      langCurrent: "Current language: English",
      langInvalid: "Invalid language. Available languages: en, fr",
    },
    fr: {
      welcome: generateWelcomeMessage("fr"),
      langChanged: "Langue changée en Français. Rechargement du CV...",
      langCurrent: "Langue actuelle : Français",
      langInvalid: "Langue invalide. Langues disponibles : en, fr",
    },
  };

  var welcomeMessage = messages[currentLanguage].welcome;

  function formatEmployment(workData) {
    if (!workData || !workData.length) return "No employment history found.";

    var output = "";
    workData.forEach(function (job) {
      output += "\n";
      // Company
      output += "[[b;#00ff41;]" + job.company + "]\n";
      // Position & Date
      var date = job.startDate + " - " + (job.endDate || "Present");
      output += "[[b;#00d9ff;]" + job.position + "]  |  " + date + "\n";
      // Location
      if (job.location) {
        output += "📍 " + job.location + "\n";
      }
      // Summary
      if (job.summary) {
        output += job.summary + "\n";
      }
      // Highlights
      if (job.highlights && job.highlights.length) {
        job.highlights.forEach(function (highlight) {
          output += "• " + highlight + "\n";
        });
      }
      output += "\n--------------------------------------------------\n";
    });
    return output;
  }

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
    extraDetails: getResumeJsonPath(currentLanguage),
    showHighlights: true,
    showSummary: true,
    completion: true,
    caseSensitiveAutocomplete: false,
    customCommands: [
      {
        name: "lang",
        title: "Language",
        description:
          currentLanguage === "en"
            ? "switch language (usage: lang [en|fr])"
            : "changer de langue (usage: lang [en|fr])",
        type: "system",
        handler: function (lang) {
          if (!lang) {
            return messages[currentLanguage].langCurrent;
          }
          lang = lang.toLowerCase().trim();
          if (lang === "en" || lang === "fr") {
            if (lang !== currentLanguage) {
              localStorage.setItem("resumeLanguage", lang);
              setTimeout(function () {
                var url = new URL(window.location);
                url.searchParams.set("lang", lang);
                window.location = url.toString();
              }, 500);
              return messages[currentLanguage].langChanged;
            } else {
              return messages[currentLanguage].langCurrent;
            }
          } else {
            return messages[currentLanguage].langInvalid;
          }
        },
      },
      {
        name: "employment",
        title: "Employment",
        description: "employment history",
        type: "system",
        handler: function () {
          return formatEmployment(term.data.work);
        },
      },
      {
        name: "work",
        title: "Work",
        description: "alias for employment",
        type: "system",
        handler: function () {
          return formatEmployment(term.data.work);
        },
      },
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
      {
        name: "contact",
        title: "Contact Information",
        description: "how to reach me",
        type: "calculated",
        data: ["basics"],
        dataIsObject: true,
        handler: function (data) {
          var contact = [];
          if (data.email) contact.push("📧 Email: " + data.email);
          if (data.phone) contact.push("📱 Phone: " + data.phone);
          if (data.url) contact.push("🌐 Website: " + data.url);
          return contact.join("\n");
        },
      },
      {
        name: "email",
        title: "Email",
        description: "email address",
        type: "basic",
        data: ["basics", "email"],
      },
      {
        name: "phone",
        title: "Phone",
        description: "phone number",
        type: "basic",
        data: ["basics", "phone"],
      },
      {
        name: "photo",
        title: "Photo",
        description: "display profile photo",
        type: "system",
        handler: function () {
          var isMobile = window.innerWidth <= 768;
          var size = isMobile ? "150px" : "200px";
          return (
            '<div style="text-align: center; margin: 20px 0;"><img src="images/photo.jpg" alt="Mohammed Essaddek" style="max-width: ' +
            size +
            '; height: auto; border-radius: 50%; border: 3px solid #00ff41; box-shadow: 0 0 20px rgba(0, 255, 65, 0.5);"/></div>'
          );
        },
      },
      {
        name: "splash",
        description: "print the welcome screen",
        type: "system",
        handler: function () {
          return messages[currentLanguage].welcome;
        },
      },
    ],
  };

  // Initialize terminal with custom settings
  var term = $(".terminal-wrapper").CMDResume(
    getResumeJsonPath(currentLanguage),
    settings
  );

  // Patch commandLineParse to handle arguments for 'lang' command
  // The CMDResume plugin attaches the internal object to the jQuery object as .CMDResume
  var internalTerm = term.CMDResume || term;

  if (internalTerm && internalTerm.commandLineParse) {
    var originalParse = internalTerm.commandLineParse;
    internalTerm.commandLineParse = function (name, args) {
      if (name === "lang") {
        var langArg = args[0];
        if (internalTerm.commands && internalTerm.commands.lang) {
          return internalTerm.commands.lang.handler(langArg);
        }
      }
      return originalParse.apply(internalTerm, [name, args]);
    };
  }

  // Ensure scroll to bottom on init
  // setTimeout(scrollToBottom, 500);

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
  // var observer = new MutationObserver(function () {
  //   setTimeout(scrollToBottom, 100);
  // });

  // Observe terminal output for changes
  // setTimeout(function () {
  //   var terminalOutput = document.querySelector(".terminal-output");
  //   if (terminalOutput) {
  //     observer.observe(terminalOutput, {
  //       childList: true,
  //       subtree: true,
  //     });
  //   }
  // }, 500);

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

  // Fix for mobile keyboard scrolling
  $(window).on("resize", function () {
    if (
      document.activeElement &&
      document.activeElement.tagName === "TEXTAREA"
    ) {
      setTimeout(scrollToBottom, 100);
    }
  });

  // Fix for mobile "Enter" key behavior and general typing scroll
  // Some mobile keyboards trigger a keydown with keyCode 13 (Enter) which might be interpreted prematurely
  // We ensure that the terminal handles it correctly and scrolls on typing
  $(document).on("keydown", function (e) {
    // Ensure we are focused on the terminal
    if (term && (term.term || term.echo)) {
      // Scroll on any key press to keep cursor in view
      // setTimeout(scrollToBottom, 10);
    }
  });
});
