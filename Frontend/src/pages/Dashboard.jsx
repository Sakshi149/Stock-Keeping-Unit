//   import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import Topbar from "../components/Dashboard/Topbar";
// import { toast } from "react-toastify";
// import "../styles/dashboard.css";

// import welcome from "../assets/Welcome.png";
// import CategoryIcon from "../assets/Category.png"; 
// import Item from "../assets/Item.png";

// const Dashboard = () => {
//   const navigate = useNavigate();

//   return (
//     <motion.div
//       className="dashboard-layout"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//     >
//       <div className="dashboard-main">
//         <Topbar />

//         {/* ✅ Welcome */}
//         <motion.div
//           className="welcome-card"
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//         >
//           <img src={welcome} alt="Welcome" className="welcome-image" />

//           <div className="welcome-card-content">
//             <h2>Welcome to SKU Code Generator!</h2>
//             <p>Generate, manage, and organize item codes effortlessly.</p>
//           </div>
//         </motion.div>

//         {/* ✅ Only 2 Buttons */}
//         <motion.div
//           className="action-buttons"
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//         >
//           <motion.button
//             className="primary-btn"
//             onClick={() => navigate("/create-category")}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <img src={CategoryIcon} className="action-btn-icon" />
//             Create Category
//           </motion.button>

//           <motion.button
//             className="secondary-btn"
//             onClick={() => navigate("/create-item")}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <img src={Item} className="action-btn-icon" />
//             Create Item
//           </motion.button>
//         </motion.div>

//         {/* ✅ Only 2 Cards */}
//         <motion.div
//           className="stats-grid"
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//         >
//           <div className="stat-card"  onClick={() => navigate("/categories")}
//       style={{ cursor: "pointer" }}>
//             <h4>CATEGORIES</h4>
//       <h1>{categories.length}</h1>
//           </div>

//           <div className="stat-card">
//             <h4>ITEMS</h4>
//             <h2>0</h2>
//           </div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default Dashboard;

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react"; // ✅ ADD THIS
import Topbar from "../components/Dashboard/Topbar";
import "../styles/dashboard.css";

import welcome from "../assets/Welcome.png";
import CategoryIcon from "../assets/Category.png"; 
import Item from "../assets/Item.png";

const Dashboard = () => {
  const navigate = useNavigate();

  // ✅ ADD STATE
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  // ✅ FETCH DATA
  useEffect(() => {
  fetch("http://localhost:5001/api/categories", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
  console.log("Dashboard API:", data);

  setCategories(data.data || []);
})
  .catch((err) => console.error(err));

  fetch("http://localhost:5001/api/items", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
    setItems(data.data || []);
  })
  .catch((err) => console.error(err));
}, []);

  return (
    <motion.div
      className="dashboard-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="dashboard-main">
        <Topbar />

        {/* ✅ Welcome */}
        <motion.div
          className="welcome-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <img src={welcome} alt="Welcome" className="welcome-image" />

          <div className="welcome-card-content">
            <h2>Welcome to SKU Code Generator!</h2>
            <p>Generate, manage, and organize item codes effortlessly.</p>
          </div>
        </motion.div>

        {/* ✅ Buttons */}
        <motion.div className="action-buttons">
          <motion.button
            className="primary-btn"
            onClick={() => navigate("/create-category")}
          >
            <img src={CategoryIcon} className="action-btn-icon" />
            Create Category
          </motion.button>

          <motion.button
            className="secondary-btn"
            onClick={() => navigate("/create-item")}
          >
            <img src={Item} className="action-btn-icon" />
            Create Item
          </motion.button>
        </motion.div>

        {/* ✅ Cards */}
        <motion.div className="stats-grid">
          <div
            className="stat-card"
            onClick={() => navigate("/categories")}
            style={{ cursor: "pointer" }}
          >
            <h4>CATEGORIES</h4>
            <h1>{categories.length}</h1> {/* ✅ FIXED */}
          </div>

          <div
            className="stat-card"
            onClick={() => navigate("/items")}
            style={{ cursor: "pointer" }}
          >
            <h4>ITEMS</h4>
            <h1>{items.length}</h1> {/* ✅ FIXED */}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;