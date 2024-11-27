import { BrowserRouter, Route,  Routes } from 'react-router-dom'
import { Home } from "./pages/Home"
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Main } from './pages/Main'
import { Bookmarks } from './pages/Bookmarks'
import { MyPosts } from './pages/MyPosts'


function App() {
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/signin' element={<Signin />} />
            <Route path='/blogs' element={<Main />} />
            <Route path='/bookmarks' element={<Bookmarks />} />
            <Route path='/myposts' element={<MyPosts />} />
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
