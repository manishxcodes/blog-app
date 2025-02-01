import { useEffect } from "react";
import { BlogCard } from "../components/BlogCard"
import { ErrorMessage } from "../components/ErrorMessage";
import { Loader } from "../components/Loader";
import { Navbar } from "../components/Navbar"
import { useBlogs } from "../hooks/useBlogs"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { domain } from "../utils";
import { toast } from "react-toastify";

export const Main = () => {
  const { blogs, loading, error, fetchBlogs } = useBlogs();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if(blogs.length == 0) {
      fetchBlogs()
    }
  }, [ blogs.length, fetchBlogs])
  
 
  if(loading) {
    return (
      <div>
        <Navbar />
        <Loader />
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

  const handleReadMore = (id: string) => {
    navigate(`/blog/${id}`);
  }

  const addBookmark = async (id: string) => {
    console.log(token)
    try {
      const resposne = await axios.post(`${domain}/api/v1/user/bookmarks/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log("response", resposne)
      if(resposne.status == 409) {
        toast.error("already Bookmark");
      }

      if(resposne.status == 200) {
        toast.success("Added to Bookmark");
        console.log("bookmark added");
      }
    } catch(err) {
      if(axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "An Error occured. try again");
    } else {
        toast.error("An unexpected Error occured");
    }
    } 
  }

  const removeBookmark = async (id: string) => {
    try {
      const resposne = await axios.put(`${domain}/api/v1/user/bookmarks/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if(resposne.status == 200) {
        toast.success("Bookmarked removed");
      }

      if(resposne.status == 400) {
        toast.error("Post is not bookmarked. cannot remove")
      }

    } catch(err) {
      if(axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "An Error occured. try again");
    } else {
        toast.error("An unexpected Error occured");
    }
    } 
  }
  
  return (
    <div>
        <Navbar />
        <section className="flex justify-center items-center">
          <div className=" h-screen max-w-6xlflex justify-center px-6 ">
            <div className="grid grid-cols-1 gap-y-3">
              { 
                blogs.map((blog) => (
                  <BlogCard key={blog.id} 
                    id={blog.id}
                    authorName={blog.authorName}
                    title={blog.title}
                    content={blog.content}
                    published={blog.published} 
                    createdAt={new Date(blog.createdAt).toLocaleDateString()} 
                    isAlreadyBookmark={blog.isBookmarked}
                    onReadMoreClick={() => handleReadMore(blog.id)}
                    onCardClick={() => {handleReadMore(blog.id)}}
                    onBookmarkClick={() => (blog.isBookmarked) ?  removeBookmark(blog.id) : addBookmark(blog.id)}
                    removeBookmark = {() => {removeBookmark(blog.id)}} 
                    addBookmark = {() => {addBookmark(blog.id)}} />
                ))
              }
          </div>
          </div>
        </section>
    </div>
  )
}