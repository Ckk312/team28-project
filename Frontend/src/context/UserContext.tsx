import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextProps {
  isLoggedIn: boolean;
  firstName: string | null;
  lastName: string | null;
  setIsLoggedIn: (status: boolean, firstName?: string, lastName?: string) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(
    () => JSON.parse(localStorage.getItem('isLoggedIn') || 'false')
  );
  const [firstName, setFirstName] = useState<string | null>(
    () => localStorage.getItem('firstName') || null
  );
  const [lastName, setLastName] = useState<string | null>(
    () => localStorage.getItem('lastName') || null
  );

  const setIsLoggedIn = (status: boolean, firstName?: string, lastName?: string) => {
    setIsLoggedInState(status);
    localStorage.setItem('isLoggedIn', JSON.stringify(status));

    if (status) {
      setFirstName(firstName || null);
      setLastName(lastName || null);
      if (firstName) localStorage.setItem('firstName', firstName);
      if (lastName) localStorage.setItem('lastName', lastName);
    } else {
      setFirstName(null);
      setLastName(null);
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
    }
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, firstName, lastName, setIsLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
