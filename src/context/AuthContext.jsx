"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [isUser, setIsUser] = useState(false);
	const [loading, setLoading] = useState(true);

	const refreshAuth = async () => {
		setLoading(true);

		try {
			const response = await api.get("/auth/me");
			const nextUser = response?.data?.success ? response?.data?.user || null : null;
			setUser(nextUser);
			setIsUser(Boolean(nextUser));
		} catch {
			setUser(null);
			setIsUser(false);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refreshAuth();

		const handleAuthChange = () => {
			refreshAuth();
		};

		window.addEventListener("authChange", handleAuthChange);
		return () => {
			window.removeEventListener("authChange", handleAuthChange);
		};
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				isUser,
				loading,
				refreshAuth,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider.");
	}

	return context;
}