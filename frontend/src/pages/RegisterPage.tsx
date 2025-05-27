import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const { register, user, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let valid = true;
    const errors = {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.name) {
      errors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      valid = false;
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Enter a valid 10-digit phone number';
      valid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.phone
        );
        navigate('/');
      } catch (err) {
        console.error('Registration failed:', err);
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side with image and quote */}
      <div className="hidden md:flex md:w-1/2 bg-wine relative">
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <img
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
          alt="Person using laptop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Your Vision, Our Printing Excellence
          </h2>
          <p className="text-xl md:text-2xl text-center">
            "Quality is remembered long after the price is forgotten."
          </p>
          <p className="mt-2 text-lg font-light italic">— Aman Prajapati</p>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="w-full md:w-1/2 bg-wine flex items-center justify-center p-4 md:p-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-wine">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                sign in to your existing account
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                label="Full name"
                error={formErrors.name}
                fullWidth
              />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                label="Email address"
                error={formErrors.email}
                fullWidth
              />
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number (10 digits)"
                label="Phone number"
                error={formErrors.phone}
                fullWidth
              />
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                label="Password"
                error={formErrors.password}
                fullWidth
              />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                label="Confirm password"
                error={formErrors.confirmPassword}
                fullWidth
              />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
              disabled={loading}
            >
              Create account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
