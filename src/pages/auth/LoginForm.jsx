import { useState } from 'react';
import { useRouter } from 'next/router';
import { IoLockClosed, IoEye, IoEyeOff } from "react-icons/io5";
import { axios } from '../api/axios';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/auth/login', {
        email: "tarqymuhammadal@gmail.com",
        password: 'ali90'
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      router.push(`/auth/UserInfo?username=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('Login failed:', error.message);
      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
    }


    setAttempts(attempts + 1);

    const user = { username: email };
    localStorage.setItem('user', JSON.stringify(user));
    router.push(`/auth/UserInfo?username=${encodeURIComponent(email)}`);
  };

  const handleCreateAccount = () => {
    router.push('/auth/CreateAccount');
  };

  const handleForgetPassword = () => {
    router.push('/auth/ForgetPassword');
  };

  const handleChangePassword = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9]{0,6}$/.test(value)) {
      setPassword(value);
    }
  };


  const isDisabled = attempts >= maxAttempts;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-10">
        <div>
          <IoLockClosed className="mx-auto h-12 w-auto text-blue-500" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={handleChangePassword}
                disabled={isDisabled}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={isDisabled}
              >
                {showPassword ? <IoEyeOff className="h-5 w-5 text-gray-400" /> : <IoEye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>

            <div className="text-sm">
              <p onClick={handleForgetPassword} className="cursor-pointer font-medium text-blue-600 hover:text-blue-500 hover:underline">Forgot your password?</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={isDisabled}
            >
              {isDisabled ? `Max Attempts Reached (${maxAttempts})` : 'Sign in'}
            </button>
          </div>
          {isDisabled && <p className="text-red-500 text-center">Max attempts reached. Please try again later.</p>}
        </form>
        <div className="text-center">
          <p className="text-sm">Don't have an account? <button className="font-medium text-blue-600 hover:text-blue-500 hover:underline" onClick={handleCreateAccount}>Create one</button>.</p>
        </div>
      </div>
    </div>
  );
}