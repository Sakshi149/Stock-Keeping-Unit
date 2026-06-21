// import { useState, useEffect } from "react";

// function LivePreview({ format, fields, categoryName }) {
//   const [preview, setPreview] = useState("");

//   // 🔥 Dummy values for realistic preview
//   const dummyValues = {
//     BRAND: "NIKE",
//     MODEL: "XPS",
//     COLOR: "BLACK",
//     SIZE: "L",
//     CATEGORY: "LAPTOP",
//   };

//   useEffect(() => {
//     let previewCode = format;

//     fields.forEach((f) => {
//       const placeholder = `{${f.name.toUpperCase()}}`;

//       const randomValues = {
//         BRAND: ["NIKE", "DELL", "APPLE"],
//         MODEL: ["XPS", "AIR", "PRO"],
//         COLOR: ["BLACK", "GRAY", "SILVER"],
//       };

//       // ✅ Use dummy value OR fallback
//       const sampleValue =
//         randomValues[f.name.toUpperCase()]?.[
//           Math.floor(Math.random() * randomValues[f.name.toUpperCase()].length)
//         ] || f.name.substring(0, 3).toUpperCase(); // fallback like "MOD", "COL"

//       previewCode = previewCode.replace(
//         new RegExp(placeholder, "g"),
//         sampleValue,
//       );
//     });

//     // Replace sequence
//     previewCode = previewCode.replace(/{SEQ}/g, "001");
//     setPreview(previewCode);
//   }, [format, fields]);

//   return (
//     <div className="live-preview">
//       <div className="preview-title">LIVE PREVIEW</div>

//       <div className="preview-code">{preview || "NIKE-XPS-001"}</div>

//       {categoryName && (
//         <div
//           style={{
//             marginTop: "12px",
//             fontSize: "0.75rem",
//             color: "#92400e",
//             textAlign: "center",
//           }}
//         >
//           Category: {categoryName}
//         </div>
//       )}
//     </div>
//   );
// }

// export default LivePreview;

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

  // useEffect(() => {
  //   let previewCode = format;

  //   // RANDOM VALUES
  //   const randomValues = {
  //     BRAND: ["NIKE", "DELL", "APPLE"],
  //     MODEL: ["XPS", "AIR", "PRO"],
  //     COLOR: ["BLACK", "GRAY", "SILVER"],
  //     SIZE: ["S", "M", "L", "XL"],
  //   };

  //   // FIELD REPLACEMENT
  //   fields.forEach((f) => {
  //     const fieldName = f.name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  //     const placeholder = `{${fieldName}}`;

  //     // SAMPLE VALUE
  //     const sampleValue =
  //       randomValues[fieldName]?.[
  //         Math.floor(Math.random() * randomValues[fieldName].length)
  //       ] ||
  //       dummyValues[fieldName] ||
  //       fieldName.substring(0, 3);

  //     let finalValue = sampleValue;

  //     if (f.rule === "PREFIX") {
  //       finalValue = sampleValue.substring(0, Number(f.length));
  //     }

  //     if (f.rule === "SUFFIX") {
  //       finalValue = sampleValue.slice(-Number(f.length));
  //     }

  //     if (f.rule === "BOTH") {
  //       const prefix = sampleValue.substring(0, Number(f.prefixLength));

  //       const suffix = sampleValue.slice(-Number(f.suffixLength));

  //       finalValue = prefix + suffix;
  //     }

  //     if (f.rule === "FULL") {
  //       finalValue = sampleValue;
  //     }

  //     // REPLACE ALL OCCURRENCES
  //     previewCode = previewCode.replace(
  //       new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"),
  //       finalValue,
  //     );
  //   });

  //   // SEQUENCE
  //   previewCode = previewCode.replace(/{SEQ}/g, "001");

  //   // DATE TOKENS
  //   const now = new Date();

  //   previewCode = previewCode.replace(
  //     /{YY}/g,
  //     String(now.getFullYear()).slice(-2),
  //   );

  //   previewCode = previewCode.replace(/{YYYY}/g, String(now.getFullYear()));

  //   previewCode = previewCode.replace(
  //     /{MM}/g,
  //     String(now.getMonth() + 1).padStart(2, "0"),
  //   );

  //   // STATIC TOKEN
  //   previewCode = previewCode.replace(/{STATIC}/g, "FIXED");

  //   // CLEAN EXTRA DASHES
  //   previewCode = previewCode.replace(/--+/g, "-").replace(/^-|-$/g, "");

  //   setPreview(previewCode);
  // }, [format, fields]);

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