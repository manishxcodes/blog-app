import { BrowserRouter, Route,  Routes } from 'react-router-dom'
import { Home } from "./pages/Home"
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Main } from './pages/Main'
import { Bookmarks } from './pages/Bookmarks'
import { MyPosts } from './pages/MyPosts'
import { BlogPage } from './pages/BlogPage'
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/signin' element={<Signin />} />
            <Route path='/blogs' element={<Main />} />
            <Route path='/blog/:id' element={<BlogPage />} />
            <Route path='/bookmarks' element={<Bookmarks />} />
            <Route path='/myposts' element={<MyPosts />} />
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
