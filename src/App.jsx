import { Routes, Route } from 'react-router-dom';
import { APIProvider } from '@vis.gl/react-google-maps';
import { AuthProvider } from './lib/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import NewPost from './pages/NewPost';
import Browse from './pages/Browse';
import Auth from './pages/Auth';

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

export default function App() {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_KEY}>
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
    </APIProvider>
  );
}
