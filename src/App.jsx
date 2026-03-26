import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import NewPost from './pages/NewPost';
import Browse from './pages/Browse';
import Auth from './pages/Auth';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewPost />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/auth" element={<Auth />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
