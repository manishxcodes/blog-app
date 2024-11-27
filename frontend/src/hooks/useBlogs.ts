import { useEffect, useState } from "react";
import axios from "axios";
import { domain } from "../utils";

interface Blog {
    id: string
    title: string
    content: string
    published: string
    authorName: string
    createdAt: string
}

export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [error, setError] = useState("");

    
    // get the user token 
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${domain}/api/v1/blog/bulk`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                setBlogs(response.data.formattedPosts);
            } catch(err) {
                if(axios.isAxiosError(err)) {
                    setError(err.response?.data?.message || "An Error occured while fetching Blogs")
                } else {
                    setError("An unexpected Error occured")
                }
            } finally {
                setLoading(false)
            }
        };

        fetchBlogs();
    }, [])

    return { blogs, loading, error };
}