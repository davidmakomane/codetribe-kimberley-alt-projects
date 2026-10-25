
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAppSelector } from "../app/hooks";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import ShoppingListDetails from "../pages/ShoppingListDetails";

function ProtectedRoute() {
  const user = useAppSelector((state) => state.auth.user);

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

function GuestRoute() {
  const user = useAppSelector((state) => state.auth.user);
  return user ? <Navigate to="/home" replace /> : <Outlet />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/shared/:listId" element={<ShoppingListDetails />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/lists/:listId"
            element={<ShoppingListDetails />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
