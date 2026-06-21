import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "../components/common/BackButton";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/itemsPage.css";
import { useNavigate } from "react-router-dom";

const ItemsPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const fetchItems = async (categoryId = "ALL") => {
    setLoading(true);

    try {
      const token = localStorage.getItem("jwtToken");

      let url = "http://localhost:5001/api/items";

      if (categoryId !== "ALL") {
        url += `?categoryId=${categoryId}`;
      }

      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        throw new Error("Failed to fetch items");
      }

      const data = await res.json();

      console.log("ITEM PAGE:", data);

      const itemArray = Array.isArray(data) ? data : data.data || [];

      setItems(itemArray);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/categories");

      const data = await res.json();

      const categoryArray = Array.isArray(data) ? data : data.data || [];

      setCategories(categoryArray);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const handleRefresh = () => {
    fetchItems(selectedCategory);
  };

  const handleCategoryFilter = async (value) => {
    setSelectedCategory(value);
    await fetchItems(value);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("jwtToken");

      const res = await fetch(`http://localhost:5001/api/items/${id}`, {
        method: "DELETE",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Delete failed");
      }

      alert("✅ Item deleted successfully");

      fetchItems(selectedCategory);
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    }
  };

  const handleEdit = (item) => {
    navigate(`/items/edit/${item.id}`);
  };

  const exportExcel = () => {
    const exportData = items.map((item, index) => ({
      SrNo: index + 1,
      SKU: item.code || item.sku,
      Category: item.category?.name || item.category || "N/A",
      Description: item.description || "N/A",
      Rate:
        item.rate !== null && item.rate !== undefined
          ? `₹ ${item.rate}`
          : "N/A",
      Fields: Object.entries(item.fields || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(", "),
      CreatedAt: new Date(item.createdAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Items");

    XLSX.writeFile(workbook, "items.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Items Report", 14, 20);

    const tableColumn = [
      "Sr No",
      "SKU",
      "Category",
      "Description",
      "Rate",
      "Fields",
      "Created Date",
    ];

    const tableRows = items.map((item, index) => [
      index + 1,
      item.code || item.sku,
      item.category?.name || "N/A",
      item.description || "N/A",
      item.rate !== null && item.rate !== undefined ? `₹ ${item.rate}` : "N/A",
      Object.entries(item.fields || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(", "),
      new Date(item.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("items.pdf");
  };

  return (
    <motion.div
      className="items-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <BackButton label="Back to Dashboard" path="/dashboard" />

      <div className="items-container">
        {/* Header */}
        <div className="items-header">
          <h1 className="items-title">All Items</h1>
        </div>

        <div className="items-stats">
          <div className="items-count">
            <span className="items-count-label">Total Items</span>

            <span className="items-count-number">{items.length}</span>
          </div>

          <select
            className="item-filter-dropdown"
            value={selectedCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* <button className="items-refresh-btn" onClick={handleRefresh}>
            ↻ Refresh
          </button> */}

          <div className="top-actions">
            <div className="export-dropdown">
              <button
                className="export-btn"
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                📤 Export
              </button>

              {showExportMenu && (
                <div className="export-menu">
                  <button
                    className="export-menu-item"
                    onClick={() => {
                      exportExcel();
                      setShowExportMenu(false);
                    }}
                  >
                    📊 Export to Excel
                  </button>

                  <button
                    className="export-menu-item"
                    onClick={() => {
                      exportPDF();
                      setShowExportMenu(false);
                    }}
                  >
                    📄 Export to PDF
                  </button>
                </div>
              )}
            </div>

            <button className="items-refresh-btn" onClick={handleRefresh}>
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="items-loading">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="items-empty">
            <div className="empty-icon">📦</div>
            <h3 className="empty-title">No Items Found</h3>
            <p className="empty-subtitle">Create items to see them here</p>
          </div>
        ) : (
          <div className="items-grid">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id || item.code}
                  className="item-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  {/* Card Header */}
                  <div className="item-card-header">
                    <h3 className="item-name">
                      {item.code || item.sku || "N/A"}
                    </h3>
                    <span className="item-category-badge">
                      {item.category?.name || "Uncategorized"}
                    </span>
                  </div>

                  {/* Item Info */}
                  {/* <div className="item-info">
                    <div className="item-info-item">
                      <div className="item-info-icon">🆔</div>
                      <div className="item-info-text">
                        <div className="item-info-label">ID</div>
                        <div className="item-info-value item-id">{item.id}</div>
                      </div>
                    </div>
                  </div> */}

                  {/* SKU Section */}
                  {(item.code || item.sku) && (
                    <div className="item-sku-section">
                      <span className="sku-label">SKU</span>

                      <div className="sku-copy-wrapper">
                        <div className="sku-value">{item.code || item.sku}</div>

                        <button
                          className="copy-btn"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              item.code || item.sku,
                            );

                            alert("SKU copied!");
                          }}
                        >
                          📋 Copy
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Fields Section */}
                  {item.fields && Object.keys(item.fields).length > 0 && (
                    <div className="item-fields">
                      <div className="fields-label">
                        📋 Fields ({Object.keys(item.fields).length})
                      </div>
                      <div className="fields-list">
                        {Object.entries(item.fields)
                          .slice(0, 2)
                          .map(([key, value]) => (
                            <div key={key} className="field-item">
                              <span className="field-key">{key}:</span>
                              <span className="field-value">
                                {value || "N/A"}
                              </span>{" "}
                            </div>
                          ))}
                      </div>
                      <button
                        className="read-more-btn"
                        onClick={() => setSelectedItem(item)}
                      >
                        Read More
                      </button>
                    </div>
                  )}

                  {/* Date Created */}
                  {item.createdAt && (
                    <div className="item-date">
                      <span className="date-icon">📅</span>
                      <span className="date-text">
                        Created: {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {/* ACTION BUTTONS */}
                  <div className="item-actions">
                    <button
                      className="item-edit-btn"
                      onClick={() => handleEdit(item)}
                    >
                      ✏ Edit
                    </button>

                    <button
                      className="item-delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      {/* READ MORE MODAL */}

      {selectedItem && (
        <div
          className="item-modal-overlay"
          onClick={() => setSelectedItem(null)}
        >
          <div className="item-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedItem.code}</h2>

              <button
                className="modal-close-btn"
                onClick={() => setSelectedItem(null)}
              >
                ✖
              </button>
            </div>

            <div className="modal-category">{selectedItem.category?.name}</div>

            {/* SKU */}

            <div className="modal-sku-section">
              <span className="sku-label">SKU</span>

              <div className="sku-copy-wrapper">
                <div className="sku-value">{selectedItem.code}</div>

                <button
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedItem.code);

                    alert("SKU copied!");
                  }}
                >
                  📋 Copy
                </button>
              </div>
            </div>

            {/* ALL FIELDS */}

            <div className="modal-fields">
              {Object.entries(selectedItem.fields).map(([key, value]) => (
                <div key={key} className="field-item">
                  <span className="field-key">{key}:</span>

                  <span className="field-value">{value || "N/A"}</span>
                </div>
              ))}
            </div>

            {/* DESCRIPTION */}

            {selectedItem.description && (
              <div className="modal-description-section">
                <div className="fields-label">📝 Description</div>

                <div className="modal-description">
                  {selectedItem.description}
                </div>
              </div>
            )}

            {/* RATE */}

            {selectedItem.rate !== null && selectedItem.rate !== undefined && (
              <div className="modal-description-section">
                <div className="fields-label">💰 Rate</div>

                <div className="modal-description">₹ {selectedItem.rate}</div>
              </div>
            )}

            {/* DATE */}

            <div className="item-date">
              <span className="date-icon">📅</span>

              <span className="date-text">
                Created: {new Date(selectedItem.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ItemsPage;
