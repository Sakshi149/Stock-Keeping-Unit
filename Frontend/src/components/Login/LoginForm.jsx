import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Captcha from "../Captcha/Captcha";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../../services/AuthService";

const LoginForm = ({ onSwitch, isCaptchaValid, setIsCaptchaValid }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [captchaKey, setCaptchaKey] = useState(0);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const refreshCaptcha = () => {
    setCaptchaKey((prev) => prev + 1);
    setIsCaptchaValid(false);
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
      await AuthService.login({
        email: formData.email,
        password: formData.password,
      });

      toast.success("Login successful");

      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed");

      refreshCaptcha();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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