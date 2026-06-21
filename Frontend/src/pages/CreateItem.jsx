import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSave } from "react-icons/fa";
import { IoMdCopy } from "react-icons/io";
import { IoMdCheckmark } from "react-icons/io";
import BackButton from "../components/common/BackButton";
import "../styles/createItem.css";
import { useParams } from "react-router-dom";

const CreateItem = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [fields, setFields] = useState({});
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState("");
  const [preview, setPreview] = useState("");
  const [categoryFields, setCategoryFields] = useState([]);
  const [copied, setCopied] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/categories");

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await res.json();

        setCategories(data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchItem = async () => {
      try {
        const token = localStorage.getItem("jwtToken");

        const res = await fetch(`http://localhost:5001/api/items/${id}`, {
          headers: {
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch item");
        }

        const data = await res.json();

        const item = data.data;

        setCategoryId(item.categoryId);
        setFields(item.fields || {});
        setDescription(item.description || "");
        setRate(item.rate || "");
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load item");
      }
    };

    fetchItem();
  }, [id]);

  // LIVE PREVIEW
  useEffect(() => {
    if (!categoryId) return;

    const hasValues = Object.keys(fields).length > 0;

    if (!hasValues) {
      setPreview("");
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setPreviewLoading(true);

        const token = localStorage.getItem("jwtToken");

        const res = await fetch("http://localhost:5001/api/items/preview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
          body: JSON.stringify({
            categoryId,
            fields,
          }),
        });

        if (!res.ok) {
          throw new Error("Preview failed");
        }

        const data = await res.json();

        setPreview(data.data?.code || "");
      } catch (err) {
        console.error(err);
        setPreview("");
      } finally {
        setPreviewLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [categoryId, fields]);

  // UPDATE CATEGORY FIELDS
  useEffect(() => {
    const selected = categories.find(
      (c) => String(c.id) === String(categoryId),
    );

    setCategoryFields(selected?.fields || []);
  }, [categoryId, categories]);

  // HANDLE FIELD CHANGE
  const handleFieldChange = (key, value) => {
    setFields((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // CREATE ITEM
  const handleSubmit = async () => {
    if (!categoryId) {
      alert("Please select a category");
      return;
    }

    const missingFields = categoryFields.filter(
      (field) => field.required && !fields[field.name.toUpperCase()],
    );

    if (missingFields.length > 0) {
      alert(
        `Please fill required fields: ${missingFields
          .map((f) => f.name)
          .join(", ")}`,
      );
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");

      const res = await fetch(
        isEditMode
          ? `http://localhost:5001/api/items/${id}`
          : "http://localhost:5001/api/items",
        {
          method: isEditMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
          body: JSON.stringify({
            categoryId,
            fields,
            description,
            rate,
          }),
        },
      );

      let data;

      const text = await res.text();

      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("❌ Not JSON response:", text);
        throw new Error("Server returned invalid response");
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to create item");
      }

      // COPY FINAL GENERATED CODE
      if (data?.data?.code) {
        await navigator.clipboard.writeText(data.data.code);
      }

      alert(
        `✅ Item ${isEditMode ? "Updated" : "Created"} Successfully!\nCode: ${
          data?.data?.code || "N/A"
        }`,
      );

      // RESET FORM
      setCategoryId("");
      setFields({});
      setDescription("");
      setRate("");
      setCategoryFields([]);
      setPreview("");
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    }
  };

  // COPY PREVIEW
  const handleCopy = async () => {
    if (preview) {
      await navigator.clipboard.writeText(preview);

      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      className="create-item-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <BackButton label="Back to Dashboard" path="/dashboard" />

      <div className="create-item-container">
        <div className="item-header">
          <h1 className="item-title">
            {isEditMode ? "Edit Item" : "Create New Item"}
          </h1>{" "}
        </div>

        <motion.div
          className="item-form-card"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="item-form-grid">
            {/* LEFT SIDE */}
            <div className="item-form-left">
              {/* CATEGORY */}
              <div className="item-form-section">
                <h3 className="item-section-title">Select Category</h3>

                <select
                  className="item-modern-select"
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setFields({});
                    setPreview("");
                  }}
                >
                  <option value="">Select Category ▼</option>

                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* FIELDS */}
              <div className="item-form-section">
                <h3 className="item-section-title">Fields</h3>

                {categoryFields.length > 0 && (
                  <div className="item-dynamic-fields">
                    <label className="item-field-label">
                      Additional Fields
                    </label>

                    <div className="item-fields-grid">
                      {categoryFields.map((field) => (
                        <div
                          key={field.id || field.name}
                          className="field-card"
                        >
                          <label className="item-field-label">
                            {field.name}
                            {field.required && " *"}
                          </label>

                          {field.type === "TEXTAREA" ? (
                            /* TEXTAREA */
                            <textarea
                              className="item-modern-input"
                              placeholder={field.name}
                              value={fields[field.name.toUpperCase()] || ""}
                              onChange={(e) =>
                                handleFieldChange(
                                  field.name.toUpperCase(),
                                  e.target.value.replace(/[^a-zA-Z ]/g, ""),
                                )
                              }
                            />
                          ) : (
                            /* INPUT */
                            <input
                              type={
                                field.type === "NUMBER"
                                  ? "number"
                                  : field.type === "DATE"
                                    ? "date"
                                    : "text"
                              }
                              className="item-modern-input"
                              placeholder={field.name}
                              value={fields[field.name.toUpperCase()] || ""}
                              onChange={(e) => {
                                let value = e.target.value;

                                // TEXT ONLY
                                if (field.type === "TEXT") {
                                  value = value.replace(/[^a-zA-Z ]/g, "");
                                }

                                // NUMBER ONLY
                                if (field.type === "NUMBER") {
                                  value = value.replace(/[^0-9]/g, "");
                                }

                                // DATE FORMAT
                                if (field.type === "DATE") {
                                  value = value.replaceAll("-", "");
                                }

                                // ALPHANUMERIC
                                if (field.type === "ALPHANUMERIC") {
                                  value = value.replace(/[^a-zA-Z0-9]/g, "");
                                }

                                handleFieldChange(
                                  field.name.toUpperCase(),
                                  value,
                                );
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* DESCRIPTION */}
              <div className="item-form-section">
                <h3 className="item-section-title">Description</h3>

                <textarea
                  className="item-modern-input item-description-box"
                  placeholder="Enter item description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              {/* RATE */}
              <div className="item-form-section">
                <h3 className="item-section-title">Rate</h3>

                <input
                  type="number"
                  className="item-modern-input"
                  placeholder="Enter item rate..."
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
              </div>

              {/* SAVE BUTTON */}
              <div className="item-form-actions">
                <motion.button
                  className="item-btn-primary"
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaSave />
                  Save Item
                </motion.button>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="item-form-right">
              <div className="item-live-preview">
                <div className="item-preview-title">LIVE PREVIEW</div>

                <div className="item-preview-code-wrapper">
                  <div className="item-preview-code">
                    {previewLoading ? "Generating..." : preview || "---"}
                  </div>

                  <motion.button
                    className={`item-copy-btn ${copied ? "copied" : ""}`}
                    onClick={handleCopy}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!preview}
                  >
                    {copied ? (
                      <>
                        <IoMdCheckmark size={16} />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <IoMdCopy size={16} />
                        <span>Copy</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {preview && (
                  <p className="item-preview-note">
                    Click copy to save this code
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreateItem;
