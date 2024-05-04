import { useRouter } from 'next/router';
import { useState } from 'react';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { FaUser } from 'react-icons/fa';
import axios from '../api/axios';

export default function CreateAccount() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/auth/register', {
                email,
                password
            });
            const token = response.data.token;
            localStorage.setItem('token', token);
            router.push(`/auth/UserInfo?username=${encodeURIComponent(username)}`)
            localStorage.setItem('username', JSON.stringify(username));
        } catch (error) {
            console.error('Login failed:', error.message);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            }
        };
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSignIn = () => {
        router.push('LoginForm');
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (newPassword.length > 6) {
            setPasswordError("Password cannot be more than 6 characters");
        } else {
            setPasswordError("");
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const confirmPasswordValue = e.target.value;
        setConfirmPassword(confirmPasswordValue);
        if (password !== confirmPasswordValue) {
            setPasswordError("Passwords do not match");
        } else {
            setPasswordError("");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-10">
                <div>
                    <FaUser className="mx-auto h-12 w-auto text-blue-600" />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create an Account</h2>
                </div>
                <form className="mt-8 space-y-10" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input id="email" name="email" type="text" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                onChange={handlePasswordChange}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? (
                                    <RiEyeFill className="h-6 w-6 text-gray-500" />
                                ) : (
                                    <RiEyeOffFill className="h-6 w-6 text-gray-500" />
                                )}
                            </button>
                        </div>
                        <div className="relative">
                            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm Password"
                                onChange={handleConfirmPasswordChange}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? (
                                    <RiEyeFill className="h-6 w-6 text-gray-500" />
                                ) : (
                                    <RiEyeOffFill className="h-6 w-6 text-gray-500" />
                                )}
                            </button>
                        </div>
                        {passwordError && (
                            <p className="text-red-500 text-xs mt-1 font-semibold">{passwordError}</p>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={password.length > 6 || password !== confirmPassword || !!passwordError} // Disable button if password is more than 6 characters, passwords don't match, or there's an error message
                        >
                            Create Account
                        </button>
                    </div>

                    <div className="text-sm text-center">
                        Already have an account?
                        <span className="text-blue-600 cursor-pointer ml-1" onClick={handleSignIn}>Sign in</span>
                    </div>
                </form>
            </div>
        </div>
    );
}
