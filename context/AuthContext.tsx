import { createContext, useContext, useState } from 'react';


interface AuthProps {
	authState: { authenticated: boolean | null; username: string | null };
	onLogin: (username: string, password: string) => void;
	onLogout: () => void;
}

const AuthContext = createContext<Partial<AuthProps>>({});

export const useAuth = () => {
	return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
	const [authState, setAuthState] = useState<{
		authenticated: boolean | null;
		username: string | null;
	}>({
		authenticated: null,
		username: null,
	});

	const login = (username: string, password: string) => {
		if (username === 'user' && password === 'user') {
			setAuthState({
				authenticated: true,
				username: username
			});
		} else {
			alert('Usuário ou senha inválidos!');
		}
	};

	const logout = async () => {
		setAuthState({
			authenticated: false,
			username: null
		});
	};

	const value = {
		onLogin: login,
		onLogout: logout,
		authState
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};