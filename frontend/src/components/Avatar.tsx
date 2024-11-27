export const Avatar = ({name}: {name: String}) => {
    return (
        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 mr-2">
                    <span className="font-medium text-gray-600 dark:text-gray-300">{name[0]}</span>
        </div>
    )
}