import { useState } from "react";
import LoginForm from "../Login/LoginForm";
import RegisterForm from "../Register/RegisterForm";
import "../../styles/login.css";
import wosGif from "../../assets/wos-gif.gif";

const Auth = () => {
  const [mode, setMode] = useState("login");

  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false);

  const [animationStage, setAnimationStage] = useState("login");

  const handleSwitch = (newMode) => {
    if (isAnimating) return;

    setIsAnimating(true);

    setAnimationStage("transition");

    setTimeout(() => {
      setMode(newMode);

      setAnimationStage(newMode);

      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 300);
  };

  return (
    <div className={`auth-container ${animationStage}`}>
      {/* LEFT SIDE */}

      <div className={`auth-left ${animationStage}`}>
        {mode === "login" ? (
          <div
            className={`image-content ${
              animationStage === "login"
                ? "active"
                : animationStage === "transition"
                  ? "fade-out"
                  : "hidden"
            }`}
          >
            <div className="image-placeholder">
              <div className="gif-container">
                <img src={wosGif} alt="SKU Generator" className="wos-gif" />

                <div className="gif-overlay"></div>
              </div>

              <h3>Welcome Back!</h3>

              <p>
                Sign in to generate, manage, and organize SKU item codes
                efficiently.
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`form-content ${
              animationStage === "register"
                ? "slide-in"
                : animationStage === "transition"
                  ? "slide-out"
                  : "hidden"
            }`}
          >
            <div className="form-wrapper">
              <div className="form-header">
                <h2 className="app-title">SKU Generator</h2>

                <p className="app-subtitle">Create Account</p>
              </div>

              <RegisterForm
                onSwitch={() => handleSwitch("login")}
                isCaptchaValid={isCaptchaValid}
                setIsCaptchaValid={setIsCaptchaValid}
              />
            </div>
          </div>
        )}
      </div>

      <div className={`auth-right ${animationStage}`}>
        {mode === "login" ? (
          <div
            className={`form-content ${
              animationStage === "login"
                ? "active"
                : animationStage === "transition"
                  ? "slide-out"
                  : "hidden"
            }`}
          >
            <div className="form-wrapper">
              <div className="form-header">
                <h2 className="app-title">SKU Generator</h2>

                <p className="app-subtitle">Secure Login</p>
              </div>

              <LoginForm
                onSwitch={() => handleSwitch("register")}
                isCaptchaValid={isCaptchaValid}
                setIsCaptchaValid={setIsCaptchaValid}
              />
            </div>
          </div>
        ) : (
          <div
            className={`image-content ${
              animationStage === "register"
                ? "slide-in"
                : animationStage === "transition"
                  ? "fade-out"
                  : "hidden"
            }`}
          >
            <div className="image-placeholder">
              <div className="gif-container">
                <img src={wosGif} alt="SKU Generator" className="wos-gif" />

                <div className="gif-overlay"></div>
              </div>

              <h3>Join SKU Generator!</h3>

              <p>
                Create an account to generate item codes, manage categories, and
                organize SKU data easily.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;