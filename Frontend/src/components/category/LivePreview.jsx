import { useState, useEffect } from "react";

function LivePreview({ format, fields, categoryName, separator }) {
  const [preview, setPreview] = useState("");

  // DUMMY VALUES
  const dummyValues = {
    BRAND: "NIKE",
    MODEL: "XPS",
    COLOR: "BLACK",
    SIZE: "L",
    CATEGORY: "LAPTOP",
  };

  useEffect(() => {
    const generatedParts = [];

    const randomValues = {
      BRAND: ["NIKE", "DELL", "APPLE"],
      MODEL: ["XPS", "AIR", "PRO"],
      COLOR: ["BLACK", "GRAY", "SILVER"],
      SIZE: ["S", "M", "L", "XL"],
    };

    const dummyValues = {
      BRAND: "NIKE",
      MODEL: "XPS",
      COLOR: "BLACK",
      SIZE: "L",
      CATEGORY: "LAPTOP",
    };

    fields.forEach((f) => {
      const fieldName = f.name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

      const sampleValue =
        f.name ||
        randomValues[fieldName]?.[
          Math.floor(Math.random() * randomValues[fieldName].length)
        ] ||
        dummyValues[fieldName] ||
        "VALUE";

      let finalValue = sampleValue;

      // FULL
      if (f.rule === "FULL") {
        finalValue = sampleValue;
      }

      // PREFIX
      if (f.rule === "PREFIX") {
        finalValue = sampleValue.substring(0, Number(f.length));
      }

      // SUFFIX
      if (f.rule === "SUFFIX") {
        finalValue = sampleValue.slice(-Number(f.length));
      }

      // BOTH
      if (f.rule === "BOTH") {
        const prefix = sampleValue.substring(0, Number(f.prefixLength));

        const suffix = sampleValue.slice(-Number(f.suffixLength));

        finalValue = prefix + suffix;
      }

      generatedParts.push(finalValue);
    });

    generatedParts.push("001");

    setPreview(generatedParts.join(separator || "-"));
  }, [fields, separator]);

  return (
    <div className="live-preview">
      <div className="preview-title">LIVE PREVIEW</div>

      <div
        className="preview-code"
        style={{
          wordBreak: "break-word",
          overflowWrap: "break-word",
          lineHeight: "1.8",
          fontSize: "1rem",
        }}
      >
        {" "}
        {preview || "NIKE-XPS-001"}
      </div>

      {categoryName && (
        <div
          style={{
            marginTop: "12px",
            fontSize: "0.75rem",
            color: "#92400e",
            textAlign: "center",
          }}
        >
          Category: {categoryName}
        </div>
      )}
    </div>
  );
}

export default LivePreview;