import { expect, describe, it, test } from "vitest"
import { CreatePostDTO } from "../dtos/CreatePostDTO"
import { Category } from "../entities/Category"
import { InMemoryPostRespository } from "../repositories/implentations/InMemory/InMemoryPostRepository"
import { FindAllPosts } from "../use-cases/Post/FindAllPosts/FindAllPosts"
import { FindPostBySlug } from "../use-cases/Post/FindPostBySlug/FindPostBySlug"
import { CreatePost } from "../use-cases/Post/CreatePost/CreatePost"
import { UpdatePost } from "../use-cases/Post/UpdatePost/UpdatePost"
import { DeletePost } from "../use-cases/Post/DeletePost/DeletePost"
import { InMemoryAuthorRepository } from "../repositories/implentations/InMemory/inMemoryAuthorRepository"
import { InMemoryCategoryRespository } from "../repositories/implentations/InMemory/InMemoryCategoryRepository"
import { Author } from "../entities/Author"

describe("Post CRUD", async () => {
  const inMemoryPostRepo = new InMemoryPostRespository()
  const inMemoryAuthorRepo = new InMemoryAuthorRepository()
  const inMemoryCategoryRepository = new InMemoryCategoryRespository()

  const author = await inMemoryAuthorRepo.create({
    name: "Felipe",
    email: "felipeandresb97@gmail.com",
    admin: true,
  })

  const categories: Category[] = []
  categories.push(await inMemoryCategoryRepository.create(new Category("Node")))
  categories.push(
    await inMemoryCategoryRepository.create(new Category("TypeScript"))
  )

  const newPostData: CreatePostDTO = {
    author,
    title: "My First Post",
    body: "Hello World!",
    excerpt: "",
    categories,
    ogImageUrl: "http://example.com",
  }

  describe("Should not be able to create a post that", async () => {
    test("Has non-existing author in the repo", async () => {
      // deep copy newPostData
      const postDataWrongAuthor = JSON.parse(JSON.stringify(newPostData))
      postDataWrongAuthor.author = new Author(
        "Not in the Repo",
        "not@intherepo.com",
        false
      )
      const createPost = new CreatePost(
        inMemoryPostRepo,
        inMemoryCategoryRepository,
        inMemoryAuthorRepo
      )
      expect(createPost.execute(postDataWrongAuthor)).rejects.toThrow(/author/)
    })

    test("Has non-existing category in the repo", async () => {
      const postDataWrongCategory = JSON.parse(JSON.stringify(newPostData))
      postDataWrongCategory.categories.push(new Category("Not in the repo"))
      const createPost = new CreatePost(
        inMemoryPostRepo,
        inMemoryCategoryRepository,
        inMemoryAuthorRepo
      )
      expect(createPost.execute(postDataWrongCategory)).rejects.toThrow(
        /category/
      )
    })
  })

  it("Should be able to create a Post", async () => {
    const createPost = new CreatePost(
      inMemoryPostRepo,
      inMemoryCategoryRepository,
      inMemoryAuthorRepo
    )
    const createdPost = await createPost.execute(newPostData)
    expect(createdPost.id).toBeTypeOf("string")
    expect(createdPost.slug).toBe("my-first-post")
    expect(createdPost.createdAt).toBeInstanceOf(Date)
    expect(createdPost.updatedAt).toBeInstanceOf(Date)
  })

  it("Should be found within the repository", async () => {
    const findAllPosts = new FindAllPosts(inMemoryPostRepo)
    const posts = await findAllPosts.execute(author.id)
    expect(posts.length).toBe(1)
    expect(posts[0].title).toBe("My First Post")
  })

  it("Should be found by slug", async () => {
    const findPostBySlug = new FindPostBySlug(inMemoryPostRepo)
    const searchedPost = await findPostBySlug.execute("my-first-post")
    expect(searchedPost).not.toBeNull()
  })

  it("Should be able to update post", async () => {
    const findAllPosts = new FindAllPosts(inMemoryPostRepo)
    const originalPost = (await findAllPosts.execute(author.id))[0]
    expect(originalPost).toBeDefined()
    originalPost.title = "My New Title"
    originalPost.body = "My New Body"
    const updatePost = new UpdatePost(inMemoryPostRepo)
    const updatedPost = await updatePost.execute(originalPost.id, originalPost)
    expect(updatedPost.slug).toBe("my-new-title")
    expect(updatedPost.updatedAt!.getTime()).toBeGreaterThan(
      updatedPost.createdAt.getTime()
    )
  })

  it("Should be able to delete a post", async () => {
    const findAllPosts = new FindAllPosts(inMemoryPostRepo)
    const deletePost = new DeletePost(inMemoryPostRepo)

    const originalPost = (await findAllPosts.execute(author.id))[0]
    expect(originalPost).toBeDefined()
    await deletePost.execute(originalPost.id)
    const posts = await findAllPosts.execute(author.id)
    expect(posts.length).toBe(0)
  })
})
