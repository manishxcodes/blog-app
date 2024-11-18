interface InputBoxProps {
    placeholder: string;
    label: string;
    name: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const InputBox: React.FC<InputBoxProps> = ({ placeholder, label, name, value, onChange }) => {
  return (
    <div className="pb-4">
        <div className="font-mono font-semibold text-left text-md pb-1">
            {label}
        </div>
        <div>
            <input type="text" placeholder={placeholder} name={name} value={value} onChange={onChange} 
            className="text-sm font-mono text-slate-400 border border-slate-300 rounded-md w-full px-2 py-1"
            />
        </div>
    </div>
  )
}

