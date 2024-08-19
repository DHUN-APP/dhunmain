import React, { createContext, useContext, useState } from "react";

// Create context
const SearchContext = createContext();

// Create provider component
export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to use search context
export const useSearch = () => {
  return useContext(SearchContext);
};
