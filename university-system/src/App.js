import React, { useState } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import CloseIcon from "@mui/icons-material/Close";
import "./App.css";

const App = () => {
  const [posts, setPosts] = useState([]); // List of posts
  const [content, setContent] = useState(""); // Content of the new post
  const [description, setDescription] = useState(""); // Description of the new post
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [commentContent, setCommentContent] = useState(""); // Comment content
  const [activePostId, setActivePostId] = useState(null); // Track active post for comments
  const [currentUser, setCurrentUser] = useState("Anonymous User"); // Simulated current user

  // Add a new post
  const addPost = () => {
    if (content.trim() === "" || description.trim() === "") return; // Prevent empty content or description
    const newPost = {
      id: posts.length + 1,
      author: "Lord of the SQL",
      avatar: <PersonIcon />, // Default profile icon
      content,
      description,
      time: new Date().toLocaleString(), // Add posting time
      likes: 0, // Initial likes
      isLiked: false, // Like status
      comments: [], // Comments array
    };
    setPosts([newPost, ...posts]);
    setContent("");
    setDescription("");
    setIsModalOpen(false);
  };

  // Add a comment to a post
  const addComment = (postId) => {
    if (commentContent.trim() === "") return; // Prevent empty comments
    const newComment = {
      author: currentUser, // Add the name of the commenter
      content: commentContent,
      time: new Date().toLocaleString(), // Timestamp for the comment
    };

    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    );
    setPosts(updatedPosts);
    setCommentContent(""); // Clear comment field
  };

  // Toggle likes
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

  return (
    <div className="app-container">
      {/* Fixed Header Section */}
      <header className="header">
        <Typography variant="h4" className="header-title">
          TOBB Media
        </Typography>
      </header>

      {/* Scrollable Posts Section */}
      <div className="post-container">
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setIsModalOpen(true)}
          className="createpost-button"
        >
          <AddIcon />
        </Fab>
        {posts.length === 0 ? (
          <Typography color="text.secondary" textAlign="center">
            No posts yet.
          </Typography>
        ) : (
          posts.map((post) => (
            <Card key={post.id} variant="outlined" className="post-card">
              <CardHeader
                avatar={<Avatar>{post.avatar}</Avatar>}
                title={post.author}
                subheader={`Posted at: ${post.time}`}
              />
              <CardContent>
                <Typography variant="h6">{post.description}</Typography>
                <Typography marginY={2}>{post.content}</Typography>
                <Box className="post-actions">
                  <Box className="like-group" display="flex" alignItems="center">
                    <IconButton
                      color="primary"
                      onClick={() => toggleLike(post.id)}
                    >
                      {post.isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                    </IconButton>
                    <Typography>{post.likes} Likes</Typography>
                  </Box>

                  <Box className="comment-group" display="flex" alignItems="center">
                    <IconButton
                      color="primary"
                      onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                    >
                      <CommentIcon />
                    </IconButton>
                    <Typography>{post.comments.length} Comments</Typography>
                  </Box>
                </Box>

                {/* Show comments only if active */}
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
                        <Typography color="text.secondary">
                          No comments yet.
                        </Typography>
                      ) : (
                        post.comments.map((comment, index) => (
                          <Box
                            key={index}
                            className="comment-item"
                            display="flex"
                            alignItems="center"
                            marginY={1}
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
                              <Typography fontWeight="bold">
                                {comment.author}
                              </Typography>
                              <Typography variant="body2">
                                {comment.content}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {comment.time}
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
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => addComment(post.id)}
                      >
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

      {/* Modal for Post Creation */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="create-post-modal"
        aria-describedby="create-post-modal-description"
      >
        <Box className="modal-box">
          <Typography variant="h6" marginBottom={2}>
            Create a Post
          </Typography>
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
            <button
              className="cancel-button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default App;
