const path = require("path")
const axios = require("axios")

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const blogresult = await graphql(`
    query {
      allMicrocmsBlog(sort: { fields: publishDate, order: DESC }) {
        edges {
          node {
            id
            slug
          }
          next {
            title
            slug
          }
          previous {
            title
            slug
          }
        }
        group(field: category___categorySlug) {
          totalCount
          fieldValue
        }
      }
      allMicrocmsCategory {
        nodes {
          category
          categorySlug
          categoryId
        }
      }
    }
  `)

  if (blogresult.errors) {
    reporter.panicOnBuild(`GraphQL のクエリでエラーが発生しました`)
    return
  }

  blogresult.data.allMicrocmsBlog.edges.forEach(({ node, next, previous }) => {
    createPage({
      path: `/blog/post/${node.slug}/`,
      component: path.resolve(`./src/templates/blogpost-template.js`),
      context: {
        id: node.id,
        next,
        previous,
      },
    })
  })

  const blogPostsPerPage = 6 //１ページに表示する記事の数
  const blogPosts = blogresult.data.allMicrocmsBlog.edges.length //記事の総数
  const blogPages = Math.ceil(blogPosts / blogPostsPerPage) //記事一覧ページの総数

  Array.from({ length: blogPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/blog/` : `/blog/${i + 1}/`,
      component: path.resolve("./src/templates/blog-template.js"),
      context: {
        skip: blogPostsPerPage * i,
        limit: blogPostsPerPage,
        currentPage: i + 1, //現在のページ番号
        isFirst: i + 1 === 1, //最初のページ
        isLast: i + 1 === blogPages, //最後のページ
      },
    })
  })

  blogresult.data.allMicrocmsBlog.group.forEach(node => {
    const catPostsPerPage = 6 //１ページに表示する記事の数
    const catPosts = node.totalCount //カテゴリーに属した記事の総数
    const catPages = Math.ceil(catPosts / catPostsPerPage) //カテゴリーページの総数

    Array.from({ length: catPages }).forEach((_, i) => {
      createPage({
        path:
          i === 0
            ? `/cat/${node.fieldValue}/`
            : `/cat/${node.fieldValue}/${i + 1}/`,
        component: path.resolve(`./src/templates/cat-template.js`),
        context: {
          catid: blogresult.data.allMicrocmsCategory.nodes.find(
            n => n.categorySlug === node.fieldValue
          ).categoryId,
          catname: blogresult.data.allMicrocmsCategory.nodes.find(
            n => n.categorySlug === node.fieldValue
          ).category,
          catslug: node.fieldValue,
          skip: catPostsPerPage * i,
          limit: catPostsPerPage,
          currentPage: i + 1, //現在のページ番号
          isFirst: i + 1 === 1, //最初のページ
          isLast: i + 1 === catPages, //最後のページ
        },
      })
    })
  })
}

exports.onCreateNode = async ({ node, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MicrocmsBlog`) {
    const results = await axios.get(`${node.eyecatch.url}?fm=json`)
    const { data } = results

    createNodeField({
      node,
      name: "width",
      value: data.PixelWidth,
    })

    createNodeField({
      node,
      name: "height",
      value: data.PixelHeight,
    })
  }
}
