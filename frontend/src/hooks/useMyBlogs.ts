import axios from "axios"
import { useEffect, useState } from "react"
import { domain } from "../utils"

interface MyBlogsProps {
    id: string
    title: string
    content: string
    published: string
    author: {name: string}
    createdAt: string
}

export const useMyBlogs  = () => {
    const [blogs, setBlogs] = useState<MyBlogsProps[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${domain}/api/v1/user/myposts`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if(response.status == 204) {
                    setBlogs([]);
                } else {
                    setBlogs(response.data.Posts)
                }

            } catch(err) {
                if(axios.isAxiosError(err)) {
                    setError(err.response?.data?.message || "An error occured while fetching Blogs");
                } else {
                    setError("An unexpected Error occured");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [])

    return { blogs, error, loading};
}