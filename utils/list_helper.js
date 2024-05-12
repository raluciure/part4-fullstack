const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let likes = 0;
    for (const blog of blogs) {
        likes += blog.likes
    }
    return likes
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    const maxLikes = Math.max(...blogs.map(blog => blog.likes))
    const favoriteBlog = blogs.find(blog => blog.likes === maxLikes)

    return {
        title: favoriteBlog.title,
        author: favoriteBlog.author,
        likes: favoriteBlog.likes,
    }
};

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    const topBlogger = blogs.reduce((accumulator, blog) => {
        accumulator[blog.author] = (accumulator[blog.author] || 0) + 1;
        return accumulator;
    }, {});

    const [author, blogsCount] = Object.entries(topBlogger).reduce((accumulator, [author, count]) => {
        return count > accumulator[1] ? [author, count] : accumulator;
    }, ["", 0]);

    return {
        author,
        blogs: blogsCount
    }
};

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    const likesPerAuthor = {}
    let topAuthor = ""
    let mostLikes = 0

    blogs.forEach(blog => {
        if (!likesPerAuthor[blog.author]) {
            likesPerAuthor[blog.author] = 0;
        }
        likesPerAuthor[blog.author] += blog.likes;
    });

    for (const author in likesPerAuthor) {
        if (likesPerAuthor[author] > mostLikes) {
            mostLikes = likesPerAuthor[author];
            topAuthor = author;
        }
    }

    return {
        author: topAuthor,
        likes: mostLikes
    }
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}