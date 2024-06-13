import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    // image: { type: String },
    /**
     * 소셜 로그인
     */
    authProviderId: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.models?.User || mongoose.model("User", userSchema);
