import Navbar from "../components/Navbar"

export const Home = () => {
  return (
    <>
        <Navbar />

        <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-10/12">
          <h1 className="font-mono">
            <span className="font-bold">BlogNest</span> is a welcoming platform for writers to share thoughts and stories in a supportive space. Designed for simplicity, it allows users to craft and customize posts easily, fostering creativity and connection. Whether you’re a seasoned blogger or just starting, BlogNest is the perfect place to build your online presence and connect with a like-minded community.
          </h1>
        </div>
    </div>
    </>
    
  )
}
