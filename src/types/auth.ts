export interface User {
  id: string;
  email: string;
  name: string;
  role: "brand" | "ambassador";
  avatarUrl?: string;
}

export interface Session {
  user: User;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface PhoneLoginRequest {
  phone: string;
}

export interface OtpVerifyRequest {
  phone: string;
  code: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}
