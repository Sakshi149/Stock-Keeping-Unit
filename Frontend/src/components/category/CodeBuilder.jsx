// function CodeBuilder({ format, setFormat, fields }) {
//   const insertToken = (token) => {
//     setFormat((prev) => {
//       const value = prev.endsWith("-") ? prev + token : prev + "-" + token;

//       return value.replace(/^-/, "");
//     });
//   };

//   return (
//     <div className="form-section code-builder">
//       <h3 className="section-title">SKU Structure Preview</h3>
//       <input
//         className="code-input"
//         value={format}
//         onChange={(e) =>
//           setFormat(
//             e.target.value.replace(/[^a-zA-Z0-9{}_-]/g, "").toUpperCase(),
//           )
//         }
//         placeholder="e.g., {COLOR}-{SIZE}-{SEQ}"
//       />

//       <div className="tokens-container">
//         {fields.map((f, i) => (
//           <span
//             key={i}
//             className="token-badge"
//             onClick={() => insertToken(`{${f.name.toUpperCase()}}`)}
//           >
//             {`{${f.name.toUpperCase()}}`}
//           </span>
//         ))}

//         {/* STATIC TOKEN */}
//         <span className="token-badge" onClick={() => insertToken("{STATIC}")}>
//           {`{STATIC}`}
//         </span>

//         {/* SEQUENCE TOKEN */}
//         <span className="token-badge" onClick={() => insertToken("{SEQ}")}>
//           {`{SEQ}`}
//         </span>

//         {/* DATE TOKENS */}
//         <span className="token-badge" onClick={() => insertToken("{YY}")}>
//           {`{YY}`}
//         </span>

//         <span className="token-badge" onClick={() => insertToken("{YYYY}")}>
//           {`{YYYY}`}
//         </span>

//         <span className="token-badge" onClick={() => insertToken("{MM}")}>
//           {`{MM}`}
//         </span>
//       </div>

//       <p className="helper-text">Preview structure for SKU generation</p>
//     </div>
//   );
// }

// export default CodeBuilder;

function CodeBuilder({ format, setFormat, fields, separator }) {

  const insertToken = (token) => {
    setFormat((prev) => {

      const value = prev.endsWith(separator)
        ? prev + token
        : prev + separator + token;

      return value.replace(
        new RegExp(`^\\${separator}`),
        ""
      );
    });
  };

  return (
    <div className="form-section code-builder">
      <h3 className="section-title">SKU Structure Preview</h3>

      <input
        className="code-input"
        value={format}
        onChange={(e) =>
          setFormat(
            e.target.value
              .replace(/[^a-zA-Z0-9{}_\-:/]/g, "")
              .toUpperCase()
          )
        }
        placeholder="e.g., {COLOR}-{SIZE}-{SEQ}"
      />

      <div className="tokens-container">

        {fields.map((f, i) => (
          <span
            key={i}
            className="token-badge"
            onClick={() =>
              insertToken(`{${f.name.toUpperCase()}}`)
            }
          >
            {`{${f.name.toUpperCase()}}`}
          </span>
        ))}

        <span
          className="token-badge"
          onClick={() => insertToken("{STATIC}")}
        >
          {`{STATIC}`}
        </span>

        <span
          className="token-badge"
          onClick={() => insertToken("{SEQ}")}
        >
          {`{SEQ}`}
        </span>

        <span
          className="token-badge"
          onClick={() => insertToken("{YY}")}
        >
          {`{YY}`}
        </span>

        <span
          className="token-badge"
          onClick={() => insertToken("{YYYY}")}
        >
          {`{YYYY}`}
        </span>

        <span
          className="token-badge"
          onClick={() => insertToken("{MM}")}
        >
          {`{MM}`}
        </span>

      </div>

      <p className="helper-text">
        Preview structure for SKU generation
      </p>
    </div>
  );
}

export default CodeBuilder;