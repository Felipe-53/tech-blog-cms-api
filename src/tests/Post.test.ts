import { expect, describe, it } from 'vitest'
import { CreatePostDTO } from '../dtos/CreatePostDTO'
import { Author } from '../entities/Author/Author'
import { Category } from '../entities/Category/Category'
import { InMemoryRespository } from '../repositories/implentations/InMemoryRepository'
import { FindAllPosts } from '../use-cases/FindAllPosts/FindAllPosts'
import { FindPostBySlug } from '../use-cases/FindPostBySlug/FindPostBySlug'
import { CreatePost } from '../use-cases/CreatePost/CreatePost'

const author: Author = {
  id: '1',
  name: 'Felipe',
  admin: true
}

const categories: Category[] = [
  { id: '1', name: 'Node'},
  { id: '2', name: 'Typescript'},
]

const newPostData: CreatePostDTO = {
  author,
  title: 'My First Post',
  body: 'Hello World!',
  excerpt: '',
  categories,
  ogImageUrl: 'http://example.com',
}

describe('djewiodj', () => {
  const inMemoryRepo = new InMemoryRespository()

  it('Should be able to create a Post', async () => {
    const createPost = new CreatePost(inMemoryRepo)
    const createdPost = await createPost.execute(newPostData)
    expect(createdPost.id).toBeTypeOf('string')
    expect(createdPost.slug).toBe('my-first-post')
    expect(createdPost.createdAt).toBeInstanceOf(Date)
    expect(createdPost.updatedAt).toBeInstanceOf(Date)
  })
  
  it('Should be found within the repository', async () => {
    const findAllPosts = new FindAllPosts(inMemoryRepo)
    const posts = await findAllPosts.execute(author.id)
    expect(posts.length).toBe(1)
    expect(posts[0].title).toBe('My First Post')
  })

  it('Should be found by slug', async () => {
    const findPostBySlug = new FindPostBySlug(inMemoryRepo)
    const searchedPost = await findPostBySlug.execute('my-first-post')
    expect(searchedPost).not.toBeNull()
  })

  it('Should be able to update post')
})


