import { useState } from "react"
import { crossIcon, githubLogo, hamburgerMenu } from "../assets/assets"
import { Button } from "./Button"
import { Link, useNavigate } from "react-router-dom"
import { navigateToBookmarks, navigateToMainPage, navigateToMyPosts, navigateToSignin } from "../helper/navigateUtils"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { authActions, RootState } from "../store/store"


export const Navbar = () => {
    const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);
    const dispatch = useDispatch();

    const [isClicked, setIsClicked] = useState(false);
    const navigate = useNavigate();

    const handleClickState = () => {
        setIsClicked(!isClicked)
    }

    const hanldeLogout = () => {
        sessionStorage.removeItem("token");
        dispatch(authActions.logout());
        navigate('/');
    }

    return (
        <nav className="sticky top-0 z-50 bg-white">
            <div className="flex justify-center items-center mb-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)] border rounded-md">
                <div className="max-w-7xl w-full h-16 flex items-center justify-between px-6 ">
                    <div>
                        <h1 className="font-mono font-bold text-3xl">
                            BlogNest 
                        </h1>                
                    </div>

                    { isLoggedIn &&                    
                        <div className="hidden md:flex md:w-96">
                            <ul className="flex flex-row w-full items-center justify-evenly font-mono text-lg ">
                                <li className="hover:text-slate-700 cursor-pointer">
                                    <Link to="/blogs">Home</Link>
                                </li>
                                <li className="hover:text-slate-700 cursor-pointer">
                                    <Link to="/myposts">My Posts</Link>
                                </li>
                                <li className="hover:text-slate-700 cursor-pointer">
                                    <Link to="/bookmarks">Bookmarks</Link>
                                </li>
                            </ul>
                        </div>
                    }


                    {/* shows button when screen width is more than 768px i.e medium  */}
                    <div className="hidden md:flex">
                        <div>
                            <Button label={"Publish"} onClick={() => navigate('/publish')} solid={false} />
                        </div>
                        <div className="ml-2">
                            { isLoggedIn 
                            ? <Button label={"Logout"} onClick={hanldeLogout} solid={true} />
                            : <Button label={"Login"} onClick={() => navigateToSignin(navigate)} solid={true} />
                            } 
                        </div>
                    </div>

                    {/* show hamburger menu for screen size less than 768p */}
                    <div className="md:hidden">
                        <div onClick={handleClickState} className="text-2xl rounded hover:cursor-pointer ">
                            <div>
                                { isClicked ? null : hamburgerMenu}
                            </div>
                        </div> 
                    </div>

                    {/* sidebar */}
                    {
                        isClicked && (
                            <div className="fixed top-0 right-0 w-64 h-full bg-slate-50 rounded-md font-mono shadow-[0_3px_10px_rgb(0,0,0,0.2)] transform  transition-transform duration-300 ease-in-out md:hidden">
                                <div onClick={handleClickState} className="py-6 px-5 flex justify-end">
                                    {crossIcon}
                                </div>
                                <div className="flex flex-col items-center justify-center ">
                                    {isLoggedIn && 
                                        <ul className="flex flex-col items-center justify-center">
                                            <li onClick={handleClickState} className="px-6 py-2 text-black hover:underline cursor-pointer">
                                                <Link to="/blogs">Home</Link>
                                            </li>
                                            <li onClick={handleClickState} className="px-6 py-2 text-black hover:underline cursor-pointer">
                                                <Link to="/myposts">My Posts</Link>
                                            </li>
                                            <li onClick={handleClickState} className="px-6 py-2 text-black hover:underline cursor-pointer">
                                                <Link to="/bookmarks">Bookmarks</Link>
                                            </li>
                                        </ul>
                                    }
                                    <ul className="flex flex-col items-center justify-center">
                                    {
                                        isLoggedIn 
                                        ? <li onClick={hanldeLogout} className="px-6 py-2 text-black hover:underline cursor-pointer">Logout</li>
                                        : <li onClick={() => navigateToSignin(navigate)} className="px-6 py-2 text-black hover:underline cursor-pointer">Login</li>
                                    }
                                        <li className="flex px-6 py-2 text-black hover:underline cursor-pointer" onClick={() => {navigate('/publish')}}>Publish</li>
                                    </ul>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </nav>
    )
}
