import React from "react";

interface HeadingProps {
    label: string;
  }
  
export const Heading: React.FC<HeadingProps> = ({label}) => {
    return (
        <div className="text-3xl text-center font-mono font-bold pt-4 pb-2">
            {label}
        </div>
    )
}