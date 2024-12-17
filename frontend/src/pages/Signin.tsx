import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import { BottomText } from "../components/BottomText"
import { useState } from "react"
import { Button } from "../components/Button"
import { SigninSchema } from "@manishxcode/blogapp-common"
import axios from "axios"
import { domain } from "../utils"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AppDispatch, authActions } from "../store/store"
import { toast } from "react-toastify"

export const Signin = () => {
  const [postInputs, setPostInputs] = useState<SigninSchema>({
    email: "",
    password: "",
  })

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPostInputs((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  // handle signin
  const handleSignin = async () => {
    setLoading(true);

    try {
      const response = await axios.post(`${domain}/api/v1/user/signin`, postInputs);
      const data = response.data;
      if(data.token) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", postInputs.email);
        dispatch(authActions.login(data.token));
        navigate('/blogs');
      }
      
    } catch(err: any) {
      // catch backend errors
      if(err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)  // it will display the error message from backend
        toast(error)
      } else {
        setError("Something went wrong. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-200 h-screen w-full flex items-center justify-center">
      <div className="flex flex-col justify-center">
        <div className="bg-white px-8 py-4 w-80 h-max rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            <Heading label={'Sign In'} />
            <SubHeading label={'Enter your credentials'} />
            <InputBox label={"Email"} placeholder={"john@12gmail.com"} name="email" value={postInputs.email} onChange={handleChange} />
            <InputBox label={"Password"} autoComplete={"new-password"} placeholder={"12345"} name="password" value={postInputs.password} onChange={handleChange} />
            <BottomText label={"Don't have an account? "} buttonText={'Sign Up'} to={'/signup'} />
            <div className='flex flex-col items-center'>
              <Button label={loading ? 'Signing In...' : 'Sign In'} onClick={handleSignin} solid={true}/>
          </div>
        </div>
      </div>
    </div>
  )
}
