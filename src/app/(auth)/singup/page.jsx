'use client'

import { authClient } from '@/lib/auth-client';
import { redirect } from 'next/dist/server/api-utils';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import {
    FiEye,
    FiEyeOff,
    FiUser,
    FiMail,
    FiLock,
    FiAlertCircle,
} from 'react-icons/fi';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        agreeTerms: false,
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = 'Name must be at least 3 characters';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email address is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.agreeTerms) {
            newErrors.agreeTerms = 'You must agree to the Terms & Conditions';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);

        try {
            const { data, error } = await authClient.signUp.email({
                name: formData.fullName.trim(),
                email: formData.email,
                password: formData.password,
                callbackURL: '/',
            });

            console.log('SignUp response:', { data, error });

            if (error) {
                setErrors({
                    email: error.message || 'Could not create the account. Please try again.',
                });
                return;
            }
            redirect('/')

            // window.location.href = '/';
        } catch (err) {
            console.error('Signup error:', err);
            setErrors({
                email: 'Something went wrong. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        const data = await authClient.signIn.social({
            provider: "google",
        });
        console.log(data)
    }
    const handleGithubSignUp = async () => {
        const data = await authClient.signIn.social({
            provider: "github",
        });
        console.log(data)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900">Create an Account</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Join us today by filling out the information below
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiUser className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className={`block w-full pl-10 pr-3 py-2.5 border ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-indigo-500'
                                    } rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm`}
                            />
                        </div>
                        {errors.fullName && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <FiAlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                            </p>
                        )}
                    </div>

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
                                className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-indigo-500'
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
                                className={`block w-full pl-10 pr-10 py-2.5 border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-indigo-500'
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

                    {/* Terms and Conditions */}
                    <div>
                        <div className="flex items-start">
                            <input
                                id="agreeTerms"
                                name="agreeTerms"
                                type="checkbox"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded mt-0.5"
                            />
                            <label htmlFor="agreeTerms" className="ml-2 block text-sm text-slate-600">
                                I agree to the{' '}
                                <a href="#terms" className="text-indigo-600 hover:underline font-medium">
                                    Terms & Conditions
                                </a>{' '}
                                and{' '}
                                <a href="#privacy" className="text-indigo-600 hover:underline font-medium">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>
                        {errors.agreeTerms && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <FiAlertCircle className="w-3.5 h-3.5" /> {errors.agreeTerms}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                    >
                        {isLoading ? 'Creating account...' : 'Sign Up'}
                    </button>
                    <div className="mt-6">
                        <div className="relative flex items-center justify-center mb-4">
                            <div className="border-t border-slate-200 w-full"></div>
                            <span className="bg-white px-3 text-xs text-slate-400 uppercase">Or</span>
                            <div className="border-t border-slate-200 w-full"></div>
                        </div>

                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={handleGoogleSignUp}
                                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition duration-200"
                            >
                                <FcGoogle className="w-5 h-5" />
                                <span>Sign up with Google</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleGithubSignUp}
                                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition duration-200"
                            >
                                <FaGithub className="w-5 h-5 text-slate-900" />
                                <span>Sign up with GitHub</span>
                            </button>
                        </div>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link href="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegistrationForm;
