/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
 */

const React = require("react")
const { ThemeProvider } = require("./src/context/theme-context")
const { AudioProvider } = require("./src/context/audio-context")

exports.wrapRootElement = ({ element }) => (
	React.createElement(
		ThemeProvider,
		null,
		React.createElement(AudioProvider, null, element)
	)
)
