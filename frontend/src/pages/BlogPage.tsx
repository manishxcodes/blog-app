import { useParams } from "react-router-dom"
import { useBlog } from "../hooks/useBlog";
import { ErrorMessage } from "../components/ErrorMessage";
import { Loader } from "../components/Loader";
import { Navbar } from "../components/Navbar";

export const BlogPage = () => {

  const {id} = useParams();

  const { blog, loading, error } = useBlog(id as string);
  console.log("blog:", blog)
  if(error) {
    <ErrorMessage error={"Something went wrong. Please go back"}  />
  }

  if(loading) {
    <Loader />
  }

  if(blog.title == "") {
    <ErrorMessage error={"No blogs found. Please go back"}  />
  }

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center font-mono">
          <div className="max-w-3xl h-screen w-full p-4">
          <h1 className="font-bold text-2xl md:text-3xl py-2 mb-4">{blog.title}</h1>
          <div className="flex flex-row items-center justify-start mb-2 text-slate-500">
            <div>{blog.author.name ? `${blog.author.name} | ` : "" }</div>
            
            <div> {blog.createdAt && new Date(blog.createdAt).toLocaleDateString()}</div>
          </div>
          <p className=" mdtext-lg font-mono  text-justify leading-7">{blog.content}</p>
        </div>
      </div>
    </div>
  )
}
