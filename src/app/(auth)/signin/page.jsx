'use client';

import React, { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import {
    FiEye,
    FiEyeOff,
    FiMail,
    FiLock,
    FiCheckCircle,
    FiAlertCircle,
} from 'react-icons/fi';
import Link from 'next/link';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataObj = new FormData(e.currentTarget);
        const entriesData = Object.fromEntries(formDataObj.entries());
        console.log('FormData entries:', entriesData);

        const { data, error } = await authClient.signIn.email({
            email: entriesData.email, // required, The email address of the user.
            password: entriesData.password,
            rememberMe: true, // If false, the user will be signed out when the browser is closed. (optional) (default: true)
            callbackURL: "/", // An optional URL to redirect to after the user signs in. (optional)
        });


        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);

        try {
            const { data, error } = await authClient.signIn.email({
                email: formData.email,
                password: formData.password,
                rememberMe: formData.rememberMe,
                callbackURL: '/',
            });

            console.log('SignIn response:', { data, error });

            if (error) {
                setErrors({
                    password: error.message || 'Invalid email or password',
                });
                return;
            }

            setIsLoggedIn(true);
        } catch (err) {
            console.error('Login error:', err);
            setErrors({
                password: 'Something went wrong. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-slate-100">
                    <FiCheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Login Successful!</h2>
                    <p className="text-slate-600 mb-6">
                        Welcome back, <span className="font-semibold text-slate-800">{formData.email}</span>.
                    </p>
                    <button
                        onClick={() => {
                            setIsLoggedIn(false);
                            setFormData({
                                email: '',
                                password: '',
                                rememberMe: false,
                            });
                        }}
                        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Sign in to your account to continue
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiMail className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-slate-300 focus:ring-indigo-500'
                                    } rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm`}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <FiAlertCircle className="w-3.5 h-3.5" /> {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiLock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`block w-full pl-10 pr-10 py-2.5 border ${errors.password
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-slate-300 focus:ring-indigo-500'
                                    } rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <FiAlertCircle className="w-3.5 h-3.5" /> {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                            />
                            <label htmlFor="rememberMe" className="ml-2 block text-sm text-slate-600">
                                Remember me
                            </label>
                        </div>

                        <a
                            href="#forgot-password"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Forgot password?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                    >
                        {isLoading ? 'Signing in...' : 'Log In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/singup" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;