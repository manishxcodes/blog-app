export const ErrorMessage = ({error}: {error: string}) => {
  return (
    <div className="h-screen flex justify-center items-center">
        <h3 className="font-mono font-bold text-xl">Error: {error}</h3>
    </div>
  )
}
