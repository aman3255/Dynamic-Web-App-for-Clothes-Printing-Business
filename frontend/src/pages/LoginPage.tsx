import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { User, Lock, Store, AlertCircle, CheckCircle } from 'lucide-react';

type UserRole = 'customer' | 'admin' | 'vendor';

interface FormErrors {
  email: string;
  password: string;
  general: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: '',
    password: '',
    general: '',
  });

  const { login, user, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Clear errors when inputs change
  useEffect(() => {
    if (formErrors.email || formErrors.password || formErrors.general) {
      setFormErrors({ email: '', password: '', general: '' });
    }
    clearError();
  }, [email, password, selectedRole, clearError]);

  // Redirect based on user role after successful login
  useEffect(() => {
    if (user) {
      const redirectPaths = {
        admin: '/admin/dashboard',
        vendor: '/vendor/dashboard',
        customer: '/'
      };
      
      const redirectPath = redirectPaths[user.role as keyof typeof redirectPaths] || '/';
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  const validateForm = (): boolean => {
    let valid = true;
    const errors: FormErrors = {
      email: '',
      password: '',
      general: '',
    };

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
      valid = false;
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormErrors({ email: '', password: '', general: '' });

    if (!validateForm()) {
      return;
    }

    try {
      await login(email.trim().toLowerCase(), password, selectedRole);
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email.trim().toLowerCase());
        localStorage.setItem('rememberedRole', selectedRole);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedRole');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setFormErrors(prev => ({
        ...prev,
        general: err.message || 'Login failed. Please try again.'
      }));
    }
  };

  // Load remembered credentials on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedRole = localStorage.getItem('rememberedRole');
    
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
    
    if (rememberedRole && ['customer', 'admin', 'vendor'].includes(rememberedRole)) {
      setSelectedRole(rememberedRole as UserRole);
    }
  }, []);

  const getRoleIcon = (role: UserRole) => {
    const iconProps = { className: "h-5 w-5" };
    switch (role) {
      case 'admin':
        return <Lock {...iconProps} />;
      case 'vendor':
        return <Store {...iconProps} />;
      default:
        return <User {...iconProps} />;
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Manage users, products, and system settings';
      case 'vendor':
        return 'Manage your products and orders';
      case 'customer':
        return 'Browse and purchase custom printed clothing';
      default:
        return '';
    }
  };

  const displayError = error || formErrors.general;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Create one here
            </Link>
          </p>
        </div>

        {displayError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm text-red-700">{displayError}</p>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select your role
            </label>
            <div className="grid grid-cols-1 gap-3">
              {(['customer', 'admin', 'vendor'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`relative flex items-center p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                    selectedRole === role
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-full mr-4 ${
                    selectedRole === role ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {getRoleIcon(role)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium capitalize ${
                        selectedRole === role ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {role}
                      </span>
                      {selectedRole === role && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${
                      selectedRole === role ? 'text-blue-700' : 'text-gray-500'
                    }`}>
                      {getRoleDescription(role)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Email Input */}
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              label="Email Address"
              error={formErrors.email}
              fullWidth
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              label="Password"
              error={formErrors.password}
              fullWidth
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link 
                to="/forgot-password" 
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
              disabled={loading || !email.trim() || !password}
              className="relative"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                `Sign in as ${selectedRole}`
              )}
            </Button>
          </div>
        </form>

        {/* Additional Links */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;