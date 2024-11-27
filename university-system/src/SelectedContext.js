import React, { createContext, useState, useEffect } from "react";

export const SelectedContext = createContext();

export const SelectedProvider = ({ children }) => {
  // Kullanıcı bilgisini önce localStorage'dan oku, yoksa varsayılan değer ata
  const [selectedCourse, setSelectedCourse] = useState(() => {
    const savedSelected = localStorage.getItem("selectedCourse");
    return savedSelected ? JSON.parse(savedSelected) : null
  });

  // currentUser her güncellendiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("selectedCourse", JSON.stringify(selectedCourse));
  }, [selectedCourse]);

  return (
    <SelectedContext.Provider value={{ selectedCourse, setSelectedCourse }}>
      {children}
    </SelectedContext.Provider>
  );
};