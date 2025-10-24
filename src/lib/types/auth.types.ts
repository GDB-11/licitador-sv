// src/lib/types/auth.types.ts

/**
 * Tipos correspondientes a los DTOs de la API .NET
 */

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	expiresAt: string; // DateTime en formato ISO
	user: UserInfo;
}

export interface UserInfo {
	userId: string;
	email: string;
	fullName: string;
}

export interface RefreshTokenRequest {
	refreshToken: string;
}

export interface User {
	id: string;
	email: string;
	name: string;
}

export interface Company {
	companyId: string;
	ruc: string;
	razonSocial: string;
}

export interface AuthState {
	user: User | null;
	company: Company | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}