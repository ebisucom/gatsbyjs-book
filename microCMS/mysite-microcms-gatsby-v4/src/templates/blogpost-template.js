import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock, faFolderOpen } from "@fortawesome/free-regular-svg-icons"
import {
  faChevronLeft,
  faChevronRight,
  faCheckSquare,
} from "@fortawesome/free-solid-svg-icons"

import Seo from "../components/seo"

import { convert } from "html-to-text"

import { ImgixGatsbyImage } from "@imgix/gatsby"

import unified from "unified"
import parse from "rehype-parse"
import rehypeReact from "rehype-react"

const renderAst = new rehypeReact({
  createElement: React.createElement,
  Fragment: React.Fragment,
  components: {
    h2: props => {
      return (
        <h2>
          <FontAwesomeIcon icon={faCheckSquare} />
          {props.children}
        </h2>
      )
    },
    img: props => {
      return (
        <ImgixGatsbyImage
          src={props.src}
          imgixParams={{ auto: ["format", "compress"] }}
          layout="constrained"
          width={785}
          sourceWidth={props.width}
          sourceHeight={props.height}
        />
      )
    },
  },
}).Compiler

const BlogpostTemp = ({ data, pageContext, location }) => {
  const htmlAst = unified()
    .use(parse, { fragment: true })
    .parse(data.microcmsBlog.content)

  return (
    <Layout>
      <Seo
        pagetitle={data.microcmsBlog.title}
        pagedesc={`${convert(data.microcmsBlog.content, {
          selectors: [
            { selector: "a", options: { ignoreHref: true } },
            { selector: "img", format: "skip" },
          ],
        }).slice(0, 70)}…`}
        pagepath={location.pathname}
        blogimg={data.microcmsBlog.eyecatch.url}
        pageimgw={data.microcmsBlog.eyecatch.width}
        pageimgh={data.microcmsBlog.eyecatch.height}
      />
      <div className="eyecatch">
        <figure>
          <ImgixGatsbyImage
            src={data.microcmsBlog.eyecatch.url}
            imgixParams={{ auto: ["format", "compress"] }}
            layout="fullWidth"
            sourceWidth={data.microcmsBlog.eyecatch.width}
            sourceHeight={data.microcmsBlog.eyecatch.height}
          />
        </figure>
      </div>
      <article className="content">
        <div className="container">
          <h1 className="bar">{data.microcmsBlog.title}</h1>
          <aside className="info">
            <time dateTime={data.microcmsBlog.publishDate}>
              <FontAwesomeIcon icon={faClock} />
              {data.microcmsBlog.publishDateJP}
            </time>
            <div className="cat">
              <FontAwesomeIcon icon={faFolderOpen} />
              <ul>
                {data.microcmsBlog.category.map(cat => (
                  <li className={cat.categorySlug} key={cat.id}>
                    <Link to={`/cat/${cat.categorySlug}/`}>{cat.category}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <div className="postbody">{renderAst(htmlAst)}</div>
          <ul className="postlink">
            {pageContext.next && (
              <li className="prev">
                <Link to={`/blog/post/${pageContext.next.slug}/`} rel="prev">
                  <FontAwesomeIcon icon={faChevronLeft} />
                  <span>{pageContext.next.title}</span>
                </Link>
              </li>
            )}
            {pageContext.previous && (
              <li className="next">
                <Link
                  to={`/blog/post/${pageContext.previous.slug}/`}
                  rel="next"
                >
                  <span>{pageContext.previous.title}</span>
                  <FontAwesomeIcon icon={faChevronRight} />
                </Link>
              </li>
            )}
          </ul>
        </div>
      </article>
    </Layout>
  )
}

export const query = graphql`
  query($id: String!) {
    microcmsBlog(id: { eq: $id }) {
      title
      publishDateJP: publishDate(formatString: "YYYY年MM月DD日")
      publishDate
      category {
        category
        categorySlug
        id
      }
      eyecatch {
        url
        width
        height
      }
      content
    }
  }
`

export default BlogpostTemp
