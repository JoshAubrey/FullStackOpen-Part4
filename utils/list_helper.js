const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce(((sum, blog) => sum + blog.likes), 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce(((fav, blog) => (fav.likes > blog.likes) ? fav : blog), 0)
}

const mostBlogs = (blogs) => {
    let authorMostBlogs = {
        author: '',
        blogs: 0
    }

    blogs = _.orderBy(blogs, ['author'], ['desc'])
    authorMostBlogs.author = blogs[0].author
    blogs.forEach(((blog) => {if (blog.author === authorMostBlogs.author) authorMostBlogs.blogs++}))
    
    return authorMostBlogs
}

const mostLikes = (blogs) => {
    let authorMostLikes = {
        author: '',
        likes: 0
    }

    blogs = _(blogs)
        .groupBy('author')
        .orderBy(((blog) => _.sumBy(blog, 'likes')), ['desc'])
        .value()
    //console.log(blogs)
    authorMostLikes.author = blogs[0][0].author
    blogs[0].forEach(((blog) => {authorMostLikes.likes += blog.likes}))
    
    return authorMostLikes
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}