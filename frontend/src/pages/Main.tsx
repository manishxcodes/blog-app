import { BlogCard } from "../components/BlogCard"
import { Navbar } from "../components/Navbar"
import { useBlogs } from "../hooks/useBlogs"

export const Main = () => {
  const { blogs, loading, error } = useBlogs();

  if(loading) {
    return (
      <div className="h-screen flex justify-center items-center">
          <h3 className="font-mono font-bold text-xl">Loading</h3>
      </div>
    )
  }

  if(error) {
    return (
      <div className="h-screen flex justify-center items-center">
          <h3 className="font-mono font-bold text-xl">Error: {error}</h3>
      </div>
    )
  }
  console.log("blogs:", blogs)
  
  return (
    <div>
        <Navbar />
        <section className="flex justify-center items-center">
          <div className=" h-screen max-w-7xl w-full px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-2">
              { 
                blogs.map((blog) => (
                  <BlogCard key={blog.id} 
                    authorName={blog.authorName}
                    title={blog.title}
                    content={blog.content}
                    published={blog.published} 
                    createdAt={new Date(blog.createdAt).toLocaleDateString()} />
                ))
              }
          </div>
          </div>
        </section>
        
    </div>
  )
}