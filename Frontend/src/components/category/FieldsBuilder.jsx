// import { motion } from "framer-motion";

// function FieldsBuilder({ fields, setFields }) {
//   const addField = () => {
//     setFields([
//       ...fields,
//       {
//         name: "NEWFIELD",
//         type: "TEXT",
//         required: false,
//         options: [],
//       },
//     ]);
//   };

//   const updateField = (index, key, value) => {
//     const updated = [...fields];
//     updated[index][key] = value;
//     setFields(updated);
//   };

//   const removeField = (index) => {
//     setFields(fields.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="form-section fields-builder">
//       <h3 className="section-title">Fields Builder</h3>
//       <div className="field-list">
//         {fields.map((field, index) => (
//           <motion.div
//             key={index}
//             className="field-item"
//             initial={{ opacity: 0, x: -10 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: 10 }}
//             transition={{ duration: 0.2 }}
//           >
//             <input
//               className="field-name-input"
//               value={field.name}
//               onChange={(e) =>
//                 updateField(
//                   index,
//                   "name",
//                   e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(),
//                 )
//               }
//               placeholder="Field name"
//             />
//             <select
//               className="field-type-select"
//               value={field.type}
//               onChange={(e) =>
//                 updateField(
//                   index,
//                   "type",
//                   e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(),
//                 )
//               }
//             >
//               <option value="TEXT">TEXT</option>
//               <option value="NUMBER">NUMBER</option>
//               <option value="DATE">DATE</option>
//             </select>
//             <label className="checkbox-label">
//               <input
//                 type="checkbox"
//                 checked={field.required}
//                 onChange={(e) =>
//                   updateField(index, "required", e.target.checked)
//                 }
//               />
//               Required
//             </label>
//             <button
//               className="remove-field-btn"
//               onClick={() => removeField(index)}
//             >
//               🗑
//             </button>
//           </motion.div>
//         ))}
//       </div>
//       <motion.button
//         className="add-field-btn"
//         onClick={addField}
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//       >
//         + Add Field
//       </motion.button>
//     </div>
//   );
// }

// export default FieldsBuilder;

import { motion } from "framer-motion";

function FieldsBuilder({ fields, setFields }) {
  // ADD FIELD
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

  // UPDATE FIELD
  const updateField = (index, key, value) => {
    const updated = [...fields];

    updated[index][key] = value;

    setFields(updated);
  };

  // REMOVE FIELD
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
            {/* FIELD NAME */}
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

            {/* FIELD TYPE */}
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
            {/* RULE TYPE */}
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

            {/* PREFIX / SUFFIX LENGTHS */}

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

            {/* REMOVE BUTTON */}
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

      {/* ADD BUTTON */}
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
