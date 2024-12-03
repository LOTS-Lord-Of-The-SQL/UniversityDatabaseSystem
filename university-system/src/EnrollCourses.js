import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Alert,
  Collapse,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/School";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

const EnrollCourse = () => {
  const [courses, setCourses] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "", open: false });
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Backend'den kursları çek
  useEffect(() => {
    const listCourses = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/list-courses-to-enroll",
          {
            id: currentUser.id,
          }
        );

        setCourses(response.data.non_enrolled_courses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setAlert({
          type: "error",
          message: "Failed to fetch courses. Please try again.",
          open: true,
        });
      }
    };

    listCourses();
  }, [currentUser]);

  // Kurs ekleme işlemi
  const enrollCourse = async (courseId) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/enroll-course", {
        user_id: currentUser.id,
        course_id: courseId,
      });

      if (response.status === 200) {
																			  
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.course_id !== courseId)
        );
        setAlert({
          type: "success",
          message: "Successfully enrolled in the course!",
          open: true,
        });

        setTimeout(() => setAlert({ open: false }), 3000); // Alert'i 3 saniye sonra kapat
        
      }
    } catch (error) {
      console.error("Failed to enroll course:", error);
      setAlert({
        type: "error",
        message: "Failed to enroll in the course. Please try again.",
        open: true,
      });
    }
  };

  return (
    <Box>
      {/* Üst Bar */}
      <AppBar position="sticky" color="primary" className="header">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Enroll in a Course
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Alert Mesajı */}
      <Collapse in={alert.open}>
        <Alert
          severity={alert.type}
          onClose={() => setAlert({ open: false })}
          sx={{ margin: 2 }}
        >
          {alert.message}
        </Alert>
      </Collapse>

      {/* Course List */}
      <Box p={3}>
      <Box p={3}>
  <Card
    sx={{
      backgroundColor: "#f9f9f9", // Arka plan rengini tema ile uyumlu hale getirdik
      boxShadow: 2, // Daha küçük gölge
      borderRadius: 2,
      padding: 1, // Daha az padding
      width: 'auto', // Yatayda otomatik genişleme
      maxWidth: '350px', // Genişliği sınırladık
      margin: "0 auto", // Ortalamak için
    }}
  >
    <CardContent>
      <Typography
        variant="h6" // Daha küçük font boyutu
        align="center"
        sx={{ fontWeight: "bold", fontSize: '1.2rem' }} // Küçük boyut
        gutterBottom
      >
        Available Courses
      </Typography>
    </CardContent>
  </Card>
</Box>

        {courses.length === 0 ? (
          <Typography variant="h6" align="center" color="textSecondary">
            No courses available to enroll.
          </Typography>
        ) : (<Grid container spacing={3} justifyContent="center">
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.course_id}>
            <Card
              sx={{
                maxWidth: 345,
                boxShadow: 3,
                borderRadius: 2,
                ":hover": { boxShadow: 6 },
                backgroundColor: "#f9f9f9",
                margin: "0 auto", // Kartları ortalamak için
                padding: 2, // Kart içerisine padding eklemek
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    color: "#1C2833", // Başlık rengini iyileştirdik
                    fontFamily: "'Roboto', sans-serif", // Fontu geliştirdik
                    fontSize: "1.3rem", // Font boyutunu büyüttük
                  }}
                  gutterBottom
                >
                  {course.course_name}
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  color="textSecondary"
                  sx={{
                    fontFamily: "'Roboto', sans-serif", // Aynı font ailesi
                    fontSize: "1rem", // Font boyutunu düzenledik
                  }}
                  gutterBottom
                >
                  Code: {course.course_code}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  fullWidth
                  endIcon={<SchoolIcon />}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    backgroundColor: "#1C2833",
                    ":hover": { backgroundColor: "#566573" }, // Hover rengi
                    fontFamily: "'Roboto', sans-serif", // Font ailelerini uyumlu hale getirdik
                  }}
                  onClick={() => enrollCourse(course.course_id)}
                >
                  Enroll
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
        )}
      </Box>
    </Box>
  );
};

export default EnrollCourse;
