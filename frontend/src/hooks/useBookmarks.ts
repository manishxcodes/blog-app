import axios from "axios";
import { useEffect, useState } from "react"
import { domain } from "../utils";

interface Blog {
  id: string
  title: string
  content: string
  author: {name: string}
  createdAt: string 
}

export const useBookmarks = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${domain}/api/v1/user/bookmarks`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if(response.status == 204) {
          setBlogs([]);  // set blogs as empty array as there is no bookmarks
        } else {
          setBlogs(response.data.bookmarks);
        }
        
      } catch(err) {
        if(axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "An Error occupied while fetching Blogs");
        } else {
          setError("An unexpected Error occured");
        }
      } finally {
        setLoading(false)
      }
    };

    fetchBlogs();
  }, [])

  return { blogs, loading, error }
}
