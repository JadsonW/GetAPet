import { ReactNode, createContext } from "react";

import useAuth from "../hooks/useAuth";

interface AuthContextType {
  register: (user: object) => Promise<void>;
  login: (user: object) => Promise<void>;
  logout: () => void;
}

const Context = createContext<AuthContextType | any>(undefined);

interface functionProviderProps {
  children: ReactNode;
}

function FunctionsProvider({ children }: functionProviderProps) {
  const {
    register,
    authenticated,
    login,
    logout,
    getUser,
    getUserById,
    getAllPets,
    getPet,
    updateUser,
    getPetByUser,
    createdPet,
    deletePet,
    editPet,
    reqVisit,
    getAllReqVisitsByPet,
    deleteReqVisit,
    scheduleVisit,
    getAllVisitsByUser,
    getAllVisitsByPet,
    cancelVisit,
    concludeAdoption,
  } = useAuth();

  return (
    <Context.Provider
      value={{
        register,
        authenticated,
        login,
        logout,
        getUser,
        getUserById,
        getAllPets,
        getPet,
        updateUser,
        getPetByUser,
        createdPet,
        deletePet,
        editPet,
        reqVisit,
        getAllReqVisitsByPet,
        deleteReqVisit,
        scheduleVisit,
        getAllVisitsByUser,
        getAllVisitsByPet,
        cancelVisit,
        concludeAdoption,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { Context, FunctionsProvider };
