const { z } = require("zod");

// ✅ Signup Schema
const SignupSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    addresses: z.array(z.string()).nonempty("At least one address is required")
});

// ✅ Signin Schema
const SigninSchema = z.object({
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

// ✅ Validation functions
const SignupValidation = (body) => {
    try {
        SignupSchema.parse(body);
    } catch (err) {
        const error = new Error(err.errors[0].message);
        error.statusCode = 400;
        throw error;
    }
};

const SigninValidation = (body) => {
    try {
        SigninSchema.parse(body);
    } catch (err) {
        const error = new Error(err.errors[0].message);
        error.statusCode = 400;
        throw error;
    }
};

module.exports = {
    SignupValidation,
    SigninValidation
};
