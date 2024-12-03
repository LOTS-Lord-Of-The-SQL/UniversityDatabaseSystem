import React, { createContext, useState, useEffect } from "react";

export const SelectedCommunityContext = createContext();

export const SelectedCommunityProvider = ({ children }) => {
  // Kullanıcı bilgisini önce localStorage'dan oku, yoksa varsayılan değer ata
  const [selectedCommunity, setselectedCommunity] = useState(() => {
    const savedSelected = localStorage.getItem("selectedCommunity");
    return savedSelected ? JSON.parse(savedSelected) : null
  });

  // currentUser her güncellendiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("selectedCommunity", JSON.stringify(selectedCommunity));
  }, [selectedCommunity]);

  return (
    <SelectedCommunityContext.Provider value={{ selectedCommunity, setselectedCommunity }}>
      {children}
    </SelectedCommunityContext.Provider>
  );
};