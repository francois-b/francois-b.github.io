/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
exports.onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ lang: `en` })

  // Inject font preloads and blocking script to apply theme before render to prevent flash
  setHeadComponents([
    // Preconnect to Google Fonts
    React.createElement("link", {
      key: "preconnect-google-fonts",
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    }),
    React.createElement("link", {
      key: "preconnect-gstatic",
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    }),
    // Load fonts with display=swap for better perceived performance
    // Literata: variable serif optimized for digital reading (Google Play Books typeface)
    // Inter: variable sans-serif for UI and short text
    React.createElement("link", {
      key: "google-fonts",
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&display=swap",
    }),
    // Theme hydration script
    React.createElement("script", {
      key: "theme-hydration",
      dangerouslySetInnerHTML: {
        __html: `
          (function() {
            try {
              var THEME_STORAGE_KEY = 'preferred-theme';

              var stored = localStorage.getItem(THEME_STORAGE_KEY);
              var theme = 'sun'; // default

              if (stored === 'sun' || stored === 'rain' || stored === 'night') {
                theme = stored;
              } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                theme = 'night';
              }

              // Set attribute on documentElement to avoid any timing issues
              document.documentElement.setAttribute('data-theme', theme);

              // Also set on body when it's available
              if (document.body) {
                document.body.className = document.body.className.replace(/theme-\\w+/g, '').trim();
                document.body.classList.add('theme-' + theme);
              } else {
                // If body doesn't exist yet, wait for it
                document.addEventListener('DOMContentLoaded', function() {
                  document.body.className = document.body.className.replace(/theme-\\w+/g, '').trim();
                  document.body.classList.add('theme-' + theme);
                });
              }
            } catch (e) {}
          })();
        `,
      },
    }),
  ])
}

const React = require("react")
const { ThemeProvider } = require("./src/context/theme-context")

exports.wrapRootElement = ({ element }) => (
  React.createElement(ThemeProvider, null, element)
)
