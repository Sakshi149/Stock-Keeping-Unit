import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "../components/common/BackButton";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/categoriesPage.css";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [selectedCategoryData, setSelectedCategoryData] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const fetchCategories = async (categoryName = "ALL") => {
    setLoading(true);

    try {
      let url = "https://api.skuoriginal.in/api/categories";

      if (categoryName !== "ALL") {
        url += `?name=${encodeURIComponent(categoryName)}`;
      }

      const token = localStorage.getItem("jwtToken");

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      const categoryArray = Array.isArray(data)
        ? data
        : data.data || data.categories || [];

      setCategories(categoryArray);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleRefresh = () => {
    fetchCategories(selectedCategory);
  };

  const handleCategoryFilter = async (value) => {
    setSelectedCategory(value);

    await fetchCategories(value);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const token = localStorage.getItem("jwtToken");

        const res = await fetch(
          `https://api.skuoriginal.in/api/categories/${id}`,
          {
            method: "DELETE",

            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
          },
        );

        if (res.ok) {
          alert("Category deleted successfully!");

          fetchCategories();
        } else {
          const errorData = await res.json();

          alert(errorData.message || "Failed to delete category");
        }
      } catch (err) {
        console.error(err);
        alert("Error deleting category");
      }
    }
  };

  const exportExcel = () => {
    const exportData = categories.map((cat, index) => ({
      SrNo: index + 1,
      Category: cat.name,
      SKU_Format: cat.codeFormat || "N/A",
      Fields: cat.fields?.map((f) => f.name).join(", "),
      Total_Fields: cat.fields?.length || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");

    XLSX.writeFile(workbook, "categories.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Categories Report", 14, 20);

    const tableColumn = [
      "Sr No",
      "Category",
      "SKU Format",
      "Fields",
      "Total Fields",
    ];

    const tableRows = categories.map((cat, index) => [
      index + 1,

      cat.name,

      cat.codeFormat || "N/A",

      cat.fields?.map((f) => f.name).join(", "),

      cat.fields?.length || 0,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save("categories.pdf");
  };

  return (
    <motion.div
      className="categories-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <BackButton label="Back to Dashboard" path="/dashboard" />

      <div className="categories-container">
        {/* Header */}
        <div className="categories-header">
          <h1 className="categories-title">All Categories</h1>
        </div>

        <div className="categories-stats">
          <div className="categories-count">
            <span className="categories-count-label">Total Categories</span>

            <span className="categories-count-number">{categories.length}</span>
          </div>

          <select
            className="category-filter-dropdown"
            value={selectedCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>

            {[...new Set(categories.map((cat) => cat.name))].map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

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

            <button className="categories-refresh-btn" onClick={handleRefresh}>
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="categories-loading">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="categories-empty">
            <div className="empty-icon">📂</div>
            <h3 className="empty-title">No Categories Found</h3>
            <p className="empty-subtitle">
              Click "Create Category" to get started
            </p>
          </div>
        ) : (
          <div className="categories-grid">
            <AnimatePresence>
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  className="category-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  {/* Card Header */}
                  <div className="category-card-header">
                    <h3 className="category-name">{cat.name}</h3>
                    <span className="category-badge">
                      {cat.fields?.length || 0} fields
                    </span>
                  </div>

                  {/* Code Format */}
                  {cat.codeFormat && (
                    <div className="category-code-format">
                      <span className="code-format-label">SKU Structure</span>
                      <div className="code-format-value">{cat.codeFormat}</div>
                    </div>
                  )}

                  {/* Fields */}
                  <div className="category-fields">
                    <div className="fields-label">
                      📋 Fields ({cat.fields?.length || 0})
                    </div>
                    {cat.fields?.length > 0 ? (
                      <div className="fields-list">
                        {cat.fields.slice(0, 2).map((field) => (
                          <span key={field.id} className="field-tag">
                            {field.name}
                            <span className="field-tag-type">{field.type}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-fields">No fields defined</div>
                    )}
                    <button
                      className="read-more-btn"
                      onClick={() => setSelectedCategoryData(cat)}
                    >
                      Read More
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="category-actions">
                    <button
                      className="category-edit-btn"
                      onClick={() => navigate(`/categories/edit/${cat.id}`)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="category-delete-btn"
                      onClick={() => handleDelete(cat.id, cat.name)}
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
      {/* CATEGORY MODAL */}
      {selectedCategoryData && (
        <div
          className="item-modal-overlay"
          onClick={() => setSelectedCategoryData(null)}
        >
          <div className="item-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCategoryData.name}</h2>

              <button
                className="modal-close-btn"
                onClick={() => setSelectedCategoryData(null)}
              >
                ✖
              </button>
            </div>

            {/* SKU FORMAT */}

            {selectedCategoryData.codeFormat && (
              <div className="modal-sku-section">
                <span className="sku-label">SKU Structure</span>

                <div className="sku-copy-wrapper">
                  <div className="sku-value">
                    {selectedCategoryData.codeFormat}
                  </div>
                </div>
              </div>
            )}

            {/* ALL FIELDS */}

            <div className="modal-fields">
              {selectedCategoryData.fields?.map((field) => (
                <div key={field.id} className="field-item">
                  <span className="field-key">{field.name}</span>

                  <span className="field-value">{field.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CategoriesPage;