import React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import "../styles/blog.css"  // For component examples
import "../styles/design-system.css"

const ColorSwatch: React.FC<{ name: string; variable: string; dark?: boolean }> = ({ name, variable, dark }) => (
  <div className="ds-swatch">
    <div
      className="ds-swatch__color"
      style={{ background: `var(${variable})` }}
      data-dark={dark}
    />
    <div className="ds-swatch__info">
      <span className="ds-swatch__name">{name}</span>
      <code className="ds-swatch__var">{variable}</code>
    </div>
  </div>
)

const TypographySample: React.FC<{
  label: string
  variable: string
  font?: 'serif' | 'sans' | 'mono'
  children: React.ReactNode
}> = ({ label, variable, font = 'sans', children }) => (
  <div className="ds-type-sample">
    <div className="ds-type-sample__meta">
      <span className="ds-type-sample__label">{label}</span>
      <code className="ds-type-sample__var">{variable}</code>
    </div>
    <div className={`ds-type-sample__text ds-type-sample__text--${font}`} style={{ fontSize: `var(${variable})` }}>
      {children}
    </div>
  </div>
)

const DesignSystemPage: React.FC = () => {
  return (
    <Layout>
      <div className="ds-page">
        <header className="ds-header">
          <h1 className="ds-header__title">Design System</h1>
          <p className="ds-header__intro">
            A living reference of the design tokens and component patterns used across this site.
            Toggle themes using the controls in the header to see how everything adapts.
          </p>
        </header>

        {/* Colors */}
        <section className="ds-section">
          <h2 className="ds-section__title">Colors</h2>

          <h3 className="ds-subsection__title">Core Palette</h3>
          <div className="ds-swatches">
            <ColorSwatch name="Primary" variable="--color-primary" />
            <ColorSwatch name="Secondary" variable="--color-secondary" />
            <ColorSwatch name="Link" variable="--color-link" />
            <ColorSwatch name="Link Hover" variable="--color-link-hover" />
          </div>

          <h3 className="ds-subsection__title">Text</h3>
          <div className="ds-swatches">
            <ColorSwatch name="Text" variable="--color-text" />
            <ColorSwatch name="Text Light" variable="--color-text-light" />
            <ColorSwatch name="Text Lighter" variable="--color-text-lighter" />
          </div>

          <h3 className="ds-subsection__title">Backgrounds</h3>
          <div className="ds-swatches">
            <ColorSwatch name="Background" variable="--color-bg" />
            <ColorSwatch name="Background Subtle" variable="--color-bg-subtle" />
            <ColorSwatch name="Border" variable="--color-border" />
          </div>

          <h3 className="ds-subsection__title">Highlights</h3>
          <div className="ds-swatches">
            <ColorSwatch name="Engineering" variable="--highlight-engineering" />
            <ColorSwatch name="AI" variable="--highlight-ai" />
            <ColorSwatch name="Domain" variable="--highlight-domain" />
          </div>
        </section>

        {/* Typography */}
        <section className="ds-section">
          <h2 className="ds-section__title">Typography</h2>

          <h3 className="ds-subsection__title">Font Families</h3>
          <div className="ds-font-families">
            <div className="ds-font-family">
              <div className="ds-font-family__sample ds-font-family__sample--serif">
                Literata — The quick brown fox jumps over the lazy dog
              </div>
              <code>--font-serif</code>
            </div>
            <div className="ds-font-family">
              <div className="ds-font-family__sample ds-font-family__sample--sans">
                Inter — The quick brown fox jumps over the lazy dog
              </div>
              <code>--font-sans</code>
            </div>
            <div className="ds-font-family">
              <div className="ds-font-family__sample ds-font-family__sample--mono">
                Fira Code — The quick brown fox jumps over the lazy dog
              </div>
              <code>--font-mono</code>
            </div>
          </div>

          <h3 className="ds-subsection__title">Type Scale</h3>
          <div className="ds-type-scale">
            <TypographySample label="3XL" variable="--font-size-3xl" font="serif">
              Page Title
            </TypographySample>
            <TypographySample label="2XL" variable="--font-size-2xl" font="serif">
              Section Heading
            </TypographySample>
            <TypographySample label="XL" variable="--font-size-xl" font="serif">
              Subsection Heading
            </TypographySample>
            <TypographySample label="LG" variable="--font-size-lg" font="sans">
              Large Body Text
            </TypographySample>
            <TypographySample label="MD" variable="--font-size-md" font="sans">
              Medium Body Text
            </TypographySample>
            <TypographySample label="Base" variable="--font-size-base" font="sans">
              Base Body Text
            </TypographySample>
            <TypographySample label="SM" variable="--font-size-sm" font="sans">
              Small Text / Captions
            </TypographySample>
            <TypographySample label="XS" variable="--font-size-xs" font="sans">
              Extra Small / Labels
            </TypographySample>
          </div>
        </section>

        {/* Spacing & Radius */}
        <section className="ds-section">
          <h2 className="ds-section__title">Spacing & Radius</h2>

          <h3 className="ds-subsection__title">Spacing Scale</h3>
          <div className="ds-spacing-scale">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="ds-spacing-item">
                <div className="ds-spacing-item__bar" style={{ width: `var(--space-${n})` }} />
                <code>--space-{n}</code>
              </div>
            ))}
          </div>

          <h3 className="ds-subsection__title">Border Radius</h3>
          <div className="ds-radius-scale">
            <div className="ds-radius-item">
              <div className="ds-radius-item__box" style={{ borderRadius: 'var(--radius-sm)' }} />
              <code>--radius-sm</code>
            </div>
            <div className="ds-radius-item">
              <div className="ds-radius-item__box" style={{ borderRadius: 'var(--radius-md)' }} />
              <code>--radius-md</code>
            </div>
            <div className="ds-radius-item">
              <div className="ds-radius-item__box" style={{ borderRadius: 'var(--radius-lg)' }} />
              <code>--radius-lg</code>
            </div>
            <div className="ds-radius-item">
              <div className="ds-radius-item__box" style={{ borderRadius: 'var(--radius-full)' }} />
              <code>--radius-full</code>
            </div>
          </div>
        </section>

        {/* Shadows */}
        <section className="ds-section">
          <h2 className="ds-section__title">Shadows</h2>
          <div className="ds-shadows">
            <div className="ds-shadow-item">
              <div className="ds-shadow-item__box" style={{ boxShadow: 'var(--shadow-sm)' }} />
              <code>--shadow-sm</code>
            </div>
            <div className="ds-shadow-item">
              <div className="ds-shadow-item__box" style={{ boxShadow: 'var(--shadow-md)' }} />
              <code>--shadow-md</code>
            </div>
            <div className="ds-shadow-item">
              <div className="ds-shadow-item__box" style={{ boxShadow: 'var(--shadow-lg)' }} />
              <code>--shadow-lg</code>
            </div>
          </div>
        </section>

        {/* Components */}
        <section className="ds-section">
          <h2 className="ds-section__title">Components</h2>

          <h3 className="ds-subsection__title">Buttons</h3>
          <div className="ds-component-row">
            <div className="ds-component-example">
              <button className="blog-cluster">
                Default <span className="blog-cluster__count">12</span>
              </button>
              <code>.blog-cluster</code>
            </div>
            <div className="ds-component-example">
              <button className="blog-cluster blog-cluster--active">
                Active <span className="blog-cluster__count">8</span>
              </button>
              <code>.blog-cluster--active</code>
            </div>
          </div>

          <h3 className="ds-subsection__title">Tags</h3>
          <div className="ds-component-row">
            <div className="ds-component-example">
              <button className="blog-tag-filter">
                default <span className="blog-tag-filter__count">5</span>
              </button>
              <code>.blog-tag-filter</code>
            </div>
            <div className="ds-component-example">
              <button className="blog-tag-filter blog-tag-filter--active">
                active <span className="blog-tag-filter__count">3</span>
              </button>
              <code>.blog-tag-filter--active</code>
            </div>
            <div className="ds-component-example">
              <button className="blog-tag-filter blog-tag-filter--co-occurring">
                co-occurring <span className="blog-tag-filter__count">2</span>
              </button>
              <code>.blog-tag-filter--co-occurring</code>
            </div>
          </div>

          <h3 className="ds-subsection__title">Links</h3>
          <div className="ds-component-row">
            <div className="ds-component-example">
              <a href="#" onClick={e => e.preventDefault()}>Standard link</a>
              <code>a</code>
            </div>
          </div>

          <h3 className="ds-subsection__title">Code</h3>
          <div className="ds-component-row ds-component-row--wide">
            <div className="ds-component-example ds-component-example--block">
              <pre className="ds-code-block">
                <code>{`function greet(name: string): string {
  // Return a greeting
  return \`Hello, \${name}!\`;
}`}</code>
              </pre>
              <code>pre &gt; code</code>
            </div>
          </div>
        </section>

        {/* Prose */}
        <section className="ds-section">
          <h2 className="ds-section__title">Prose</h2>
          <div className="ds-prose-example">
            <h1>Article Title</h1>
            <p className="ds-prose-meta">January 15, 2025 · 8 min read</p>
            <p>
              This is an example of body text set in Literata at the base size. The typeface was
              designed for extended reading on screens, with careful attention to letter spacing
              and x-height. Notice how it pairs with <a href="#" onClick={e => e.preventDefault()}>
              inline links</a> and maintains readability.
            </p>
            <h2>Section Heading</h2>
            <p>
              Paragraphs should have comfortable line-height (1.6–1.7) for readability. The
              measure—line length—is kept between 60–75 characters for optimal reading flow.
            </p>
            <blockquote>
              "Blockquotes are styled to stand apart from body text while maintaining the
              overall typographic rhythm of the page."
            </blockquote>
            <h3>Subsection</h3>
            <p>
              Lists, code snippets, and other elements follow the same spacing rhythm:
            </p>
            <ul>
              <li>First item in an unordered list</li>
              <li>Second item with more text to show wrapping behavior</li>
              <li>Third item</li>
            </ul>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Design System" />

export default DesignSystemPage
