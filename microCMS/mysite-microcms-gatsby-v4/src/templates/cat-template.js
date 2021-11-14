import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"

import Seo from "../components/seo"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"

import { ImgixGatsbyImage } from '@imgix/gatsby'

const CatTemp = ({ data, location, pageContext }) => (
  <Layout>
    <Seo
      pagetitle={`CATEGORY: ${pageContext.catname}`}
      pagedesc={`「${pageContext.catname}」カテゴリーの記事です`}
      pagepath={location.pathname}
    />
    <section className="content bloglist">
      <div className="container">
        <h1 className="bar">CATEGORY: {pageContext.catname}</h1>
        <div className="posts">
          {data.allMicrocmsBlog.edges.map(({ node }) => (
            <article className="post" key={node.id}>
              <Link to={`/blog/post/${node.slug}/`}>
                <figure>
                  <ImgixGatsbyImage
                    src={node.eyecatch.url}
                    imgixParams={{ auto: ["format", "compress"] }}
                    layout="constrained"
                    width={500}
                    sourceWidth={node.eyecatch.width}
                    sourceHeight={node.eyecatch.height}
                    style={{ height: "100%" }}
                    />
                </figure>
                <h3>{node.title}</h3>
              </Link>
            </article>
          ))}
        </div>

        <ul className="pagenation">
          {!pageContext.isFirst && (
            <li className="prev">
              <Link
                to={
                  pageContext.currentPage === 2
                    ? `/cat/${pageContext.catslug}/`
                    : `/cat/${pageContext.catslug}/${
                        pageContext.currentPage - 1
                      }/`
                }
                rel="prev"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
                <span>前のページ</span>
              </Link>
            </li>
          )}
          {!pageContext.isLast && (
            <li className="next">
              <Link
                to={`/cat/${pageContext.catslug}/${
                  pageContext.currentPage + 1
                }/`}
                rel="next"
              >
                <span> 次のページ</span>
                <FontAwesomeIcon icon={faChevronRight} />
              </Link>
            </li>
          )}
        </ul>
      </div>
    </section>
  </Layout>
)

export const query = graphql`
  query($catid: String!, $skip: Int!, $limit: Int!) {
    allMicrocmsBlog(
      sort: { order: DESC, fields: publishDate }
      skip: $skip
      limit: $limit
      filter: { category: { elemMatch: { id: { eq: $catid } } } }
    ) {
      edges {
        node {
          title
          id
          slug
          eyecatch {
            url
            width
            height
          }
        }
      }
    }
  }
`

export default CatTemp
