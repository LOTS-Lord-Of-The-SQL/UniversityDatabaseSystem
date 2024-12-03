import React from "react";
import {
  Avatar,
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Box,
  IconButton,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Grid2,
} from "@mui/material";
import "./Home.css";
import { useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import { SelectedContext } from "./SelectedContext";
import { CoursesContext } from "./CoursesContext";
import axios from "axios";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { SelectedCommunityContext } from "./SelectedCommunityContext";
import logo512 from './assets/logo512.png';


const Profile = () => {
  const navigate = useNavigate();
  const { setSelectedCourse } = useContext(SelectedContext);
  const { currentUser } = useContext(UserContext);
  const { courses, setCourses } = useContext(CoursesContext);
  const { setselectedCommunity } = useContext(SelectedCommunityContext);

  const [communities, setCommunities] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  const listCourses = useCallback(async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/list-courses", {
        id: currentUser.id,
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, [currentUser.id, setCourses]);

  useEffect(() => {
    listCourses();
  }, [listCourses]);

  const listCommunities = useCallback(async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/list-joined-communities", {
        user_id: currentUser.id,
      });
      setCommunities(response.data.joined_communities);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, [currentUser.id, setCommunities]);

  useEffect(() => {
    listCommunities();
  }, [listCommunities]);

  const openCoursePage = (course) => {
    setselectedCommunity(null);
    setSelectedCourse(course);
    navigate("/home");
  };

  const openHomePage = () => {
    setselectedCommunity(null);
    setSelectedCourse(null);
    navigate("/home");
  };

  const openCommunityPage = (community) => {
    setSelectedCourse(null);
    console.log(community);
    setselectedCommunity(community);
    navigate("/home");
  };

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  return (

    <div className="app-container">
      <AppBar position="sticky" color="primary" className="header">
        <Toolbar>
          {/* Hamburger Menü Butonu */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <img src={logo512} alt="logo512" width="50" height="50" onClick={openHomePage} style={{ cursor: "pointer" }}/>
          <Typography
            variant="h6"
            className="header-title"
            onClick={openHomePage}
          >
            TOBB ETU
          </Typography>
          <Box display="flex" flexGrow={1}>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                  textAlign: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)', // Optional: adds a semi-transparent background for better contrast
                  padding: '10px 10px',
                  borderRadius: '8px',
                  boxShadow: 2,
                  fontSize: '0.8rem', // Adjust font size if you want finer control
                }}
              >
                {currentUser.username}
              </Typography>
            </Box>

            <Avatar
              src={currentUser.profilePicture}
              alt={currentUser.username}
              style={{ cursor: "pointer" }}
              onClick={() => (window.location = "/profile")}
            />
          </Box>
          <Button
            color="inherit"
            onClick={() => setOpenLogoutModal(true)}
          >
            <LogoutIcon />
          </Button>

          {/* Logout Modal */}
          <Dialog open={openLogoutModal} onClose={() => setOpenLogoutModal(false)}>
            <DialogTitle>Logout</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to log out?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenLogoutModal(false)} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleLogout();
                  setOpenLogoutModal(false);
                }}
                color="secondary"
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Toolbar>
        {/* Logout Butonu */}

      </AppBar>
      {/* Sol Drawer (Navigasyon Çubuğu) */}
      <Drawer open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          style={{ width: 250 }}
        >
          <List>
            <ListItem button onClick={() => (window.location = "/enrollcourse")}>
              <ListItemText style={{ cursor: "pointer" }} primary="Enroll Course" />
            </ListItem>
            <ListItem button onClick={() => (window.location = "/enrollcommunity")}>
              <ListItemText style={{ cursor: "pointer" }} primary="Enroll Community" />
            </ListItem>
            <ListItem button onClick={() => (window.location = "/reservefacility")}>
              <ListItemText style={{ cursor: "pointer" }} primary="Reserve Facility" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box padding={3} display="flex" flexDirection="column" alignItems="center">

        <Card
          sx={{
            width: { xs: '95vw', md: '60vw' },
            margin: 'auto',
            padding: 3,
            backgroundColor: '#f5f5f5',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
              <Avatar
                src={currentUser.profile_photo_path}
                alt={currentUser.username}
                sx={{
                  width: 140,
                  height: 140,
                  border: '4px solid #1C2833', // Change border to match the primary color
                  marginBottom: 2,
                  boxShadow: 3, // Add shadow to create depth
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: '#1C2833', // Use a primary color for text
                  textAlign: 'center',
                  fontSize: '1.4rem',
                }}
                gutterBottom
              >
                {currentUser.username}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#555', // Darker shade for better readability
                    textAlign: 'center',
                    fontSize: '1.1rem',
                  }}
                >
                  {`Student ID: ${currentUser.id}`}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#555',
                    textAlign: 'center',
                    fontSize: '1.1rem',
                  }}
                >
                  {`Role: ${currentUser.role}`}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#555',
                    textAlign: 'center',
                    fontSize: '1.1rem',
                  }}
                >
                  {`Department: ${currentUser.department}`}
                </Typography>
              </Box>
            </Box>
          </CardContent>

        </Card>

        <Box style={{ display: 'flex', justifyContent: 'space-between', margin: '50px', gap: '20px' }}>
          <Card sx={{ width: 'auto', backgroundColor: '#f5f5f5' }}>
            <CardHeader
              title="Enrolled Courses"
              sx={{ textAlign: 'center', backgroundColor: '#606E7C', color: 'white' }}
            />
            <CardContent>
              <Grid2 container spacing={2}>
                {courses && courses.courses && courses.courses.length > 0 ? (
                  courses.courses.map((course, index) => (
                    <Grid2 xs={12} md={6} key={index}>
                      <Card
                        onClick={() => openCoursePage(course)}
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: '#D6DBDF',
                          '&:hover': { backgroundColor: '#AEB6BF' },
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {course.course_code}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ color: '#555' }}>
                            {course.course_name}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid2>
                  ))
                ) : (
                  <Typography>No courses available</Typography>
                )}
              </Grid2>
            </CardContent>
          </Card>

          <Card sx={{ width: 'auto', backgroundColor: '#f5f5f5' }}>
            <CardHeader
              title="Enrolled Communities"
              sx={{ textAlign: 'center', backgroundColor: '#606E7C', color: 'white' }}
            />
            <CardContent>
              <Grid2 container spacing={2}>
                {communities && communities.length > 0 ? (
                  communities.map((community, index) => (
                    <Grid2 xs={12} md={6} key={index}>
                      <Card
                        onClick={() => openCommunityPage(community)}
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: '#D6DBDF',
                          '&:hover': { backgroundColor: '#AEB6BF' },
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {community.community_name}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ color: '#555' }}>
                            Role: {community.user_role}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid2>
                  ))
                ) : (
                  <Typography>No communities available</Typography>
                )}
              </Grid2>
            </CardContent>
          </Card>

        </Box>
      </Box>
    </div>
  );
};

export default Profile;