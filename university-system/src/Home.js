import React, { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  Modal,
  Box,
  Fab,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { formatDistanceToNow } from "date-fns";
import "./Home.css";

const default_user = {
  name: "Anonymous User",
  ID: "ID",
  department: "DepartmentName",
  profilePicture: "/path/to/profile.jpg",
  title: "Title",
};

const Home = () => {

  const [currentUser, setCurrentUser] = useState(default_user);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");

  useEffect(() => {
    const fetchUser = () => {
      setCurrentUser({
        name: "UserName",
        ID: "UserID",
        department: "DepartmentName",
        profilePicture: "/path/to/profile.jpg",
        title: "Title",
      });
    };
    fetchUser();
  }, []);

  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [activePostId, setActivePostId] = useState(null);

  console.log("currentUser:", currentUser);



  const addPost = () => {
    if (content.trim() === "" || description.trim() === "") return;
    const newPost = {
      id: posts.length + 1,
      author: currentUser.name,
      title: currentUser.title,
      avatar: <Avatar src={currentUser.profilePicture} alt={currentUser.name} />,
      content,
      description,
      time: new Date(),
      likes: 0,
      isLiked: false,
      comments: [],
    };
    setPosts([newPost, ...posts]);
    setContent("");
    setDescription("");
    setIsModalOpen(false);
  };

  const addComment = (postId) => {
    if (commentContent.trim() === "") return;
    const newComment = {
      author: currentUser.name,
      content: commentContent,
      time: new Date(),
    };

    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    );
    setPosts(updatedPosts);
    setCommentContent("");
  };

  const toggleLike = (postId) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked,
        }
        : post
    );
    setPosts(updatedPosts);
  };

  const filteredPosts = posts.filter((post) => {
    if (searchType === "author") {
      return post.author.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (searchType === "content") {
      return post.content.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      return (
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  });

  return (
    <div className="app-container">

      <header className="header">
        <Typography variant="h4" className="header-title" onClick={() => (window.location = "/")}>
          TOBB Media
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            className="search"
            variant="outlined"
            size="small"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flexGrow: 1 }}
          />
          <FormControl variant="outlined" size="small">
            <Select
              className="search"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="author">Author</MenuItem>
              <MenuItem value="content">Content</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Box>
            <Typography variant="body2">{`#${currentUser.ID}`}</Typography>
            <Typography variant="body2">{currentUser.title}</Typography>
          </Box>
          <Box>
            <Typography variant="h6" className="header-title">
              {currentUser.name}
            </Typography>
            <Typography variant="body2">{currentUser.department}</Typography>
          </Box>
          <Avatar
            src={currentUser.profilePicture}
            alt={currentUser.name}
            style={{ cursor: "pointer" }}
            onClick={() => (window.location = "/profile")}
          />
        </Box>
      </header>

      <div className="post-container">
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setIsModalOpen(true)}
          className="createpost-button"
        >
          <AddIcon />
        </Fab>
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
                    <Typography variant="body2" color="textSecondary">
                      {post.title}
                    </Typography>
                  </Box>
                }
                subheader={`Posted ${formatDistanceToNow(post.time, { addSuffix: true })}`}
              />
              <CardContent>
                <Typography variant="h6">{post.description}</Typography>
                <Typography>{post.content}</Typography>
                <Box className="post-actions">
                  <Box className="like-group" display="flex" alignItems="center">
                    <IconButton color="primary" onClick={() => toggleLike(post.id)}>
                      {post.isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                    </IconButton>
                    <Typography>{post.likes} Likes</Typography>
                  </Box>

                  <Box className="comment-group" display="flex" alignItems="center">
                    <IconButton
                      color="primary"
                      onClick={() =>
                        setActivePostId(activePostId === post.id ? null : post.id)
                      }
                    >
                      <CommentIcon />
                    </IconButton>
                    <Typography>{post.comments.length} Comments</Typography>
                  </Box>
                </Box>

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
                                backgroundColor: "#1976d2",
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
                      <Button variant="contained" color="primary" onClick={() => addComment(post.id)}>
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
            <button className="submit-button" onClick={addPost}>
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