import { motion } from "framer-motion";
import "../../styles/dashboard.css";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";

const StatsCards = () => {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    workOrders: 0,
    customers: 0,
    items: 0,
    drafts: 0,
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const woRes = await AuthService.apiRequest("/api/work-orders");
      const woData = await woRes.json();

      const custRes = await AuthService.apiRequest("/api/customers");
      const custData = await custRes.json();

      const itemRes = await AuthService.apiRequest("/api/items");
      const itemData = await itemRes.json();

      const draftRes = await AuthService.apiRequest(
        "/api/work-orders?status=DRAFT",
      );
      const draftData = await draftRes.json();

      setCounts({
        workOrders: woData.total || 0,
        customers: custData.total || 0,
        items: itemData.total || 0,
        drafts: draftData.total || 0,
      });
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const stats = [
    {
      title: "My Work Orders",
      value: counts.workOrders,
      icon: "📋",
      route: "/work-orders",
    },
    {
      title: "Customers",
      value: counts.customers,
      icon: "👥",
      route: "/customers",
    },
    {
      title: "Items",
      value: counts.items,
      icon: "📦",
      route: "/items",
    },
    {
      title: "Draft Orders",
      value: counts.drafts,
      icon: "📝",
      route: "/drafts",
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          className="stat-card"
          onClick={() => navigate(stat.route)}
          style={{ cursor: "pointer" }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h4>{stat.title}</h4>
              <h2>{stat.value}</h2>
            </div>
            <div style={{ fontSize: "2rem" }}>{stat.icon}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;