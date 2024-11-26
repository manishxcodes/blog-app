interface BlogCardProps {
    authorName: String;
    title: string;
    content: string;
    createdAt: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({authorName, title, content, createdAt}) => {
    return (
        <div className=" h-full w-full font-mono py-4 px-2 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] rounded-md">
            <div className="flex items-center ">
                <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 mr-2">
                    <span className="font-medium text-gray-600 dark:text-gray-300">{authorName[0]}</span>
                </div>
                <div className=" mr-2"> {authorName} </div>
                <div className="w-1 h-1 bg-slate-600 rounded-full mr-2"> </div>
                <div className="text-sm"> {createdAt} </div>
            </div>    
            <div className="px-2">
                <div className="mt-1 text-lg font-bold">
                    {title}
                </div>
                <div className="">
                    {content.slice(0, 100) + "..."}
                </div>
                <div className="mt-4 text-sm">
                    <span className="px-2 py-1 bg-slate-200 rounded-md">
                        {`${Math.ceil((content.split(" ").length)/150)} minutes read`}
                    </span>
                </div>
            </div>        
            
        </div>
    )
}