import { expect, describe, it } from 'vitest'
import { CreatePostDTO } from '../dtos/CreatePostDTO'
import { Category } from '../entities/Category'
import { InMemoryPostRespository } from '../repositories/implentations/InMemory/InMemoryPostRepository'
import { FindAllPosts } from '../use-cases/Post/FindAllPosts/FindAllPosts'
import { FindPostBySlug } from '../use-cases/Post/FindPostBySlug/FindPostBySlug'
import { CreatePost } from '../use-cases/Post/CreatePost/CreatePost'
import { UpdatePost } from '../use-cases/Post/UpdatePost/UpdatePost'
import { DeletePost } from '../use-cases/Post/DeletePost/DeletePost'
import { InMemoryAuthorRepository } from '../repositories/implentations/InMemory/inMemoryAuthorRepository'

describe('Post CRUD', async () => {
  const inMemoryPostRepo = new InMemoryPostRespository()
  const inMemoryAuthorRepo = new InMemoryAuthorRepository()

  const author = await inMemoryAuthorRepo.create({
    name: 'Felipe',
    admin: true,
  })

  it('Should be able to create a Post', async () => {
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

    const createPost = new CreatePost(inMemoryPostRepo, inMemoryAuthorRepo)
    const createdPost = await createPost.execute(newPostData)
    expect(createdPost.id).toBeTypeOf('string')
    expect(createdPost.slug).toBe('my-first-post')
    expect(createdPost.createdAt).toBeInstanceOf(Date)
    expect(createdPost.updatedAt).toBeInstanceOf(Date)
  })
  
  it('Should be found within the repository', async () => {
    const findAllPosts = new FindAllPosts(inMemoryPostRepo)
    const posts = await findAllPosts.execute(author.id)
    expect(posts.length).toBe(1)
    expect(posts[0].title).toBe('My First Post')
  })

  it('Should be found by slug', async () => {
    const findPostBySlug = new FindPostBySlug(inMemoryPostRepo)
    const searchedPost = await findPostBySlug.execute('my-first-post')
    expect(searchedPost).not.toBeNull()
  })

  it('Should be able to update post', async () => {
    const findAllPosts = new FindAllPosts(inMemoryPostRepo)
    const originalPost = (await findAllPosts.execute(author.id))[0]
    expect(originalPost).toBeDefined()
    originalPost.title = 'My New Title'
    originalPost.body = 'My New Body'
    const updatePost = new UpdatePost(inMemoryPostRepo)
    const updatedPost = await updatePost.execute(originalPost.id, originalPost)
    expect(updatedPost.slug).toBe('my-new-title')
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(updatedPost.createdAt.getTime())
  })

  it('Should be able to delete a post', async () => {
    const findAllPosts = new FindAllPosts(inMemoryPostRepo)
    const deletePost = new DeletePost(inMemoryPostRepo)
    
    const originalPost = (await findAllPosts.execute(author.id))[0]
    expect(originalPost).toBeDefined()
    await deletePost.execute(originalPost.id)
    const posts = await findAllPosts.execute(author.id)
    expect(posts.length).toBe(0)
  })
})


