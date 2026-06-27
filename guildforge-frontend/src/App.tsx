import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/common/Navbar";
import { Admin } from "./pages/Admin";
import { Dashboard } from "./pages/Dashboard";
import { GuildBrowser } from "./pages/GuildBrowser";
import { GuildPage } from "./pages/GuildPage";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Signup } from "./pages/Signup";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/guilds" element={<GuildBrowser />} />
        <Route path="/guilds/:id" element={<GuildPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
