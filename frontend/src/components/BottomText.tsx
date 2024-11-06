import { Link } from "react-router-dom";

interface BottomTextProps  {
    label: string;
    buttonText: string;
    to: string
}

export const BottomText: React.FC<BottomTextProps> = ({ label, buttonText, to }) => {
    return (
      <div className="flex justify-center items-center text-sm">
        <div className="font-mono text-slate-600">
          {label}
        </div>
        <div className="font-mono font-semibold underline text-blue-500 ml-1">
          <Link to={to}>
            {buttonText}
          </Link>
        </div>
      </div>
    );
  };
