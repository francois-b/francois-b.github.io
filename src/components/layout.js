/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import SideMenu from "./SideMenu"
import "./layout.css"
import "../styles/cv.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div className="cv-container">
      <aside className="cv-sidebar">
        <SideMenu />
      </aside>

      <div className="cv-content">
        <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
        <main>{children}</main>
      
      </div>
    </div>
  )
}

export default Layout
