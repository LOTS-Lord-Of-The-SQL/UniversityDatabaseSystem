import React, { createContext, useState, useEffect } from "react";

export const CoursesContext = createContext();

export const ContextProvider = ({ children }) => {
  // Kullanıcı bilgisini önce localStorage'dan oku, yoksa varsayılan değer ata
  const [courses, setCourses] = useState(() => {
    const savedCourses = localStorage.getItem("courses");
    return savedCourses ? JSON.parse(savedCourses) : "null"
  });

  // currentUser her güncellendiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  return (
    <CoursesContext.Provider value={{ courses, setCourses }}>
      {children}
    </CoursesContext.Provider>
  );
};