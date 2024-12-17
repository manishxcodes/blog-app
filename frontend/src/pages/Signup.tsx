import { useState} from 'react'
import { InputBox } from "../components/InputBox"
import { Heading } from '../components/Heading';
import { SubHeading } from '../components/SubHeading';
import { BottomText } from '../components/BottomText';
import { Button } from '../components/Button';
import axios from 'axios';
import { domain } from '../utils';
import { SignupSchema } from '@manishxcode/blogapp-common';
import { navigateToSignin } from '../helper/navigateUtils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const Signup = () => {
  const navigate = useNavigate();

  const [postInputs, setPostInputs] = useState<SignupSchema>({
    name: "",
    email: "",
    username: "",
    password: ""
  })

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value} = e.target;

    setPostInputs((prev) =>({
      ...prev,
      [name]: value
    }));
  }
  
  // handle signup
  const handleSignup = async () => {
    setLoading(true);

    try{
      const response = await axios.post(`${domain}/api/v1/user/signup`, postInputs);
      const data = response.data;
      if( data.message == "User Created Successfully") {
        toast(data.message);
        navigateToSignin(navigate);
      }
    } catch(err: any) {
      if(err.response  && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
        toast.error(error)
      } else {
        setError('An error occurred during sign up. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='bg-slate-200 w-full h-screen flex justify-center items-center'>
      <div className='flex flex-col justify-center'>
        <div className='bg-white w-96 h-max rounded-lg py-4 px-8 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
          <Heading label={'Sign Up'} />
          <SubHeading label={'Enter your information to create account'} />
          <InputBox 
            label={"Name"} 
            placeholder={"John Doe"} 
            name={"name"}
            value={postInputs.name}
            onChange={handleInputChange} />
          <InputBox 
            label={"Username"} 
            placeholder={"jonhdoe123"} 
            name={'username'}
            value={postInputs.username}
            onChange={handleInputChange} />
          <InputBox 
            label={"Email"} 
            placeholder={"john@12gmail.com"} 
            name={'email'}
            value={postInputs.email}
            onChange={handleInputChange} />
          <InputBox 
            label={"Password"}
            placeholder={"12345"}
            name={'password'}
            value={postInputs.password}    
            onChange={handleInputChange} />
          <BottomText 
            label={'Already have an account? '} 
            buttonText={'Sign In'} 
            to={'/signin'} />
          <div className='flex flex-col items-center'>
            <Button 
            label={loading ? 'Signing Up...' : 'Sign Up'} 
            onClick={handleSignup} 
            solid={true}/>
          </div>

          {/* show error  */}
          {
            error &&
            <div className="text-red-500 text-center mt-4">{error}</div>
          }
        </div>
      </div>
    </div>
  )
  }


