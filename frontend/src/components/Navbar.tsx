import { githubLogo } from "../assets/assets"
import { Button } from "./Button"

const Navbar = () => {
    const navigateToSignin = () => {
        //navigate to signup
    }

  return (
    <nav>
        <div className="flex justify-center items-center">
            <div className="w-full h-20 flex items-center justify-between p-4">
                <div>
                    <div className="ml-4 md:ml-16 xl:ml-22">
                        <h1 className="font-mono font-bold text-3xl">
                            BlogNest
                        </h1>
                    </div>
                </div>
    
                <div className="flex mr-4 md:mr-16 xl:mr-24">
                    <div className="mr-2">
                        <Button label={"Login"} onClick={navigateToSignin} solid={true} />
                    </div>
                    <div>
                        <Button label={"Find me on"} onClick={navigateToSignin} icon={githubLogo} solid={false} />
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-center items-center ">
            <div className=" bg-black w-10/12 h-1"></div>
        </div>
      
    </nav>
    
  )
}

export default Navbar