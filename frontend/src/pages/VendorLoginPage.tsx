import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { Store } from 'lucide-react';

const VendorLoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
    });

    const { login, user, loading, error, clearError } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === 'vendor') {
            navigate('/vendor/dashboard');
        }
    }, [user, navigate]);

    const validateForm = () => {
        let valid = true;
        const errors = {
            email: '',
            password: '',
        };

        if (!email) {
            errors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
            valid = false;
        }

        if (!password) {
            errors.password = 'Password is required';
            valid = false;
        }

        setFormErrors(errors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (validateForm()) {
            try {
                await login(email, password, 'vendor');
            } catch (err) {
                console.error('Login failed:', err);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
                        <Store className="h-6 w-6 text-green-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Vendor Login</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Access your vendor dashboard
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Vendor email"
                            label="Email address"
                            error={formErrors.email}
                            fullWidth
                        />

                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            label="Password"
                            error={formErrors.password}
                            fullWidth
                        />
                    </div>

                    <div>
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            isLoading={loading}
                            disabled={loading}
                        >
                            Sign in to Vendor Dashboard
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VendorLoginPage;