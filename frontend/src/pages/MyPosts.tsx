import { BlogCard } from "../components/BlogCard";
import { ErrorMessage } from "../components/ErrorMessage";
import { Loader } from "../components/Loader";
import { Navbar } from "../components/Navbar";
import { useMyBlogs } from "../hooks/useMyBlogs"

export const MyPosts = () => {
  const { loading, error, blogs} = useMyBlogs();

  if(loading) {
    return (
      <div>
        <Navbar />
        <Loader />
      </div>
    )
  }

  if(blogs.length == 0) {
    return (
      <div className="w-full h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 justify-center items-center">
          <div className="text-xl font-bold font-mono">You don't have any posts.</div>
        </div>
      </div>
    )
  }

  if(error) {
    return (
      <div>
        <Navbar />
        <ErrorMessage error={error} />
      </div>
      
    )
  }

  return (
    <div>
      <Navbar />
      <div className="w-full flex justify-center items-center">
        <div className="max-w-6xl w-full h-screen px-6">
          <div className="grid grid-cols-1 gap-y-3">
            {
              blogs.map((blog) => (
                <BlogCard key={blog.id}
                  authorName={blog.author.name}
                  title={blog.title}
                  content={blog.content}
                  createdAt={new Date(blog.createdAt).toLocaleDateString()} />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
