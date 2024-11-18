// interface for button props
interface ButtonProps {
    label: String;
    onClick: () => void;
    icon?: React.ReactNode;
    solid: boolean;
}

export const Button: React.FC<ButtonProps> = ({label, onClick, icon, solid}) => {
  return (
    <div className="w-max text-center">
        <button onClick={onClick} 
          className={
            solid 
               ? "flex w-full items-center h-10 px-4 py-2 font-mono bg-black text-white rounded-md text-center text-md my-2 hover:shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] transition duration-100" 
               : "flex w-full items-center h-10 py-1 px-4 font-mono text-black border border-black rounded-md text-md my-2 shadow hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] transition duration-100"} > 
            {label} 
              {icon ? <div className="pl-1"> {icon} </div> : null}
        </button>
    </div>
  )
}
