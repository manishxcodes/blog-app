import { useEffect } from "react";
import { BlogCard } from "../components/BlogCard"
import { ErrorMessage } from "../components/ErrorMessage";
import { Loader } from "../components/Loader";
import { Navbar } from "../components/Navbar"
import { useBlogs } from "../hooks/useBlogs"

export const Main = () => {
  const { blogs, loading, error, fetchBlogs } = useBlogs();


  useEffect(() => {
    if(blogs.length == 0) {
      fetchBlogs()
    }
  }, [ blogs.length, fetchBlogs])
  
 
  if(loading) {
    return (
      <Loader />
    )
  }

  if(error) {
    return (
      <ErrorMessage error={error} />
    )
  }
  
  return (
    <div>
        <Navbar />
        <section className="flex justify-center items-center">
          <div className=" h-screen max-w-6xl w-full px-6">
            <div className="grid grid-cols-1 gap-y-3">
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