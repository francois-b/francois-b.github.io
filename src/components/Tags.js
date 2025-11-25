import * as React from "react"
import "../styles/blog.css"

const Tags = ({ tags }) => {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <ul className="blog-post-card__tags">
      {tags.map(tag => (
        <li key={tag} className="blog-post-card__tag">
          {tag}
        </li>
      ))}
    </ul>
  )
}

export default Tags
