// interface for button props
interface ActionButtonProps {
    label: String;
    onClick?: () => void;
    icon?: React.ReactNode;
    color: string;
    textColor?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({label, onClick, icon, color, textColor}) => {
  return (
    <span className={`flex items-center px-2 py-1 ${color} ${textColor}  rounded-xl`} onClick={onClick}>
        <span>
            {label}
        </span>
        <span>
            {icon}
        </span>
    </span>
  )
}

