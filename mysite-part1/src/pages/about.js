import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/layout"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUtensils, faCheckSquare } from "@fortawesome/free-solid-svg-icons"

import SEO from "../components/seo"

export default ({ data, location }) => (
  <Layout>
    <SEO
      pagetitle="ESSENTIALS について"
      pagedesc=" 食べ物についての情報を発信しているサイトです。"
      pagepath={location.pathname}
      pageimg={data.about.childImageSharp.original.src}
      pageimgw={data.about.childImageSharp.original.width}
      pageimgh={data.about.childImageSharp.original.height}
    />
    <div className="eyecatch">
      <figure>
        <Img
          fluid={data.about.childImageSharp.fluid}
          alt="ブルーベリー＆ヨーグルト"
        />
      </figure>
    </div>
    <article className="content">
      <div className="container">
        <h1 className="bar">ESSENTIALSについて</h1>
        <aside className="info">
          <div className="subtitle">
            <FontAwesomeIcon icon={faUtensils} />
            ABOUT ESSENTIALS
          </div>
        </aside>
        <div className="postbody">
          <p>
            体に必要不可欠な食べ物についての情報を発信しているサイトです。「おいしい食材をおいしく食べる」をモットーにしています。特に力を入れているのが、フルーツ、穀物、飲み物の３つです。
          </p>
          <h2>
            <FontAwesomeIcon icon={faCheckSquare} />
            公開している記事
          </h2>
          <p>
            これらについて、次のような記事やレシピなどを書いて公開しています。
          </p>
          <ul>
            <li>ヘルシーで美味しい料理の研究・レビュー・レシピ。</li>
            <li>一人でも、家族や友人と一緒にでも楽しめる料理。</li>
            <li>ユーザー間のオープンなコミュニケーションを基盤とした情報。</li>
          </ul>
          <h2>
            <FontAwesomeIcon icon={faCheckSquare} />
            よく聞かれること
          </h2>
          <p>
            よく聞かれることなのですが、私たちはスタートアップではありません。私たちはまだスタートしたばかりで、より多くの人々が食べやすい食べ物がもたらす違いを発見できるように、成長しサービスを改善する機会を待っています。
          </p>
          <p>気長にお付き合いいただければ幸いです。</p>
        </div>
      </div>
    </article>
  </Layout>
)

export const query = graphql`
  query {
    about: file(relativePath: { eq: "about.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 1600) {
          ...GatsbyImageSharpFluid_withWebp
        }
        original {
          src
          height
          width
        }
      }
    }
  }
`
