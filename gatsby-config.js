/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Professional CV - Your Name`,
    description: `Professional CV website showcasing experience, skills, and projects of a Full Stack Developer & Creative Technologist.`,
    author: `Your Name`,
    siteUrl: `https://yourwebsite.com`,
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Professional CV`,
        short_name: `CV`,
        start_url: `/`,
        background_color: `#667eea`,
        theme_color: `#667eea`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
  ],
}
