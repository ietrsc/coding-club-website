import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Email verification status
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // Hashed verification code
    emailVerificationToken: {
      type: String,
      default: null,
    },

    // Verification code expiry time
    emailVerificationExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);