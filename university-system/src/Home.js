
import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  Avatar,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Modal,
  Box,
  Fab,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { formatDistanceToNow } from "date-fns";
import "./Home.css";
import { UserContext } from "./UserContext";
import { SelectedContext } from "./SelectedContext";
import axios from "axios";
import MenuIcon from "@mui/icons-material/Menu";
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { SelectedCommunityContext } from "./SelectedCommunityContext";
import { ListItemIcon } from '@mui/material'; // ListItemIcon importu
import EnrollmentIcon from '@mui/icons-material/School'; // EnrollCourse için bir örnek ikon
import CommunityIcon from '@mui/icons-material/Group'; // EnrollCommunity için bir örnek ikon
import ReserveIcon from '@mui/icons-material/EventAvailable'; // ReserveFacility için bir örnek ikon
import logo512 from './assets/logo512.png';



const Home = () => {
  const { currentUser } = useContext(UserContext);
  const { selectedCourse, setSelectedCourse } = useContext(SelectedContext);
  const { selectedCommunity, setselectedCommunity } = useContext(SelectedCommunityContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [instructor, setInstructor] = useState([]);
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [activePostId, setActivePostId] = useState(null);
  const [likesPostId, setlikesPostId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const handleDelete = () => {
    deletePost(deletePostId); // Silme işlemini tetikle
    setDeletePostId(null); // Modal'ı kapat
  };

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  const getComments = useCallback(async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/post-detail", {
        post_id: activePostId,
      });

      const fetchedComments = response.data.comments.map((com) => ({
        author: com.owner.user_name + "",
        content: com.content,
        time: new Date(com.created_at),
      }));

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === activePostId) {
            return { ...post, comments: fetchedComments };
          }
          return post;
        })
      );

    } catch (error) {
      console.error("Error post-detail:", error.response?.data || error.message);
    }
  }, [activePostId, setPosts]);

  useEffect(() => {
    if (activePostId !== null) {
      getComments();
    }
  }, [activePostId, getComments]);

  //-----------------

  const instructordetails = async () => {
    if (selectedCourse === null) return;
    try {
      const response = await axios.post("http://127.0.0.1:8000/instructor-details", {
        course_id: selectedCourse.course_id
      });
      setInstructor(response.data);
      getPosts();

    } catch (error) {
      console.error("Error instructor-details:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    instructordetails();
  }, []);

  //-----------

  const removePostDB = async (p_id) => {
    if (selectedCommunity !== null) {
      removeAnnouncementDB(p_id);
      return;
    }
    try {
      await axios.post("http://127.0.0.1:8000/remove-post", {
        post_id: p_id
      });
      getPosts();

    } catch (error) {
      console.error("Error remove-post:", error.message);
    }
  };

  //-----------

  const removeAnnouncementDB = async (p_id) => {
    try {
      await axios.post("http://127.0.0.1:8000/delete-announcement", {
        announcement_id: p_id
      });
      getCommunityAnnouncements();

    } catch (error) {
      console.error("Error fetching delete-announcement:", error.message);
    }
  };

  //-----------------

  const addPostDB = async () => {
    if (selectedCommunity) {
      addAnnounceDB();
      return;
    }

    if (content.trim() === "" || description.trim() === "") return;
    try {
      await axios.post("http://127.0.0.1:8000/create-post", {
        user_id: currentUser.id,
        course_id: selectedCourse.course_id,
        header: description.toString(),
        post_description: content.toString(),
        is_official: currentUser.role === "Admin"
      });
      getPosts();
      setContent("");
      setDescription("");
      setIsModalOpen(false);

    } catch (error) {
      console.error("Error create-post:", error.message);
    }
  };

  //-----------------

  const addAnnounceDB = async () => {
    if (content.trim() === "" || description.trim() === "") return;
    console.log(selectedCommunity.community_id);
    console.log(description.toString());
    console.log(content.toString());
    try {
      await axios.post("http://127.0.0.1:8000/create-announcement", {
        owner_community_id: selectedCommunity.community_id,
        announcement_description: content.toString(),
        header: description.toString(),
      });
      getCommunityAnnouncements();
      setContent("");
      setDescription("");
      setIsModalOpen(false);

    } catch (error) {
      console.error("Error create-announcement:", error.message);
    }
  };

  //-----------------

  const getLikesDB = useCallback(async () => {
    if (selectedCommunity?.community_id) return;
    try {
      // Create an array of API requests for each post
      const requests = posts.map(post =>
        axios.post("http://127.0.0.1:8000/list-likes", { post_id: post.id })
      );

      const responses = await Promise.all(requests);

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          const response = responses.find((res) => res.data.post_id === post.id);
          if (response) {
            post.likes = response.data.likes;
          }
          if (post.likes.some(like => like.user_id === currentUser.id)) {
            post.isLiked = true;
          }

          return post;
        })
      );
    } catch (error) {
      console.error("Error list-likes:", error.message);
    }
  }, [posts.length]);

  useEffect(() => {
    getLikesDB();
  }, [getLikesDB]);



  //--------------

  const sendUndoLikesDB = async (p_id) => {
    try {
      await axios.post("http://127.0.0.1:8000/remove-like", {
        user_id: currentUser.id,
        post_id: p_id
      });

    } catch (error) {
      console.error("Error remove-like:", error.message);
    }
  };

  //-------------

  const sendLikesDB = async (p_id) => {
    try {
      await axios.post("http://127.0.0.1:8000/like-post", {
        post_id: p_id,
        user_id: currentUser.id
      });

    } catch (error) {
      console.error("Error like-post:", error.message);
    }
  };

  //-------------

  const getOfficialPosts = useCallback(async () => {
    if (selectedCourse?.course_id || selectedCommunity?.community_id) return;
    try {
      const response = await axios.get("http://127.0.0.1:8000/official-posts");

      const newPosts = response.data.map((post) => ({
        id: post.post_id,
        author: post.owner.username,
        avatar: <Avatar src={post.profile_photo_path} alt={post.owner.username} />,
        content: post.header,
        isPost: true,
        description: post.post_description,
        time: new Date(post.created_at),
        likes: [],
        isLiked: false,
        comments: [],
      }));

      setPosts([...newPosts.reverse()]);
    } catch (error) {
      console.error("Error official-posts:", error.response?.data || error.message);
    }
  }, [selectedCourse, currentUser]);


  useEffect(() => {
    getOfficialPosts();
  }, [getOfficialPosts]);

  //-------------

  const getCommunityAnnouncements = useCallback(async () => {
    if (!selectedCommunity?.community_id) return;
    try {
      const response = await axios.post("http://127.0.0.1:8000/community-announcements", {
        "community_id": selectedCommunity.community_id
      });

      const announcements = response.data.announcements.map((announce) => ({
        id: announce.announcement_id,
        author: response.data.community_head,
        avatar: <Avatar src={announce.profile_photo_path} alt={response.data.community_head} />,
        content: announce.header,
        isPost: false,
        description: announce.annoucement_description,
        time: new Date(announce.created_at),
        likes: [],
        isLiked: false,
        comments: [],
      }));

      setPosts([...announcements.reverse()]);


    } catch (error) {
      console.error("Error community-announcements:", error.response?.data || error.message);
    }
  }, [selectedCommunity, currentUser]);

  useEffect(() => {
    getCommunityAnnouncements();
  }, [getCommunityAnnouncements]);

  //------------------------

  const getPosts = useCallback(async () => {
    if (!selectedCourse?.course_id) return;
    try {
      const response = await axios.post("http://127.0.0.1:8000/course", {
        course_id: selectedCourse.course_id,
      });

      const newPosts = response.data.posts.map((post) => ({
        id: post.post_id,
        author: post.owner_username,
        avatar: <Avatar src={post.profile_photo_path} alt={post.owner_username} />,
        content: post.header,
        isPost: true,
        description: post.post_description,
        time: new Date(post.created_at),
        likes: [],
        isLiked: false,
        comments: [],
      }));

      setPosts([...newPosts.reverse()]);
    } catch (error) {
      console.error("Error course:", error.response?.data || error.message);
    }
  }, [selectedCourse, currentUser]);


  useEffect(() => {
    getPosts();
  }, [getPosts]);

  //------------------------


  const addCommentDB = async () => {
    if (commentContent.trim() === "") return;
    try {
      await axios.post("http://127.0.0.1:8000/create-comment", {
        user_id: currentUser.id,
        post_id: activePostId,
        context: commentContent
      });

      getComments();

    } catch (error) {
      console.error("Error create-comment:", error.message);
    }

  };

  const addComment = () => {
    addCommentDB();
  };

  const toggleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {

          if (post.isLiked) {
            post.likes = post.likes.filter(
              (like) => like.user_name !== currentUser.username
            );
            sendUndoLikesDB(postId);
          } else {
            post.likes.unshift({ user_name: currentUser.username });
            sendLikesDB(postId);
          }
          post.isLiked = !post.isLiked;
        }
        return post;
      })
    );
  };


  const filteredPosts = posts.filter((post) => {
    if (searchType === "author") {
      return post.author.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (searchType === "header") {
      return post.content.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      return (
        post.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  });

  const selectednull = () => {
    setSelectedCourse(null);
    setselectedCommunity(null);
    window.location = "/home";
  };

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  const deletePost = (postId) => {
    removePostDB(postId);
  };

  const listMembers = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/list-community-members", {
        community_id: selectedCommunity.community_id
      });
      setMembers(response.data.members);

    } catch (error) {
      console.error("Error list-community-members:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (selectedCommunity !== null)
      listMembers();
  }, []);

  const leaveCourse = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/withdraw-course", {
        user_id: currentUser.id,
        course_id: selectedCourse.course_id
      });
      setSelectedCourse(null);
      navigate("/home");

    } catch (error) {
      console.error("Error withdraw-course:", error.message);
    }
  };

  const leaveCommunity = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/withdraw-community", {
        user_id: currentUser.id,
        community_id: selectedCommunity.community_id
      });
      setselectedCommunity(null);
      navigate("/home");

    } catch (error) {
      console.error("Error withdraw-community:", error.message);
    }
  };

  const formatText = (text) => {
    return text.split('\n').map((item, index) => (
      <span key={index}>
        {item}
        <br />
      </span>
    ));
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
          <img src={logo512} alt="logo512" width="50" height="50" onClick={selectednull} style={{ cursor: "pointer" }} />
          <Typography
            variant="h6"
            className="header-title"
            onClick={selectednull}
          >
            TOBB ETU
          </Typography>
          <Box display="flex" alignItems="center" gap={2} flexGrow={1} justifyContent={"center"}>
            {selectedCourse != null && (
              <Typography variant="h6" className="header-course-name" style={{ marginLeft: 8 }}>
                {selectedCourse.course_code} - {selectedCourse.course_name}
              </Typography>
            )}
            {selectedCommunity != null && (
              <Typography variant="h6" className="header-course-name" style={{ marginLeft: 8 }}>
                {selectedCommunity.community_name}
              </Typography>
            )}

            <TextField
              className="search"
              variant="outlined"
              size="small"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FormControl variant="outlined" size="small">
              <Select
                className="search"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="author">Author</MenuItem>
                <MenuItem value="header">Header</MenuItem>
              </Select>
            </FormControl>
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
          {/* Logout Butonu */}
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
              <Button onClick={() => setOpenLogoutModal(false)} color="#1C2833">
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
      </AppBar>

      <div className="container">
        <div className="sidebar-left">
          {selectedCourse !== null && (
            <Box sx={{ padding: 3, border: "1px solid #ccc", borderRadius: 2, boxShadow: 2 }}>
              <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                Instructor Information
              </Typography>

              {selectedCourse ? (
                <div>
                  <Avatar
                    sx={{
                      margin: "auto",
                      width: 100,
                      height: 100,
                      border: "4px solid #1C2833", // Green border around the avatar
                      boxShadow: 3
                    }}
                  >
                    {instructor.avatar}
                  </Avatar>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "left", padding: 2 }}>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#1C2833' }}>
                      <strong>Name:</strong> {instructor.first_name} {instructor.last_name}
                    </Typography>

                    <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#1C2833', wordBreak: 'break-word' }}>
                      <strong>Email:</strong>
                      <a
                        href={`mailto:${instructor.email}`}
                        style={{
                          textDecoration: 'none',
                          color: '#566573',
                          fontWeight: 'bold',
                          wordBreak: 'break-word', // Prevents text overflow and breaks the word if needed
                          overflow: 'hidden', // Optional, hides overflowing text
                          textOverflow: 'ellipsis' // Optional, adds ellipsis if text is too long
                        }}
                      >
                        {instructor.email}
                        <ContactMailIcon sx={{ marginLeft: 1, verticalAlign: 'middle' }} />
                      </a>
                    </Typography>


                    <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#1C2833' }}>
                      <strong>Department:</strong> {instructor.department}
                    </Typography>

                    <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#1C2833' }}>
                      <strong>Room:</strong> {instructor.room}
                    </Typography>

                    <Typography variant="body1" sx={{ fontSize: '1.1rem', color: '#1C2833' }}>
                      <strong>Phone:</strong> {instructor.room_phone_number}
                    </Typography>
                  </Box>
                </div>
              ) : (
                <Typography variant="body2" color="textSecondary" align="center" sx={{ padding: 2 }}>
                  No instructor information available.
                </Typography>
              )}

              <Box sx={{ textAlign: "center", marginTop: 3 }}>
                <Button
                  variant="contained"
                  onClick={leaveCourse}
                  sx={{
                    padding: "10px 20px",
                    fontWeight: 'bold',
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: '#1C2833', // Set the background color here in sx
                    '&:hover': { backgroundColor: '#566573' } // Hover effect for the button
                  }}
                >
                  Leave Course
                </Button>
              </Box>
            </Box>
          )}



          {selectedCommunity !== null && (
            <Box sx={{ border: "1px solid #ccc", borderRadius: 2, padding: 2, backgroundColor: '#f4f6f8' }}>
              <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 2, color: '#1C2833', fontWeight: 'bold' }}>
                Members
              </Typography>
              <List sx={{ padding: 0 }}>
                {members.map((member) => (
                  <ListItem
                    key={member.id}
                    sx={{
                      borderBottom: '1px solid #ddd',
                      paddingY: 1,
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover': { backgroundColor: '#f0f0f0' } // Hover effect for list items
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      {/* Avatar or user profile picture */}
                      <Avatar sx={{ width: 40, height: 40, marginRight: 2 }}>
                        {member.username[0]} {/* Display the first letter of the username */}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#555' }}>
                          {member.username}
                        </Typography>
                      </Box>
                      {/* Optionally, add icons or other content */}
                    </Box>
                  </ListItem>
                ))}
              </List>
              <Box sx={{ textAlign: "center", marginTop: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#1C2833',
                    padding: '10px 20px',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    boxShadow: 3,
                    '&:hover': { backgroundColor: '#566573' } // Hover effect for the button
                  }}
                  onClick={leaveCommunity}
                >
                  Leave Community
                </Button>
              </Box>
            </Box>
          )}


        </div>
        <div className="post-container">
          {(selectedCourse !== null || currentUser.role === "Admin" || selectedCommunity?.user_role === "head") && (
            <Fab
              color="primary"
              aria-label="add"
              onClick={() => setIsModalOpen(true)}
              className="createpost-button"
            >
              <AddIcon />
            </Fab>
          )}

          {filteredPosts.length === 0 ? (
            <Typography color="text.secondary" textAlign="center">
              No posts found.
            </Typography>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id} variant="outlined" className="post-card">
                <CardHeader
                  avatar={<Avatar>{post.avatar}</Avatar>}
                  title={
                    <Box>
                      <Typography variant="h6">{post.author}</Typography>
                    </Box>
                  }
                  subheader={`Posted ${formatDistanceToNow(post.time, { addSuffix: true })}`}
                  action={
                    post.author === currentUser.username && (
                      <IconButton
                        sx={{ color: '#1C2833' }} // Change icon color
                        onClick={() => setDeletePostId(post.id)}
                      >
                        <DeleteIcon />
                      </IconButton>

                    )
                  }
                />
                <CardContent>
                  <Typography variant="h6">{post.content}</Typography>
                  <Typography>{formatText(post.description)}</Typography>
                  {selectedCommunity === null && (<Box className="post-actions">

                    <Box className="like-group" display="flex" alignItems="center" sx={{ color: '#1C2833' }}>
                      <IconButton
                        color="primary"
                        onClick={() => toggleLike(post.id)}
                        sx={{ color: post.isLiked ? '#1C2833' : '#1C2833' }} // Change color based on like status
                      >
                        {post.isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                      </IconButton>
                      <Typography sx={{ color: '#1C2833s', fontWeight: 'bold', marginLeft: 1 }}>
                        {post.likes.length} Likes
                      </Typography>
                    </Box>


                    <Box className="comment-group" display="flex" alignItems="center">
                      <IconButton
                        color="primary"
                        onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                        sx={{ color: '#1C2833' }} // Set IconButton color to #1C2833
                      >
                        <CommentIcon />
                      </IconButton>
                      <Typography sx={{ color: '#1C2833', fontWeight: 'bold', marginLeft: 1 }}>
                        Comments
                      </Typography>
                    </Box>


                    <Box className="comment-group" display="flex" alignItems="center">
                      <IconButton
                        sx={{ color: '#1C2833' }} // Change the color to #1C2833
                        onClick={() => setlikesPostId(likesPostId === post.id ? null : post.id)}
                      >
                        <ThumbUpIcon />
                      </IconButton>

                    </Box>

                  </Box>)}

                  {likesPostId === post.id && (
                    <Box className="likes-container">
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6">Likes</Typography>
                        <IconButton onClick={() => setlikesPostId(null)}>
                          <CloseIcon />
                        </IconButton>
                      </Box>
                      <Box className="likes-list">
                        {post.likes.length === 0 ? (
                          <Typography color="text.secondary">No Likes yet.</Typography>
                        ) : (
                          post.likes.map((like, index) => (
                            <Box
                              key={index}
                              className="comment-item"
                              display="flex"
                              alignItems="center"
                            >
                              <Avatar
                                style={{
                                  backgroundColor: "#1C2833",
                                  marginRight: "10px",
                                }}
                              >
                                {like.user_name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography fontWeight="bold">{like.user_name}</Typography>
                              </Box>
                            </Box>
                          ))
                        )}
                      </Box>
                    </Box>)}

                  {activePostId === post.id && (
                    <Box className="comments-container">
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6">Comments</Typography>
                        <IconButton onClick={() => setActivePostId(null)}>
                          <CloseIcon />
                        </IconButton>
                      </Box>
                      <Box className="comments-list">
                        {post.comments.length === 0 ? (
                          <Typography color="text.secondary">No comments yet.</Typography>
                        ) : (
                          post.comments.map((comment, index) => (
                            <Box
                              key={index}
                              className="comment-item"
                              display="flex"
                              alignItems="center"
                            >
                              <Avatar
                                style={{
                                  backgroundColor: "#1C2833",
                                  marginRight: "10px",
                                }}
                              >
                                {comment.author.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography fontWeight="bold">{comment.author}</Typography>
                                <Typography variant="body2">{comment.content}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {formatDistanceToNow(new Date(comment.time), { addSuffix: true })}
                                </Typography>
                              </Box>
                            </Box>
                          ))
                        )}
                      </Box>
                      <Box className="comment-input">
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Write a comment..."
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                        />
                        <Button variant="contained" color="primary" onClick={() => addComment()}>
                          Add
                        </Button>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <div className="sidebar-right">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ border: "1px solid #ccc", borderRadius: 2 }}>
              <Typography align="center" marginTop={2}>
                Calendar
              </Typography>
              <DateCalendar />
            </Box>
          </LocalizationProvider>
        </div>
      </div>
      {/* Sol Drawer (Navigasyon Çubuğu) */}
      <Drawer open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          style={{ width: 250 }}
        >
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ListItem
              button
              onClick={() => (window.location = "/enrollcourse")}
              sx={{
                padding: 2,
                borderRadius: 2,
                backgroundColor: '#1C2833',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#2C3E50',
                  transform: 'scale(1.05)', // Hover effect to slightly enlarge the item
                },
                boxShadow: 2,
                transition: 'all 0.3s ease',
              }}
            >
              <ListItemIcon>
                <EnrollmentIcon sx={{ color: 'white' }} /> {/* Icon */}
              </ListItemIcon>
              <ListItemText
                primary="Enroll Course"
                sx={{ fontWeight: 'bold', color: 'white' }}
              />
            </ListItem>
            <ListItem
              button
              onClick={() => (window.location = "/enrollcommunity")}
              sx={{
                padding: 2,
                borderRadius: 2,
                backgroundColor: '#1C2833',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#2C3E50',
                  transform: 'scale(1.05)',
                },
                boxShadow: 2,
                transition: 'all 0.3s ease',
              }}
            >
              <ListItemIcon>
                <CommunityIcon sx={{ color: 'white' }} /> {/* Icon */}
              </ListItemIcon>
              <ListItemText
                primary="Join Community"
                sx={{ fontWeight: 'bold', color: 'white' }}
              />
            </ListItem>
            <ListItem
              button
              onClick={() => (window.location = "/reservefacility")}
              sx={{
                padding: 2,
                borderRadius: 2,
                backgroundColor: '#1C2833',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#2C3E50',
                  transform: 'scale(1.05)',
                },
                boxShadow: 2,
                transition: 'all 0.3s ease',
              }}
            >
              <ListItemIcon>
                <ReserveIcon sx={{ color: 'white' }} /> {/* Icon */}
              </ListItemIcon>
              <ListItemText
                primary="Reserve Facility"
                sx={{ fontWeight: 'bold', color: 'white' }}
              />
            </ListItem>
          </List>

        </Box>
      </Drawer>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="create-post-modal"
        aria-describedby="create-post-modal-description"
      >
        <Box className="modal-box">
          <Typography variant="h6">Create a Post</Typography>
          <TextField
            fullWidth
            placeholder="Post Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Box className="modal-actions">
            <button className="submit-button" onClick={addPostDB}>
              Post
            </button>
            <button className="cancel-button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={deletePostId !== null}
        onClose={() => setDeletePostId(null)}
        aria-labelledby="delete-post-modal"
        aria-describedby="delete-post-modal-description"
      >
        <Box className="modal-box">
          <Typography variant="h6" id="delete-post-modal">
            Confirm Delete
          </Typography>
          <Typography id="delete-post-modal-description">
            Are you sure you want to delete this post? This action cannot be undone.
          </Typography>
          <Box className="modal-actions">
            <button
              className="cancel-button"
              onClick={() => setDeletePostId(null)}
            >
              Cancel
            </button>
            <button
              className="delete-button"
              onClick={handleDelete}
            >
              Delete
            </button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="create-post-modal"
        aria-describedby="create-post-modal-description"
      >
        <Box className="modal-box">
          <Typography variant="h6">Create a Post</Typography>
          <TextField
            fullWidth
            placeholder="Post Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Box className="modal-actions">
            <button className="submit-button" onClick={addPostDB}>
              Post
            </button>
            <button className="cancel-button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Home;
