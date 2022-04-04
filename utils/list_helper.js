const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    const sum = blogs.reduce((acc, object) => {
        return acc + object.likes
    }, 0)
    return sum
}

const favoriteBlog = (blogs) => {
    const fav = blogs.reduce(function(prev, curr) {
        return (prev.likes > curr.likes) ? prev : curr
    })
    return {
        title: fav.title,
        author: fav.author,
        likes: fav.likes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}