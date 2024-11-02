import { Button } from "../components/Button"
import { Navbar } from "../components/Navbar"
import { useNavigate } from 'react-router-dom'

export const Home = () => {
  const navigate = useNavigate();

  const navigateToSignup = () => {
    navigate('/signup');
  }

  return (
      <>
          <Navbar />
          
          <div className="w-full h-[30rem] flex flex-col justify-center items-center">
              <div className="max-w-7xl flex justify-center items-center w-full px-6">
                  <h1 className="font-mono text-xl text-justify">
                      <span className="font-bold">BlogNest</span> is a welcoming platform for writers to share thoughts and stories in a supportive space. Designed for simplicity, it allows users to craft and customize posts easily, fostering creativity and connection. Whether you're a seasoned blogger or just starting, BlogNest is the perfect place to build your online presence and connect with a like-minded community.
                  </h1>
              </div>
              <div className="my-6">
                <Button label={"Get Started"} onClick={navigateToSignup} solid={true} />
              </div>
          </div>
      </>
  )
}