function openTab(evt, tabName) {
  let i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  if (evt && evt.currentTarget) {
    evt.currentTarget.className += " active";
  }
}

function initSettingsTabs() {
  // The tab switching is handled by onclick attributes in settings.html calling openTab.
  console.log("Settings tabs initialized by initSettingsTabs. Default tab display is handled by HTML.");
}

function initNavbarColorPickers() {
  const colorPickers = [
    { id: 'navbarBgColor', variable: '--navbar-bg-color' },
    { id: 'navButtonBgColor', variable: '--navbar-button-bg-color' },
    { id: 'navButtonTextColor', variable: '--navbar-button-text-color' },
    { id: 'navButtonHoverBgColor', variable: '--navbar-button-hover-bg-color' },
    { id: 'navButtonActiveBgColor', variable: '--navbar-button-active-bg-color' }
  ];

  colorPickers.forEach(picker => {
    const inputElement = document.getElementById(picker.id);
    if (inputElement) {
      // Set initial value from CSS variable
      try {
        const currentCssValue = getComputedStyle(document.documentElement).getPropertyValue(picker.variable).trim();
        if (currentCssValue) {
          // Input type="color" expects hex values. RGB values from getComputedStyle need conversion.
          // For simplicity, if it's an rgb value, we'll log it and let the HTML default value stand.
          // A more robust solution would convert RGB to Hex.
          if (currentCssValue.startsWith('rgb')) {
            console.log(`Initial value for ${picker.id} is RGB: ${currentCssValue}. Using HTML default.`);
            // The inputElement.value is already set by HTML. If we need to override or ensure,
            // we would convert currentCssValue to hex here.
          } else {
            inputElement.value = currentCssValue;
          }
        } else {
           // Fallback to HTML default if CSS variable is empty, though HTML already sets a value.
           console.log(`CSS variable ${picker.variable} is empty. Using HTML default for ${picker.id}.`);
        }
      } catch (e) {
        console.error(`Error getting CSS variable ${picker.variable} for ${picker.id}:`, e);
        // Fallback to HTML default on error.
      }

      inputElement.addEventListener('input', (event) => {
        document.documentElement.style.setProperty(picker.variable, event.target.value);
      });
    } else {
      console.warn(`Color picker input element with ID '${picker.id}' not found.`);
    }
  });
}

// Call initSettingsTabs and initNavbarColorPickers when the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', function() {
  initSettingsTabs();
  initNavbarColorPickers();
});
