import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();


    function generateUniqueToken(length = 20) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < length; i++) {
            token += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return token;
    }

    async function sendResetEmail(email, resetToken) {
        try {
            const response = await fetch('http://localhost:5001', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, resetToken }),
            });

            if (response.ok) {
                console.log(`Reset email sent to ${email} with token ${resetToken}`);
                return true;
            } else {
                const errorMessage = await response.text();
                throw new Error(`Failed to send reset email: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error sending reset email:', error.message);
            return false;
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5001', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                const resetToken = generateUniqueToken();
                await sendResetEmail(email, resetToken);
                setIsSubmitted(true);
            } else {
                throw new Error('Failed to send reset password link');
            }

        } catch (error) {
            console.error('Error sending reset password link:', error.message);
        }
    };

    const handleLoginForm = () => {
        router.push('LoginForm');
    };

    const confirmationMessage = isSubmitted ? (
        <p className="text-center text-sm text-red-600 font-medium">An email has been sent to {email}. Please check your inbox and follow the instructions to reset your password.</p>
    ) : null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-10 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot Your Password?</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
                </div>
                {confirmationMessage}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {isSubmitted ? 'Email Sent' : 'Send Reset Link'}
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <p className="text-sm">Remembered your password? <span onClick={handleLoginForm} className="cursor-pointer font-medium text-blue-600 hover:text-blue-500">Sign in</span></p>
                </div>
            </div>
        </div>
    );
}
