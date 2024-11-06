import React from "react";

interface DubHeadingProps {
    label: string;
  }
  
export const SubHeading: React.FC<DubHeadingProps> = ({label}) => {
    return (
        <div className="text-lg text-center font-mono text-slate-600 pt-4 pb-3">
            {label}
        </div>
    )
}