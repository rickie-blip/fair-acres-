import React, { useMemo, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import GuestComplaintPage from "./pages/GuestComplaintPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import StaffTasksPage from "./pages/StaffTasksPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import { BrowserRouter, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandingPage from "./pages/LandingPage";
import GMDashboard from "./pages/GMDashboard";
import AdminPanel from "./pages/AdminPanel";
import GuestFeedbackForm from "./pages/GuestFeedbackForm";
import ConfirmationScreen from "./pages/ConfirmationScreen";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      refetchInterval: 1000 * 60,
      retry: 2,
    },
  },
});

export default function App() {
  const q = useQuery();
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(() => localStorage.getItem("fa_token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("fa_user");
    return raw ? JSON.parse(raw) : null;
  });

  const logout = () => {
    localStorage.removeItem("fa_token");
    localStorage.removeItem("fa_user");
    setToken("");
    setUser(null);
    navigate("/login");
  };

  const isGuest = location.pathname === "/";
  const showLoginLink = !user && !isGuest;

  return (
    // <div className="container">
    //   <div className="row" style={{ marginBottom: 12 }}>
    //     <div className="col">
    //       <div style={{ fontWeight: 900, letterSpacing: 0.2 }}>Fair Acres</div>
    //       <div style={{ color: "var(--muted)", fontSize: 12 }}>
    //         {isGuest ? "Guest Services" : user ? `${user.role.toUpperCase()} portal` : "Staff/Management"}
    //       </div>
    //     </div>
    //     <div className="spacer" />
    //     {user ? (
    //       <button className="btn btn-danger" onClick={logout}>
    //         Sign out
    //       </button>
    //     ) : showLoginLink ? (
    //       <Link className="btn" to="/login">
    //         Login
    //       </Link>
    //     ) : null}
    //   </div>
    // </div>
    <QueryClientProvider client={queryClient}>
     
        <Routes>
          {/* <Route path="/" element={<GuestComplaintPage />} /> */}
          {/* Public guest routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/r/:roomNumber" element={<GuestFeedbackForm />} />
          <Route path="/confirmation" element={<ConfirmationScreen />} />

          {/* Staff / GM routes */}
          <Route path="/gm" element={<GMDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />

          <Route
            path="/login"
            element={
              <LoginPage
                onLogin={({ access_token, user: u }) => {
                  localStorage.setItem("fa_token", access_token);
                  localStorage.setItem("fa_user", JSON.stringify(u));
                  setToken(access_token);
                  setUser(u);
                  navigate(u.role === "admin" ? "/admin" : "/staff");
                }}
              />
            }
          />
          <Route
            path="/staff"
            element={<StaffTasksPage token={token} user={user} />}
          />
          <Route
            path="/admin"
            element={<AdminDashboardPage token={token} user={user} />}
          />
          <Route path="*" element={<div className="card">Not found</div>} />
        </Routes>
      
    </QueryClientProvider>
  );
}

