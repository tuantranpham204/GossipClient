import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import SearchPage from './pages/SearchPage'
import ProfilePage from './pages/ProfilePage'
import UserRelationPage from './pages/UserRelationPage'
import './App.css'
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/messages" element={<HomePage />} />
        <Route path="/friends" element={<UserRelationPage />} />
        <Route path="/follows" element={<UserRelationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
} 

export default App
