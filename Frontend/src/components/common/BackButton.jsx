import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/common.css";

const BackButton = ({ label = "Back to Dashboard", path = "/dashboard" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <motion.button
      className="btn-back-dashboard"
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Home size={18} />
      <span>{label}</span>
    </motion.button>
  );
};

export default BackButton;