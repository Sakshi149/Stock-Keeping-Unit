import { motion } from "framer-motion";

function FieldsBuilder({ fields, setFields }) {
  const addField = () => {
    const exists = fields.some((f) => f.name === "NEWFIELD");

    if (exists) {
      alert("Field already exists");
      return;
    }

    setFields([
      ...fields,
      {
        name: "",
        type: "TEXT",
        required: false,
        rule: "FULL",
        length: 2,
        prefixLength: 2,
        suffixLength: 2,
      },
    ]);
  };

  const updateField = (index, key, value) => {
    const updated = [...fields];

    updated[index][key] = value;

    setFields(updated);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  return (
    <div className="form-section fields-builder">
      <h3 className="section-title">Fields Builder</h3>

      <div className="field-list">
        {fields.map((field, index) => (
          <motion.div
            key={index}
            className="field-item"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <input
              className="field-name-input"
              value={field.name}
              onChange={(e) =>
                updateField(
                  index,
                  "name",
                  e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(),
                )
              }
              placeholder="Field name"
            />

            <select
              className="field-type-select"
              value={field.type}
              onChange={(e) => {
                const type = e.target.value.toUpperCase();

                const updated = [...fields];

                updated[index].type = type;

                setFields(updated);
              }}
            >
              <option value="TEXT">TEXT</option>
              <option value="NUMBER">NUMBER</option>
              <option value="DATE">DATE</option>
              <option value="ALPHANUMERIC">ALPHANUMERIC</option>{" "}
            </select>
            <select
              className="field-type-select"
              value={field.rule}
              onChange={(e) => updateField(index, "rule", e.target.value)}
            >
              <option value="FULL">FULL</option>
              <option value="PREFIX">PREFIX</option>
              <option value="SUFFIX">SUFFIX</option>
              <option value="BOTH">BOTH</option>
            </select>

            {field.rule === "PREFIX" && (
              <input
                type="number"
                min="1"
                className="field-name-input"
                value={field.length}
                onChange={(e) => updateField(index, "length", e.target.value)}
                placeholder="Prefix Length"
              />
            )}

            {field.rule === "SUFFIX" && (
              <input
                type="number"
                min="1"
                className="field-name-input"
                value={field.length}
                onChange={(e) => updateField(index, "length", e.target.value)}
                placeholder="Suffix Length"
              />
            )}

            {field.rule === "BOTH" && (
              <>
                <input
                  type="number"
                  min="1"
                  className="field-name-input"
                  value={field.prefixLength}
                  onChange={(e) =>
                    updateField(index, "prefixLength", e.target.value)
                  }
                  placeholder="Prefix"
                />

                <input
                  type="number"
                  min="1"
                  className="field-name-input"
                  value={field.suffixLength}
                  onChange={(e) =>
                    updateField(index, "suffixLength", e.target.value)
                  }
                  placeholder="Suffix"
                />
              </>
            )}

            <button
              type="button"
              className="remove-field-btn"
              onClick={() => removeField(index)}
            >
              🗑
            </button>
          </motion.div>
        ))}
      </div>

      <motion.button
        type="button"
        className="add-field-btn"
        onClick={addField}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        + Add Field
      </motion.button>
    </div>
  );
}

export default FieldsBuilder;