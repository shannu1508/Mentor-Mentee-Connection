import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/signup';
import Login from './pages/login';
import Home from './pages/home';
import FindMentor from './pages/findmentor';
import InfoBox from './pages/InfoBox';
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/find-mentor" element={<FindMentor />} />
        <Route path="/aichat" element={<InfoBox />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </Router>
  );
}

export default App;
