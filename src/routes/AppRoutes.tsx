
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Profile from "../pages/Profile";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/" element={<Navigate to="/register" replace />} />
<Route path="/home" element={<Home />} />
<Route path="/profile" element={<Profile />} />
<Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
