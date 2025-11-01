import React, { useState } from 'react';
import { User } from '../types';
import WelcomeModal from './WelcomeModal';

interface AuthPageProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setCurrentUserId: (id: string) => void;
    setIsGuest: (isGuest: boolean) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ users, setUsers, setCurrentUserId, setIsGuest }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [welcomeUser, setWelcomeUser] = useState<User | null>(null);


    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            setError('المستخدم غير موجود. الرجاء التسجيل أولاً.');
            return;
        }

        // For backward compatibility: if user has no password and input is empty, allow login.
        if (user.password === undefined && password === '') {
            setCurrentUserId(user.id);
            return;
        }
        
        if (user.password === password) {
            setCurrentUserId(user.id);
        } else {
            setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
        }
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            setError('هذا البريد الإلكتروني مسجل بالفعل. الرجاء تسجيل الدخول.');
            return;
        }

        if (password.length < 4) {
            setError('كلمة المرور يجب أن تكون 4 أحرف على الأقل.');
            return;
        }

        const newUser: User = {
            id: 'user-' + Date.now().toString(36) + Math.random().toString(36).substring(2),
            email: email,
            password: password,
            role: 'user',
            isActive: false,
            createdAt: new Date().toISOString()
        };
        setUsers(prev => [...prev, newUser]);
        setWelcomeUser(newUser); // Show welcome modal instead of logging in directly
    };

    const handleGuest = () => {
        setIsGuest(true);
    };

    const handleWelcomeModalClose = () => {
        if (welcomeUser) {
            setCurrentUserId(welcomeUser.id);
        }
        setWelcomeUser(null);
    };


    const renderForm = () => {
        const handleSubmit = isLoginView ? handleLogin : handleRegister;
        return (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        البريد الإلكتروني أو اسم المستخدم
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="text"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        كلمة المرور
                    </label>
                    <div className="mt-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete={isLoginView ? "current-password" : "new-password"}
                            required={!isLoginView}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        {isLoginView ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                    </button>
                </div>
            </form>
        );
    };

    return (
        <>
            <WelcomeModal 
                isOpen={!!welcomeUser}
                user={welcomeUser}
                onClose={handleWelcomeModalClose}
            />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        إدارة الأقساط
                    </h1>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        {isLoginView ? 'سجل الدخول إلى حسابك' : 'أنشئ حساباً جديداً للبدء'}
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
                        {error && <div className="mb-4 text-center text-sm bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-3 rounded-md">{error}</div>}
                        {renderForm()}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">أو</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <div>
                                    <button
                                        onClick={() => { setIsLoginView(!isLoginView); setError(''); }}
                                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <span>{isLoginView ? 'إنشاء حساب' : 'لدي حساب بالفعل'}</span>
                                    </button>
                                </div>
                                <div>
                                    <button
                                        onClick={handleGuest}
                                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <span>الدخول كضيف</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuthPage;