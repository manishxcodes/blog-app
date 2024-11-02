import { useState } from "react"
import { crossIcon, githubLogo, hamburgerMenu } from "../assets/assets"
import { Button } from "./Button"

// const Navbar = () => {
//     const navigateToSignin = () => {
//         //navigate to signup
//     }

//   return (
//     <nav>
//         <div className="flex justify-center items-center">
//             <div className="w-full h-20 flex items-center justify-between p-4">
//                 <div>
//                     <div className="ml-4 md:ml-16 xl:ml-22">
//                         <h1 className="font-mono font-bold text-3xl">
//                             BlogNest
//                         </h1>
//                     </div>
//                 </div>
    
//                 <div className="flex mr-4 md:mr-16 xl:mr-24">
//                     <div className="mr-2">
//                         <Button label={"Login"} onClick={navigateToSignin} solid={true} />
//                     </div>
//                     <div>
//                         <Button label={"Find me on"} onClick={navigateToSignin} icon={githubLogo} solid={false} />
//                     </div>
//                 </div>
//             </div>
//         </div>

//         <div className="flex justify-center items-center ">
//             <div className=" bg-black w-10/12 h-1"></div>
//         </div>
      
//     </nav>
    
//   )
// }

export const Navbar = () => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClickState = () => {
        setIsClicked(!isClicked)
    }

    const navigateToSignin = () => {
        //navigate to signup
    }

    return (
        <nav>
            <div className="flex justify-center items-center mb-4">
                <div className="max-w-7xl w-full h-20 flex items-center justify-between px-6 ">
                    <div>
                        <div>
                            <h1 className="font-mono font-bold text-3xl">
                                BlogNest
                            </h1>
                        </div>
                    </div>

                    {/* shows button when screen width is more than 768px i.e medium  */}
                    <div className="hidden md:flex">
                        <div className="mr-2">
                            <Button label={"Login"} onClick={navigateToSignin} solid={true} />
                        </div>
                        <div>
                            <Button label={"Find me on"} onClick={navigateToSignin} icon={githubLogo} solid={false} />
                        </div>
                    </div>

                    {/* show hamburger menu for screen size less than 768p */}
                    <div className="md:hidden">
                        <div>
                            <span onClick={handleClickState} className="text-2xl rounded hover:cursor-pointer ">
                                {isClicked ? crossIcon : hamburgerMenu}
                            </span> 
                        </div>
                    </div>

                    {/* sidebar */}
                    {
                        isClicked && (
                            <div className="fixed top-0 right-0 w-52 h-full bg-slate-50 rounded-md font-mono transform transition-transform duration-300 ease-in-out md:hidden">
                                <div onClick={handleClickState} className="py-6 px-5 flex justify-end">
                                    {crossIcon}
                                </div>
                                <ul className="flex flex-col items-center justify-center ">
                                    <li className="px-6 py-2 text-black hover:underline cursor-pointer">Login</li>
                                    <li className="flex px-6 py-2 text-black hover:underline cursor-pointer">Find me on&nbsp;{githubLogo}</li>
                                </ul>
                            </div>
                        )
                    }
                </div>
            </div>
        </nav>
    )
}
