// interface for button props
interface ButtonProps {
    label: String;
    onClick: () => void;
    icon?: React.ReactNode;
    solid: boolean;
}

export const Button: React.FC<ButtonProps> = ({label, onClick, icon, solid}) => {
  return (
    <div>
        <button onClick={onClick} 
          className={
            solid 
               ? "flex w-full items-center h-9 px-2 py-1 font-mono bg-black text-white rounded-md text-center text-md my-2" 
               : "flex w-full items-center h-9 py-1 px-4 font-mono text-black border border-black rounded-md text-md my-2"} > 
            {label} 
              {icon ? <div className="pl-1"> {icon} </div> : null}
        </button>
    </div>
  )
}
