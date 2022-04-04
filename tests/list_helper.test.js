const { TestWatcher } = require('jest')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
    const emptyList = []

    test('of empty list is zero', () => {
        const result = listHelper.totalLikes(emptyList)
        expect(result).toBe(0)
    })
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
          }
    ]
    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })
    const listWithThreeBlogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
          },
        {
            _id: 'safsdaf3fe323242wfe',
            title: 'Test Blog 1',
            author: 'Test Man',
            url: 'http://www.blogspot.com',
            likes: 24,
            __v: 0
          },
        {
            _id: '23434efsafsdasfd324234',
            title: 'Test Blog 2',
            author: 'Test Woman',
            url: 'http://www.wordpress.com/blog',
            likes: 18,
            __v: 0
          },
    ]
    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(listWithThreeBlogs)
        expect(result).toBe(47)
    })
})