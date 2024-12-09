import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { domain } from "../utils";

interface BlogProps {
    id: string
    title: string
    content: string
    published: string
    authorName: string
    createdAt: string
    isBookmarked: boolean
}

export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<BlogProps[]>([]);
    const [error, setError] = useState("");

    // get the user token 
    const token = sessionStorage.getItem("token");

    const fetchBlogs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${domain}/api/v1/blog/bulk`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            setBlogs(response.data.formattedPosts || []);
        } catch(err) {
            if(axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "An Error occured while fetching Blogs")
            } else {
                setError("An unexpected Error occured")
            }
        } finally {
            setLoading(false)
        }
    }, [token]);

    useEffect(() => {
        if(blogs.length == 0) {
            fetchBlogs();
        }
    }, [blogs, fetchBlogs])

    return { blogs, loading, error, fetchBlogs };
}