const SignupValidation = (data) => {
    const { fullName, email, password, role } = data;
    const errors = [];

    // Full name validation
    if (!fullName || fullName.trim().length === 0) {
        errors.push('Full name is required');
    } else if (fullName.trim().length < 2) {
        errors.push('Full name must be at least 2 characters long');
    }

    // Email validation
    if (!email || email.trim().length === 0) {
        errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Please enter a valid email address');
    }

    // Password validation
    if (!password) {
        errors.push('Password is required');
    } else if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }

    // Role validation
    if (role && !['customer', 'admin', 'vendor'].includes(role)) {
        errors.push('Invalid role specified');
    }

    if (errors.length > 0) {
        const error = new Error('Validation failed');
        error.statusCode = 400;
        error.details = errors;
        throw error;
    }

    return true;
};

const SigninValidation = (data) => {
    const { email, password, role } = data;
    const errors = [];

    // Email validation
    if (!email || email.trim().length === 0) {
        errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Please enter a valid email address');
    }

    // Password validation
    if (!password || password.trim().length === 0) {
        errors.push('Password is required');
    }

    // Role validation (optional for signin)
    if (role && !['customer', 'admin', 'vendor'].includes(role)) {
        errors.push('Invalid role specified');
    }

    if (errors.length > 0) {
        const error = new Error('Validation failed');
        error.statusCode = 400;
        error.details = errors;
        throw error;
    }

    return true;
};

module.exports = {
    SignupValidation,
    SigninValidation
};