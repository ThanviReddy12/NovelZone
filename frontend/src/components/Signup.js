import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // 👈 React Icons
import { signupUser } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import "../styles/styles.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRules, setPasswordRules] = useState({});
  const [passwordValid, setPasswordValid] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const rules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    const isValid = Object.values(rules).every(Boolean);
    return { isValid, rules };
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    const { isValid, rules } = validatePassword(val);
    setPasswordValid(isValid);
    setPasswordRules(rules);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!passwordValid) {
      alert("Password does not meet the requirements.");
      return;
    }

    try {
      const response = await signupUser(name, email, password);
      const userId = response?.data?.userId;
      if (userId) {
        localStorage.setItem("userId", userId);
        alert("Signup Successful!");
        navigate("/favorites");
      } else {
        alert("Signup succeeded, but something went wrong. Try again.");
      }
    } catch (error) {
      alert("Signup failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password Input with Show/Hide Toggle */}
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            onFocus={() => setShowRules(true)}
            onBlur={() => setShowRules(false)}
            required
            style={{ width: "100%", paddingRight: "40px" }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#444",
            }}
          >
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </span>

          {showRules && (
            <div
              className="password-tooltip"
              style={{
                position: "absolute",
                top: "110%",
                left: 0,
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "10px",
                width: "280px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                fontSize: "14px",
                zIndex: 1000,
              }}
            >
              <strong>Password must have:</strong>
              <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                <li style={{ color: passwordRules.length ? "green" : "#B5828C" }}>At least 8 characters</li>
                <li style={{ color: passwordRules.uppercase ? "green" : "#B5828C" }}>One uppercase letter</li>
                <li style={{ color: passwordRules.lowercase ? "green" : "#B5828C" }}>One lowercase letter</li>
                <li style={{ color: passwordRules.number ? "green" : "#B5828C" }}>One number</li>
                <li style={{ color: passwordRules.specialChar ? "green" : "#B5828C" }}>One special character</li>
              </ul>
            </div>
          )}
        </div>

        <button type="submit" style={{ marginTop: "20px" }}>Sign Up</button>
      </form>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
};

export default Signup;
