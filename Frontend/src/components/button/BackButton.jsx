import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = ({ to = "/dashboard" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(to);
  };

  return (
    <button className="back-btn" onClick={handleBack}>
      <span className="back-icon"><FaArrowLeft /></span>
    </button>
  );
};

export default BackButton;