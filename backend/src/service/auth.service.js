// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Phone validation regex (10 digits)
const phoneRegex = /^\d{10}$/;

/**
 * Validates signup data
 * @param {Object} data - User signup data
 * @throws {Error} If validation fails
 */
const SignupValidation = (data) => {
    const { fullName, email, password, phone } = data;
    
    let errors = [];
    
    // Validate fullName
    if (!fullName || fullName.trim() === '') {
        errors.push('Full name is required');
    }
    
    // Validate email
    if (!email) {
        errors.push('Email is required');
    } else if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Validate phone (if provided)
    if (phone && !phoneRegex.test(phone)) {
        errors.push('Please enter a valid 10-digit phone number');
    }
    
    // Validate password
    if (!password) {
        errors.push('Password is required');
    } else if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    
    // Throw error if any validation fails
    if (errors.length > 0) {
        const error = new Error(errors.join(', '));
        error.statusCode = 400;
        throw error;
    }
};

/**
 * Validates signin data
 * @param {Object} data - User signin data
 * @throws {Error} If validation fails
 */
const SigninValidation = (data) => {
    const { email, phone, password } = data;
    
    let errors = [];
    
    // Either email or phone is required
    if (!email && !phone) {
        errors.push('Email or phone number is required');
    }
    
    // Validate email if provided
    if (email && !emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Validate phone if provided
    if (phone && !phoneRegex.test(phone)) {
        errors.push('Please enter a valid 10-digit phone number');
    }
    
    // Validate password
    if (!password) {
        errors.push('Password is required');
    }
    
    // Throw error if any validation fails
    if (errors.length > 0) {
        const error = new Error(errors.join(', '));
        error.statusCode = 400;
        throw error;
    }
};

module.exports = {
    SignupValidation,
    SigninValidation
};