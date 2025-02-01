import { useState } from "react";
import {  deleteLogo } from "../assets/assets";
import { ActionButton } from "./ActionButton";
import { Avatar } from "./Avatar";

interface MyPostCardProps {
    authorName: String;
    title: string;
    content: string;
    createdAt: string;
    published?: string;
    isAlreadyBookmark?: boolean;
    onClick?: () => void;
    onCardClick?: () => void;
    onClickReadMore?: () => void
}

export const MyPostCard: React.FC<MyPostCardProps> = ({authorName, title, content, createdAt, onClick, onCardClick, onClickReadMore}) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async(e: React.MouseEvent) => {
        e.stopPropagation();
        if(loading) return;

        setLoading(true);
        await onClick?.();
        setLoading(false)
    }

    return (
        <div className=" h-full max-w-3xl font-mono py-4 px-2 md:px-8 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] cursor-pointer rounded-md
        hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="flex items-center " onClick={onCardClick}>
                <div> <Avatar name={authorName}/></div>
                <div className=" mr-2"> {authorName} </div>
                <div className="w-1 h-1 bg-slate-600 rounded-full mr-2"> </div>
                <div className="text-sm"> {createdAt} </div>
            </div>    
            <div className="px-2">
                <div className="flex items-center justify-between" onClick={onCardClick}>
                    <div className="mt-2 text-sm font-bold pr-6">
                        {title}
                    </div>
                    <div className="flex items-center">
                        <ActionButton label={"Read"} textColor={"text-white"} color={"bg-black"} onClick={onClickReadMore}/>
                        <span className={`ml-3 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:rounded-full hover:bg-slate-100  hover:backdrop-blur-xl ${loading ? "animate-pulse" : ""}`}
                        onClick={handleDelete}>
                            { deleteLogo }
                        </span>
                    </div>
                </div>
                <div className="mt-4 text-sm flex justify-between">
                    <ActionButton label={`${Math.ceil((content.split(" ").length)/150)} minutes read`} color={"bg-slate-200"} />
                    <div className="flex items-center">
                        
                        
                    </div>
                </div>
            </div>        
            
        </div>
    )
}