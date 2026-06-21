import { useEffect, useState } from "react";
import { TbRefresh } from "react-icons/tb";

const Captcha = ({ onValidate = () => { } }) => {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(captcha);
    setUserInput("");
    setError("");
    onValidate(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const validateCaptcha = () => {
    if (userInput === captchaText) {
      onValidate(true);
      setError("");
    } else {
      setError("Captcha does not match");
      onValidate(false);
      generateCaptcha();
    }
  };

  return (
    <div className="captcha-container">
      <div className="captcha-box">
        <span className="captcha-text">{captchaText}</span>
        <button
          type="button"
          className="refresh-btn"
          onClick={generateCaptcha}
          title="Refresh Captcha"
        >
          <TbRefresh />
        </button>
      </div>

      <input
        type="text"
        placeholder="Enter Captcha"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onBlur={validateCaptcha}
      />

      {error && <p className="captcha-error">{error}</p>}
    </div>
  );
};

export default Captcha;