import { ReactNode, createContext } from "react";

import useAuth from "../hooks/useAuth";

interface AuthContextType {
  register: (user: object) => Promise<void>;
}

const Context = createContext<AuthContextType | any>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

function UserProvider({ children }: UserProviderProps) {
  const { register } = useAuth();

  return <Context.Provider value={{ register }}>{children}</Context.Provider>;
}

export { Context, UserProvider };
