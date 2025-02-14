import { ChangeEvent, useState } from "react"
import { Navbar } from "../components/Navbar"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { domain } from "../utils";
import { Button } from "../components/Button";

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(Boolean);
  const navigate = useNavigate();

  const handlePublish = async () => {
    if(!title.trim()) {
      alert("title cannot be empty");
      return ;
    }

    if(!description.trim()) {
      alert("Description cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", description);
      formData.append("published", "true");

      const response = await axios.post(`${domain}/api/v1/blog`, formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
          }
        }
      );
      setLoading(false);
      navigate(`/blog/${response.data.blog.id}`);
    } catch(err) {
      alert("Failed to publish blog");
      console.log("error while posting blog", err);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="flex justify-center ">
          <div className="max-w-3xl h-screen w-full p-4">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
              <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter you title" 
              onChange={(e) => {
                setTitle(e.target.value);
              }}/>
              <TextEditor onChange={(e) => {
                setDescription(e.target.value);
              }}/>
              <div className="flex justify-end">
                <Button label={loading ? `Publishing...` : 'Publish'} solid={true} onClick={handlePublish} />
              </div>
          </div> 
      </div>
    </div> 
  )
}

function TextEditor({ onChange }: {onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void}) {
  return <div className="mt-2">
      <div className="w-full mb-4 ">
          <div className="flex items-center justify-between border">
          <div className="my-2 bg-white rounded-b-lg w-full">
              <label className="sr-only">Publish post</label>
              <textarea onChange={onChange} id="editor" rows={8} className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0 pl-2" placeholder="Write an article..." required />
          </div>
      </div>
     </div>
  </div>
  
}