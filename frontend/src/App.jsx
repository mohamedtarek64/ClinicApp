import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppointmentProvider } from "./context/AppointmentContext.jsx"; 
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import RoleSelection from "./pages/RoleSelection";
import SignUp from "./pages/SignUp";
import DoctorSignUp from "./pages/DoctorSignUp";
import Home from "./pages/Home";
import PatientProfile from "./pages/PatientProfile";
import Settings from "./pages/Settings";
import AIChat from "./pages/AIChat";
import NewAnalysis from "./pages/NewAnalysis";
import BookAppointment from "./pages/BookAppointment";
// 1. استيراد صفحة الـ Schedule
import Schedule from "./pages/Schedule"; 

export default function App() {
  return (
    <AppointmentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/select-role" element={<RoleSelection />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/doctor-signup" element={<DoctorSignUp />} />
          
          <Route path="/home" element={<Home />} />
          <Route path="/patient-profile" element={<PatientProfile />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/new-analysis" element={<NewAnalysis />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          
          {/* 2. إضافة مسار الـ Schedule */}
          <Route path="/schedule" element={<Schedule />} />
          
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </AppointmentProvider>
  );
}