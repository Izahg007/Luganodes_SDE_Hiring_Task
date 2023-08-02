import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [vsCurrency, setVsCurrency] = useState('usd');

  const contextValue = {
    vsCurrency,
    setVsCurrency,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
