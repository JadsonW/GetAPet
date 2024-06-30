import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id?: string;
  name?: string;
  phone?: string;
  image?: string;
  email?: string;
  password?: string;
  imagePreview?: File;
  [key: string]: any; //
}

interface UserContextType {
  userLogged: User;
  setUserLogged: (userLogged: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userLogged, setUserLogged] = useState<User>({});

  return (
    <UserContext.Provider value={{ userLogged, setUserLogged }}>
      {children}
    </UserContext.Provider>
  );
};
