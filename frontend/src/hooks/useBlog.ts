import { useEffect, useState } from "react"
import { domain } from "../utils";
import axios from "axios";

interface BlogProps {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: {name: string};
}

export const useBlog = (id: string) => {
    const [blog, setBlog] = useState<BlogProps>({title: "", content: "", id: "", createdAt: "", author: {name: ""}});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`${domain}/api/v1/blog/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if(response.status == 200) {
                    setBlog(response.data.post);
                }
            } catch(err) {
                if(axios.isAxiosError(err)) {
                    setError(err.response?.data?.message || "An error occured while fetching Blogs")
                } else {
                    setError("An unexpected Error occured")
                }
            } finally {
                setLoading(false)
            }
        }

        fetchBlog();
    }, [])

    return { loading, error, blog}
}