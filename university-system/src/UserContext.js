import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Kullanıcı bilgisini önce localStorage'dan oku, yoksa varsayılan değer ata
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : {
      name: "aaaa",
      ID: 0,
      department: "DepartmentName",
      profilePicture: "/path/to/profile.jpg",
      title: "Title",
    };
  });

  // currentUser her güncellendiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};