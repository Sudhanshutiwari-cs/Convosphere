# ConvoSphere

ConvoSphere is a social media platform that allows users to share posts, follow other users, like and comment on posts, and chat in real-time. The project is built using a MERN stack (MongoDB, Express, React, Node.js) and includes features such as user authentication, profile management, and real-time notifications.

## Features

- **User Authentication**: Register and login with secure password hashing and JWT-based authentication.
- **Profile Management**: Edit profile details including username, bio, and profile picture.
- **Post Creation**: Create new posts with captions and images, optimized using Sharp and uploaded to Cloudinary.
- **Like and Comment**: Like and comment on posts with real-time updates using Socket.io.
- **Follow/Unfollow Users**: Follow and unfollow other users to see their posts in your feed.
- **Bookmarks**: Bookmark posts to save them for later.
- **Real-time Chat**: Send and receive messages in real-time with other users.
- **Notifications**: Receive real-time notifications for likes and comments on your posts.
- **Suggested Users**: Get suggestions for users to follow based on your current connections.

## Technologies Used

- **Frontend**: React, Redux, Tailwind CSS, Axios, Socket.io-client
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt, Multer, Sharp, Cloudinary, Socket.io
- **Dev Tools**: Vite, ESLint, Nodemon

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/ConvoSphere.git
   cd ConvoSphere