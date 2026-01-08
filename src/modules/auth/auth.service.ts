import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { pool } from "../../config/db";
import { AppError } from "../../middleware/errorHandler";
import type {
  JwtPayload,
  User,
  UserLogin,
  UserResponse,
  UserSignUp,
} from "../../types/typeDefine";
import config from "../../config";

const userSignUp = async (userData: UserSignUp): Promise<User> => {
  const { name, email, password, phone, role = "customer" } = userData;

  // Validate input
  if (!name || !email || !password || !phone) {
    throw new AppError(400, "All fields are required");
  }

  if (password.length < 6) {
    throw new AppError(400, "Password must be at least 6 characters long");
  }

  // Validate role
  if (role && !["admin", "customer"].includes(role)) {
    throw new AppError(400, "Role must be 'admin' or 'customer'");
  }

  // Check if user already exists
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email.toLowerCase()]
  );

  if (existingUser.rows.length > 0) {
    throw new AppError(400, "User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcryptjs.hash(password, 10);

  // Create user
  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING id, name, email, phone, role`,
    [name, email.toLowerCase(), hashedPassword, phone, role]
  );

  return result.rows[0];
};

const userSignIn = async (
  credentials: UserLogin
): Promise<{ user: UserResponse; token: string }> => {
  const { email, password } = credentials;

  // validate input
  if (!email || !password) {
    throw new AppError(400, "Email and Password are required");
  }

  // Check if user exists
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email.toLowerCase(),
  ]);

  if (result.rows.length === 0) {
    throw new AppError(404, "User not found");
  }

  const user = result.rows[0] as User;

  //verify password
  const isPasswordValid = await bcryptjs.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid password");
  }

  // Generate JWT token
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, config.secret_key as string, {
    expiresIn: "24h",
  });

  // Return user without password
  const userResponse: UserResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  return {
    user: userResponse,
    token,
  };
};

export const authService = {
  userSignUp,
  userSignIn,
};
