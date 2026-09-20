import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

const userSchema = new mongoose.Schema(
    {
        // User name
        name: {
            type: String,
            required: [true, "Please enter your name"],
            trim: true,
            maxlength: [50, "Your name cannot be longer than 50 characters"],
        },

        // Email
        email: {
            type: String,
            required: [true, "Please enter your email"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, "Please enter a valid email"],
        },

        // Password
        password: {
            type: String,
            required: [true, "Please enter your password"],
            minlength: [8, "Your password must be at least 8 characters long"],
            select: false,
        },

        // Confirm password
        passwordConfirm: {
            type: String,
            required: [true, "Please confirm your password"],
            validate: {
                validator: function (el) {
                    return el === this.password;
                },
                message: "Passwords do not match!",
            },
        },

        // Phone number
        phoneNumber: {
            type: String,
            required: [true, "Please enter your phone number"],
            unique: true,
            trim: true,
            validate: {
                validator: function (value) {
                    return /^[6-9]\d{9}$/.test(value);
                },
                message: "Please enter a valid Indian phone number",
            },
        },

        // User role
        role: {
            type: String,
            enum: ["user", "host", "admin"],
            default: "user",
        },

        // Avatar
        avatar: {
            url: {
                type: String,
            },
            public_id: {
                type: String,
            },
        },

        // Password changed time
        passwordChangedAt: {
            type: Date,
        },

        // Password reset token
        passwordResetToken: {
            type: String,
            select: false,
            index: true,
        },

        // Password reset expiry
        passwordResetExpires: {
            type: Date,
            select: false,
        },

        // Wishlist
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Property",
            },
        ],
    },


    // Automatically creates createdAt and updatedAt
    {
        timestamps: true,
    }
);


// ===============================
// Remove sensitive fields from JSON
// ===============================

userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.passwordConfirm;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;

        return ret;
    },
});


// ===============================
// Password Hashing
// ===============================

userSchema.pre("save", async function () {

    // Only hash password when password is modified
    if (!this.isModified("password")) {
        return ;
    }

    // Hash password
    this.password = await bcrypt.hash(this.password, 12);

    // Set password changed time
    if (!this.isNew) {
        this.passwordChangedAt = Date.now() - 1000;
    }

    // Don't save passwordConfirm
    this.passwordConfirm = undefined;

});


// ===============================
// Check Password During Login
// ===============================

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};


// ===============================
// Check If Password Changed
// ===============================

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {

    if (this.passwordChangedAt) {

        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    return false;
};


// ===============================
// Create Password Reset Token
// ===============================

userSchema.methods.createPasswordResetToken = function () {

    // Generate random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing in database
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // Token expires after 10 minutes
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    // Return original token to send through email
    return resetToken;
};


// ===============================
// Create User Model
// ===============================

const User = mongoose.model("User", userSchema);

export { User };






