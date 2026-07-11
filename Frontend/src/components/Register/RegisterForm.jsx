import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import { useState } from "react";
import Captcha from "../Captcha/Captcha";
import AuthService from "../../services/AuthService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterForm = ({ onSwitch, isCaptchaValid, setIsCaptchaValid }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (password) => {
    if (password.length < 8) return "weak";
    if (/[A-Z]/.test(password) && /\d/.test(password)) return "strong";
    return "medium";
  };

  const strength = getPasswordStrength(formData.password);
  const isStrongPassword = strength === "strong";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.companyName.trim()) {
      toast.warning("Company Name is required");
      return;
    }

    // Name validation
    if (!formData.name.trim()) {
      toast.warning("Full name is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.warning("Enter a valid email address");
      return;
    }

    // Password strength validation
    if (!isStrongPassword) {
      toast.warning("Password is not strong enough");
      return;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    // Captcha validation
    if (!isCaptchaValid) {
      toast.error("Captcha incorrect");
      return;
    }

    let loadingToast;

    try {
      loadingToast = toast.loading("Creating account...");

      await AuthService.register({
        companyName: formData.companyName,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.dismiss(loadingToast);
      toast.success("Registration successful 🎉");

      setFormData({
        companyName: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // RESET CAPTCHA
      setIsCaptchaValid(false);

      // RESET PASSWORD VISIBILITY
      setShowPassword(false);
      setShowConfirmPassword(false);

      // SWITCH TO LOGIN
      onSwitch();
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || "Registration failed");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={formData.email}
          onChange={handleChange}
        />

        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            maxLength={12}
            minLength={8}
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <RiEyeFill /> : <RiEyeCloseFill />}
          </button>
        </div>

        {formData.password && (
          <>
            <div className="password-strength">
              <div className={`password-strength-bar strength-${strength}`} />
            </div>

            <p className="password-info">
              Password must be at least 8 characters, include 1 number & 1
              uppercase
            </p>

            {strength === "strong" ? (
              <p className="password-success">Strong password ✔</p>
            ) : (
              <p className="password-error">Your password is not strong</p>
            )}
          </>
        )}

        <div className="password-input-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            maxLength={12}
            minLength={8}
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <RiEyeFill /> : <RiEyeCloseFill />}
          </button>
        </div>

        <Captcha onValidate={setIsCaptchaValid} />

        <button
          type="submit"
          className="login-btn"
          disabled={
            !formData.companyName.trim() ||
            !isStrongPassword ||
            !isCaptchaValid ||
            formData.password !== formData.confirmPassword
          }
        >
          Create Account
        </button>
      </form>

      <div className="switch-auth">
        Already have an account? <span onClick={onSwitch}>Login</span>
      </div>
    </>
  );
};

export default RegisterForm;