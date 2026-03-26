import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NewPost from './pages/NewPost';
import Browse from './pages/Browse';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewPost />} />
        <Route path="/browse" element={<Browse />} />
      </Route>
    </Routes>
  );
}
