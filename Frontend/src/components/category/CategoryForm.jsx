import { useState, useEffect } from "react";
import FieldsBuilder from "./FieldsBuilder";
import CodeBuilder from "./CodeBuilder";
import LivePreview from "./LivePreview";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/categoryForm.css";

function CategoryForm({ isEdit = false, categoryId = null }) {
  const [step, setStep] = useState(1);
  const [categoryName, setCategoryName] = useState("");
  const [fields, setFields] = useState([]);
  const [format, setFormat] = useState("");
  const [separator, setSeparator] = useState("-");

  useEffect(() => {
    if (fields.length > 0) {
      const autoFormat = [
        ...fields.map((f) => `{${f.name.toUpperCase()}}`),
        "{SEQ}",
      ].join(separator);

      setFormat(autoFormat);
    }
  }, [fields, separator]);

  useEffect(() => {
    if (isEdit && categoryId) {
      fetchCategory();
    }
  }, [isEdit, categoryId]);

  const next = () => setStep((prev) => Math.min(prev + 1, 4));
  const back = () => setStep((prev) => Math.max(prev - 1, 1));

  const token = localStorage.getItem("jwtToken");

  const fetchCategory = async () => {
    try {
      const res = await fetch(
        `https://api.skuoriginal.in/api/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      const category = data.data;

      setCategoryName(category.name || "");

      setFields(
        category.fields.map((field) => ({
          name: field.name,
          type: field.type,
          required: field.isRequired,
        })),
      );

      setFormat(category.codeFormat || "");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      const payload = {
        name: categoryName.trim(),
        codeFormat: format,
        skuConfig: {
          separator: separator,
          parts: [
            ...fields.map((f) => ({
              type: "FIELD",
              field: f.name.toUpperCase(),
              rule: f.rule || "FULL",
              length: Number(f.length) || 0,
              prefixLength: Number(f.prefixLength) || 0,
              suffixLength: Number(f.suffixLength) || 0,
            })),
            {
              type: "SEQUENCE",
              length: 4,
            },
          ],
        },
        fields: fields.map((f) => ({
          name: f.name.toUpperCase(),
          type: f.type.toUpperCase(),
          isRequired: f.required || false,
        })),
      };

      const url = isEdit
        ? `https://api.skuoriginal.in/api/categories/${categoryId}`
        : "https://api.skuoriginal.in/api/categories";

      const method = isEdit ? "PUT" : "POST";

      const token = localStorage.getItem("jwtToken");

      const res = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",

          ...(token && {
            Authorization: `Bearer ${token}`,
          }),
        },

        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create category");
      }

      alert(
        isEdit
          ? "✅ Category updated successfully!"
          : "✅ Category created successfully!",
      );
      setStep(1);
      setCategoryName("");
      setFields([]);
      setFormat("");
      setSeparator("-");
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    }
  };

  const stepTitles = ["Category", "Fields", "Format", "Preview"];

  return (
    <div className="form-grid">
      <div className="form-left">
        <div className="stepper">
          {stepTitles.map((title, index) => (
            <div
              key={index}
              className={step >= index + 1 ? "active" : ""}
              onClick={() => setStep(index + 1)}
            >
              {title}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <div className="form-section">
                <h3 className="section-title">Category Name</h3>
                <input
                  className="modern-input"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  autoFocus
                />
              </div>
            )}

            {step === 2 && (
              <FieldsBuilder fields={fields} setFields={setFields} />
            )}

            {step === 3 && (
              <>
                <div className="separator-section">
                  <h3 className="section-title">Choose Separator</h3>

                  <div className="separator-options">
                    {["-", "/", ":"].map((sep) => (
                      <button
                        key={sep}
                        type="button"
                        className={`separator-btn ${
                          separator === sep ? "active-separator" : ""
                        }`}
                        onClick={() => setSeparator(sep)}
                      >
                        {sep}
                      </button>
                    ))}
                  </div>
                </div>

                <CodeBuilder
                  format={format}
                  setFormat={setFormat}
                  fields={fields}
                  separator={separator}
                />
              </>
            )}

            {step === 4 && (
              <div className="form-section">
                <h3 className="section-title">Final Review</h3>
                <div style={{ marginTop: "16px" }}>
                  <p>
                    <strong>Category:</strong> {categoryName || "Not set"}
                  </p>
                  <p>
                    <strong>Fields:</strong> {fields.length}
                  </p>
                  <p>
                    <strong>Format:</strong> {format}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Buttons */}
        <div className="form-actions">
          {step > 1 && (
            <button className="btn-secondary" onClick={back}>
              ← Back
            </button>
          )}

          {step < 4 ? (
            <button className="btn-primary" onClick={next}>
              Next →
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSave}>
              {isEdit ? "💾 Update Category" : "💾 Save Category"}
            </button>
          )}
        </div>
      </div>

      <div className="form-right">
        <LivePreview
          format={format}
          fields={fields}
          categoryName={categoryName}
          separator={separator}
        />
      </div>
    </div>
  );
}

export default CategoryForm;
