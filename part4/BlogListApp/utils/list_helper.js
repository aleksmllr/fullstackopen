/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sumLikes, blog) => {
    return sumLikes + blog.likes
  }

  return blogs.length === 1 ? blogs[0].likes : blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  const reducer = (favBlog, blog) => {
    if (favBlog.likes < blog.likes) {
      return {
        title: blog.title,
        author: blog.author,
        likes: blog.likes,
      }
    }
    return favBlog
  }

  return blogs.reduce(reducer, { title: '', author: '', likes: 0 })
}

const mostBlogs = (blogs) => {
  const authorCounts = _.countBy(blogs, 'author')

  const authorCountObjs = _.map(authorCounts, (value, key) => ({
    author: key,
    blogs: value,
  }))

  return _.maxBy(authorCountObjs, 'blogs')
}

const mostLikes = (blogs) => {
  const authorLikes = _.groupBy(blogs, 'author')

  const authorLikesTotal = _.map(authorLikes, (authorsBlogs, author) => ({
    author,
    likes: _.sumBy(authorsBlogs, 'likes'),
  }))

  const mostLikesObj = _.maxBy(authorLikesTotal, 'likes')

  return { author: mostLikesObj.author, likes: mostLikesObj.likes }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
}
