import { Avatar } from "./Avatar";
import { Button } from "./Button";

interface BlogCardProps {
    authorName: String;
    title: string;
    content: string;
    createdAt: string;
    published?: string;
   // onclick?: 
}

export const BlogCard: React.FC<BlogCardProps> = ({authorName, title, content, createdAt, published}) => {
    const handleView = () => {
        console.log('ehlo')
    }

    return (
        <div className=" h-full w-full font-mono py-4 px-2 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] rounded-md
        hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="flex items-center ">
                <div> <Avatar name={authorName}/></div>
                <div className=" mr-2"> {authorName} </div>
                <div className="w-1 h-1 bg-slate-600 rounded-full mr-2"> </div>
                <div className="text-sm"> {createdAt} </div>
            </div>    
            <div className="px-2">
                <div className="mt-2 text-lg font-bold">
                    {title}
                </div>
                <div className="text-slate-600 py-2">
                    {content.slice(0, 100) + "..."}
                </div>
                <div className="mt-4 md:px-8 text-sm flex justify-end">
                    <span className=" mr-2 px-2 py-1 cursor-pointer bg-slate-200 rounded-xl">
                        {`${Math.ceil((content.split(" ").length)/150)} minutes read`}
                    </span>
                    <span className="px-3 py-1 cursor-pointer bg-black text-white rounded-xl">
                        View
                    </span>
                    
                </div>
            </div>        
            
        </div>
    )
}