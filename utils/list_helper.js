const dummy = (blogs) => {
    return blogs.length
}

const totalLikes = (blogs) => {
    const sum = blogs.reduce((acc, object) => {
        return acc + object.likes
    }, 0)
    return sum
}

module.exports = {
    dummy,
    totalLikes
}