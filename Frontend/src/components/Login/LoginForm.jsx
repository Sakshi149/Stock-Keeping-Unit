import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Captcha from "../Captcha/Captcha";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import { FiArrowLeft } from "react-icons/fi";
import { FcClock } from "react-icons/fc";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../../services/AuthService";

const LoginForm = ({ onSwitch, isCaptchaValid, setIsCaptchaValid }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [generatedOTP, setGeneratedOTP] = useState("123456");
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(600);
  const [loginData, setLoginData] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);
  const inputRefs = useRef([]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    let interval;
    if (showOTP && otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOTP, otpSent, timer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const refreshCaptcha = () => {
    setCaptchaKey((prev) => prev + 1);
    setIsCaptchaValid(false);
  };

  const generateOTP = () => {
    const otp = "123456";
    setGeneratedOTP(otp);
    console.log("Generated OTP:", otp);
    setOtpSent(true);
    return otp;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.warning("Email and password are required");

      return;
    }

    if (!isCaptchaValid) {
      toast.error("Captcha incorrect");

      refreshCaptcha();

      return;
    }

    try {
      const result = await AuthService.login({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", result.token);

      toast.success("OTP sent to your email");

      setLoginData({
        email: formData.email,
      });

      generateOTP();

      setShowOTP(true);

      setTimer(600);

      setOtp(["", "", "", "", "", ""]);

      setOtpVerified(false);

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      toast.error(err.message || "Login failed");

      refreshCaptcha();
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = () => {
    const enteredOTP = otp.join("");

    if (enteredOTP.length !== 6) {
      toast.warning("Please enter 6-digit OTP");
      return;
    }

    if (enteredOTP === generatedOTP) {
      toast.success("OTP verified successfully");
      setOtpVerified(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } else {
      toast.error("Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      refreshCaptcha();
    }
  };

  const goBackToLogin = () => {
    setShowOTP(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpVerified(false);
    setOtpSent(false);
    setTimer(600);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (showOTP) {
    return (
      <div className="otp-container">
        <button className="back-button" onClick={goBackToLogin}>
          <FiArrowLeft /> Back to Login
        </button>

        <div className="otp-header">
          <h2 className="app-title">Verify OTP</h2>
          <p className="otp-subtitle">
            Enter the 6-digit OTP sent to your email
          </p>

          {otpSent && (
            <div className={`otp-timer ${timer < 60 ? "warning" : ""}`}>
              <FcClock size={18} />
              OTP expires in: {formatTime(timer)}
            </div>
          )}
        </div>

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={(e) => {
                e.preventDefault();
                const pasteData = e.clipboardData.getData("text").slice(0, 6);
                const pasteArray = pasteData.split("");
                const newOtp = [...otp];
                pasteArray.forEach((char, idx) => {
                  if (idx < 6 && /^\d$/.test(char)) {
                    newOtp[idx] = char;
                  }
                });
                setOtp(newOtp);
                const lastIndex = Math.min(5, pasteArray.length - 1);
                inputRefs.current[lastIndex]?.focus();
              }}
              className="otp-input"
              disabled={otpVerified}
              autoFocus={index === 0 && otpSent}
            />
          ))}
        </div>

        {otpVerified ? (
          <div className="otp-success">
            <div className="success-icon">✓</div>
            <p>OTP Verified Successfully!</p>
            <p className="redirecting">Redirecting to dashboard...</p>
          </div>
        ) : (
          <>
            <button
              className="verify-btn"
              onClick={verifyOTP}
              disabled={otp.join("").length !== 6}
            >
              Verify OTP
            </button>
          </>
        )}

        <div className="otp-info">
          <p className="info-text">
            ✅ OTP has been sent to your registered email address:{" "}
            <strong>{loginData?.email}</strong>
            <br />
            <small>
              For demo purposes, use OTP: <strong>123456</strong>
            </small>
            <br />
            <small>OTP is valid for 10 minutes</small>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            maxLength={12}
            minLength={8}
            required
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <RiEyeFill /> : <RiEyeCloseFill />}
          </button>
        </div>

        <div className="forgot-password">
          <a href="#">Forgot Password?</a>
        </div>

        <Captcha key={captchaKey} onValidate={setIsCaptchaValid} />

        <button type="submit" className="login-btn">
          Submit
        </button>

        <div className="switch-auth">
          Don't have an account?
          <span onClick={onSwitch}>Register</span>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
