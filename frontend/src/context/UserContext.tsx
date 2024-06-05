import { ReactNode, createContext } from "react";

import useAuth from "../hooks/useAuth";

interface AuthContextType {
  register: (user: object) => Promise<void>;
  login: (user: object) => Promise<void>;
  logout: () => void;
}

const Context = createContext<AuthContextType | any>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

function UserProvider({ children }: UserProviderProps) {
  const {
    register,
    authenticated,
    login,
    logout,
    getUser,
    getAllPets,
    getPet,
    updateUser,
    getPetByUser,
  } = useAuth();

  return (
    <Context.Provider
      value={{
        register,
        authenticated,
        login,
        logout,
        getUser,
        getAllPets,
        getPet,
        updateUser,
        getPetByUser,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { Context, UserProvider };
