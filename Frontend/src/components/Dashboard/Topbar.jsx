import { motion, AnimatePresence } from "framer-motion";
import AuthService from "../../services/AuthService";
import { useEffect, useState, useRef } from "react";
import "../../styles/dashboard.css";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (err) {
        console.error("Invalid user JSON in localStorage");
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  const displayName =
    user?.name || user?.fullName || user?.username || user?.email || "User";

  return (
    <motion.div
      className="topbar"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1>Dashboard Overview</h1>
      </div>

      <div className="topbar-right">
        <div className="admin-profile" ref={dropdownRef}>
          <motion.div
            className="avatar"
            onClick={() => setOpen(!open)}
            whileHover={{ scale: 1.05 }}
          >
            {displayName.charAt(0).toUpperCase()}
          </motion.div>

          <div>
            <strong>{displayName}</strong>
            <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
              SKU Generator Access{" "}
            </p>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                className="profile-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <button className="logout-btn-modern" onClick={handleLogout}>
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Topbar;
