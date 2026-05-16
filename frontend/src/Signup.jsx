import React from "react";

function Signup({ authData, setAuthData, handleAuth, switchToLogin }) {
  // input change handler
  const handleChange = (e) => {
    setAuthData({
      ...authData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{ width: "100%" }}>

      {/* First Name */}
      <input
        name="firstName"
        placeholder="First Name"
        value={authData.firstName || ""}
        onChange={handleChange}
        style={inputStyle}
      />

      {/* Last Name */}
      <input
        name="lastName"
        placeholder="Last Name"
        value={authData.lastName || ""}
        onChange={handleChange}
        style={inputStyle}
      />

      {/* Email */}
      <input
        name="email"
        type="email"
        placeholder="Email Address"
        value={authData.email}
        onChange={handleChange}
        style={inputStyle}
      />

      {/* Contact Number */}
      <input
        name="contactNumber"
        placeholder="Contact Number"
        value={authData.contactNumber || ""}
        onChange={handleChange}
        style={inputStyle}
      />

      {/* Nationality */}
      <input
        name="nationality"
        placeholder="Nationality"
        value={authData.nationality || ""}
        onChange={handleChange}
        style={inputStyle}
      />

      {/* Password */}
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={authData.password}
        onChange={handleChange}
        style={inputStyle}
      />

      {/* Confirm Password */}
      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        value={authData.confirmPassword || ""}
        onChange={handleChange}
        style={inputStyle}
      />

      {/* SIGNUP BUTTON */}
      <button onClick={handleAuth} style={buttonStyle}>
        Sign Up
      </button>

      {/* SWITCH TO LOGIN */}
      <p style={{ marginTop: "15px", fontSize: "14px", color: "#94a3b8" }}>
        Already have an account?{" "}
        <span
          onClick={switchToLogin}
          style={{ color: "#3b82f6", cursor: "pointer" }}
        >
          Login
        </span>
      </p>
    </div>
  );
}

// Styles (clean & reusable)
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#3b82f6",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "10px",
};

export default Signup;