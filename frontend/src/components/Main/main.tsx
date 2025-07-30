import AuthService from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import React from 'react'

const MainPage = () => {

  const authService = AuthService.getInstance();
  const route = useRouter()

  const logout = () => {
    authService.logout()
    route.push('/')
  }

  return (
    <>
      <div>MainPage</div>
      <button className='text-red-400' type='button' onClick={logout}>Logout</button>
    </>
  )
}

export default MainPage