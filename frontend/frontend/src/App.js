// src/App.js
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProfileComponent from './components/ProfileComponent/ProfileComponent.jsx';
import PostsComponent from './components/PostsComponent/PostsComponent';
import EditProfileComponent from './components/EditProfileComponent/EditProfileComponent.jsx'
import Login from './components/Login/login';
import PostDetailsComponent from './components/PostDetailsComponent/PostDetailsComponent.jsx';
import { AuthProvider } from './components/hooks/AuthProvider'

import DashBoard from './components/DashBoard/dashboard';
import AccountComponent from './components/AccountComponent/AccountComponent.jsx';
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<DashBoard />} />
            <Route path="/login" element={<Login />} />
            <Route path='/profile' element={<ProfileComponent />} />
            <Route path="/profile/posts" element={<PostsComponent />} />
            <Route path="/profile/edit" element={<EditProfileComponent />} />
            <Route path="/profile/posts/:postId" element={<PostDetailsComponent />} />
            <Route path="/profile/account" element={<AccountComponent />} />

          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
