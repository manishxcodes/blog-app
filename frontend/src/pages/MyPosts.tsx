import { MyPostCard } from "../components/MyPostCard";
import { ErrorMessage } from "../components/ErrorMessage";
import { Loader } from "../components/Loader";
import { Navbar } from "../components/Navbar";
import { useMyBlogs } from "../hooks/useMyBlogs"
import axios from "axios";
import { domain } from "../utils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const MyPosts = () => {
  const { loading, error, blogs, fetchBlogs} = useMyBlogs();
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

  const deletePost = async (id: string) => {
    console.log("dlelete button clicked", id);
    try {
      const response = await axios.delete(`${domain}/api/v1/blog/${id}`,  {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      console.log(response);

      if(response.status == 404) {
        toast.error("Blog doesnot exist");
      }

      if(response.status == 200) {
        toast.success("post deleted succesfully");
        fetchBlogs();

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
      <div className="w-full flex justify-center items-center">
        <div className="max-w-6xl w-full h-screen px-6">
          <div className="grid grid-cols-1 gap-y-3">
            {
              blogs.map((blog) => (
                <MyPostCard key={blog.id}
                  authorName={blog.author.name}
                  title={blog.title}
                  content={blog.content}
                  createdAt={new Date(blog.createdAt).toLocaleDateString()}
                  onClick = {
                    () => deletePost(blog.id)} 
                  onCardClick={() => handleReadMore(blog.id)}
                  onClickReadMore={() => handleReadMore(blog.id)} />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
