import { ErrorMessage } from "../components/ErrorMessage";
import { Loader } from "../components/Loader";
import { Navbar } from "../components/Navbar";
import { useBookmarks } from "../hooks/useBookmarks";
import { BlogCard } from "../components/BlogCard";
import  axios from "axios";
import { domain } from "../utils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export const Bookmarks = () => {
  const { blogs, loading, error, fetchBlogs } = useBookmarks();
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

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

  if(blogs.length == 0) {
    return (
      <div className="w-full h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 justify-center items-center">
          <div className="text-xl font-bold font-mono">You don't have any bookmarks</div>
        </div>
      </div>
    )
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
        toast.success("removed successfully!");
        fetchBlogs();

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

  const handleReadMore = (id: string) => {
    navigate(`/blog/${id}`);
  }

  return (
    <div>
      <Navbar />
      <section className="flex justify-center items-center">
          <div className=" max-w-6xl flex justify-between px-6">
            <div className="grid grid-cols-1  gap-y-3">
              { 
                blogs.map((blog) => (
                  <BlogCard key={blog.id} 
                    id={blog.id}
                    authorName={blog.author.name}
                    title={blog.title}
                    content={blog.content}
                    createdAt={new Date(blog.createdAt).toLocaleDateString()} 
                    isAlreadyBookmark= {true}
                    onBookmarkClick=  {() =>  removeBookmark(blog.id)}
                    onCardClick={() => handleReadMore(blog.id)}
                    removeBookmark={() => removeBookmark(blog.id)}
                     />
                ))
              }
          </div>
          </div>
        </section>
    </div>
  )
}
