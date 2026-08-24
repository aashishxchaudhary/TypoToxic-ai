import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import DashboardPage from "./pages/DashboardPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TrainingPage from "./pages/TrainingPage";

export default function App() {
  return <BrowserRouter><AuthProvider><div className="grid-bg min-h-screen"><Navbar/><Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/training" element={<TrainingPage/>}/><Route path="/dashboard" element={<ProtectedRoute><DashboardPage/></ProtectedRoute>}/></Routes></div></AuthProvider></BrowserRouter>;
}
