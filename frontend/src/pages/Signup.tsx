import { useState } from 'react'
import { InputBox } from "../components/InputBox"
import { Heading } from '../components/Heading';
import { SubHeading } from '../components/SubHeading';
import { BottomText } from '../components/BottomText';

export const Signup = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className='bg-slate-200 w-full h-screen flex justify-center items-center'>
      <div className='flex flex-col justify-center'>
        <div className='bg-white w-80 h-max rounded-lg py-4 px-8 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
          <Heading label={'Signup'} />
          <SubHeading label={'Enter your information to create account'} />
          <InputBox label={"Name"} placeholder={"John Doe"} onChange={e => {setName(e.target.value)}} />
          <InputBox label={"Username"} placeholder={"jonhdoe123"} onChange={e => {setUsername(e.target.value)}} />
          <InputBox label={"Email"} placeholder={"john@12gmail.com"} onChange={e => {setEmail(e.target.value)}} />
          <InputBox label={"Password"} placeholder={"12345"} onChange={e => {setPassword(e.target.value)}} />
          <BottomText label={'Already have an account? '} buttonText={'Signin'} to={'/signin'} />
        </div>
      </div>
    </div>
  )
  }