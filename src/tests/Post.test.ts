import { expect, describe, it, test, beforeAll, afterAll } from "vitest"
import { CreatePostDTO } from "../dtos/CreatePostDTO"
import { Category } from "../entities/Category"
import { InMemoryPostRespository } from "../repositories/implentations/InMemory/InMemoryPostRepository"
import { InMemoryAuthorRepository } from "../repositories/implentations/InMemory/inMemoryAuthorRepository"
import { InMemoryCategoryRespository } from "../repositories/implentations/InMemory/InMemoryCategoryRepository"
import { FindAllPosts } from "../use-cases/Post/FindAllPosts/FindAllPosts"
import { FindPostBySlug } from "../use-cases/Post/FindPostBySlug/FindPostBySlug"
import { CreatePost } from "../use-cases/Post/CreatePost/CreatePost"
import { UpdatePost } from "../use-cases/Post/UpdatePost/UpdatePost"
import { DeletePost } from "../use-cases/Post/DeletePost/DeletePost"
import { Author } from "../entities/Author"
import { PgPostRespository } from "../repositories/implentations/postgres/PgPostRepository"
import { PgAuthorRepository } from "../repositories/implentations/postgres/PgAuthorRepository"
import { PgCategoryRespository } from "../repositories/implentations/postgres/PgCategoryRepository"
import { IPostRepository } from "../repositories/IPostRepository"
import { IAuthorRepository } from "../repositories/IAuthorRepository"
import { ICategoryRepository } from "../repositories/ICategoryRepository"

let postRepository: IPostRepository
let authorRepository: IAuthorRepository
let categoryRepository: ICategoryRepository

let author: Author
let categories: Category[] = []
let newPostData: CreatePostDTO

beforeAll(async () => {
  postRepository = new PgPostRespository()
  authorRepository = new PgAuthorRepository()
  categoryRepository = new PgCategoryRespository()

  author = await authorRepository.create({
    name: "Felipe",
    email: "felipeandresb97@gmail.com",
    passwordHash: "secret",
    admin: true,
  })

  categories.push(await categoryRepository.create(new Category("Node")))
  categories.push(await categoryRepository.create(new Category("TypeScript")))

  newPostData = {
    author,
    title: "My First Post",
    body: "Hello World!",
    excerpt: "",
    categories,
    ogImageUrl: "http://example.com",
    note: false,
  }
})

afterAll(async () => {
  await authorRepository.delete(author.id)
  for (const cat of categories) {
    await categoryRepository.delete(cat.id)
  }
})

describe("Post CRUD", async () => {
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
        postRepository,
        categoryRepository,
        authorRepository
      )
      expect(createPost.execute(postDataWrongAuthor)).rejects.toThrow(/author/)
    })

    test("Has non-existing category in the repo", async () => {
      const postDataWrongCategory = JSON.parse(JSON.stringify(newPostData))
      postDataWrongCategory.categories.push(new Category("Not in the repo"))
      const createPost = new CreatePost(
        postRepository,
        categoryRepository,
        authorRepository
      )
      expect(createPost.execute(postDataWrongCategory)).rejects.toThrow(
        /category/
      )
    })
  })

  it("Should be able to create a Post", async () => {
    const createPost = new CreatePost(
      postRepository,
      categoryRepository,
      authorRepository
    )
    const createdPost = await createPost.execute(newPostData)
    expect(createdPost.id).toBeTypeOf("string")
    expect(createdPost.slug).toBe("my-first-post")
    expect(createdPost.createdAt).toBeInstanceOf(Date)
    expect(createdPost.updatedAt).toBeNull()
  })

  it("Should be found within the repository", async () => {
    const findAllPosts = new FindAllPosts(postRepository)
    const posts = await findAllPosts.execute(author.id)
    expect(posts.length).toBe(1)
    expect(posts[0].title).toBe("My First Post")
  })

  it("Should be found by slug", async () => {
    const findPostBySlug = new FindPostBySlug(postRepository)
    const searchedPost = await findPostBySlug.execute("my-first-post")
    expect(searchedPost).not.toBeNull()
  })

  it("Should be able to update post", async () => {
    const findAllPosts = new FindAllPosts(postRepository)
    const originalPost = (await findAllPosts.execute(author.id))[0]
    expect(originalPost).toBeDefined()
    originalPost.title = "My New Title"
    originalPost.body = "My New Body"
    const updatePost = new UpdatePost(postRepository)
    const updatedPost = await updatePost.execute(originalPost.id, originalPost)
    expect(updatedPost.slug).toBe("my-new-title")
    expect(updatedPost.updatedAt!.getTime()).toBeGreaterThan(
      updatedPost.createdAt.getTime()
    )
  })

  it("Should be able to delete a post", async () => {
    const findAllPosts = new FindAllPosts(postRepository)
    const deletePost = new DeletePost(postRepository)

    const originalPost = (await findAllPosts.execute(author.id))[0]
    expect(originalPost).toBeDefined()
    await deletePost.execute(originalPost.id)
    const posts = await findAllPosts.execute(author.id)
    expect(posts.length).toBe(0)
  })
})
