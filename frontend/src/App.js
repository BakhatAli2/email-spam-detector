import React, { useState, useEffect } from "react";
import axios from "axios";
// Icons Import
import {
  ShieldCheck,
  ScanSearch,
  AlertTriangle,
  CheckCircle2,
  Mail,
  Activity,
  Globe,
  Lock,
  Radar,
  Sparkles,
  TrendingUp,
  BarChart3,
  Zap,
  LogOut,
} from "lucide-react";

// Recharts Import
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import "./App.css";

function App() {
  // =========================
  // FIX: MISSING STATES ADDED
  // =========================
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("login"); // 'login' or 'signup'

  // =========================
  // AUTH STATES
  // =========================
  const [authData, setAuthData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    nationality: "",
    password: "",
    confirmPassword: "",
  });

  // =========================
  // SCANNER STATES
  // =========================
  const [emailContent, setEmailContent] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // =========================
  // LOGIN PERSISTENCE
  // =========================
  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");

    if (status === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // =========================
  // LOGIN / SIGNUP HANDLER
  // =========================
  const handleAuth = async () => {
    if (!authData.email || !authData.password) {
      alert("Please fill all fields");
      return;
    }

    if (currentPage === "signup" && authData.password !== authData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const url =
        currentPage === "signup"
          ? "http://localhost:5000/signup"
          : "http://localhost:5000/login";

      const res = await axios.post(url, authData);

      if (res.data.success || res.status === 200) {
        // SIGNUP SUCCESS
        if (currentPage === "signup") {
          alert("Account created successfully!");

          // Open login page after successful signup
          setCurrentPage("login");

          // Clear form fields
          setAuthData({
            firstName: "",
            lastName: "",
            email: "",
            contactNumber: "",
            nationality: "",
            password: "",
            confirmPassword: "",
          });
        }

        // LOGIN SUCCESS
        else {
          localStorage.setItem("isLoggedIn", "true");

          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
          }

          setIsLoggedIn(true);

          alert(res.data.message || "Welcome!");
        }
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Authentication failed. Please check your backend connection."
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");

    setIsLoggedIn(false);

    setResult(null);
    setEmailContent("");

    setAuthData({
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      nationality: "",
      password: "",
      confirmPassword: "",
    });

    setCurrentPage("login");
  };

  // =========================
  // EMAIL SCAN
  // =========================
  const scanEmail = async () => {
    if (!emailContent.trim()) {
      alert("Please paste an email first!");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/scan",
        {
          emailContent,
        }
      );

      setResult(response.data);

      setLoading(false);
    } catch (error) {
      setLoading(false);

      alert("Backend connection failed!");
    }
  };

  // =========================
  // MOCK ANALYTICS DATA
  // =========================
  const trafficData = [
    { day: "Mon", threats: 12 },
    { day: "Tue", threats: 19 },
    { day: "Wed", threats: 15 },
    { day: "Thu", threats: 25 },
    { day: "Fri", threats: 21 },
    { day: "Sat", threats: 30 },
    { day: "Sun", threats: 24 },
  ];

  const pieData = [
    { name: "Spam", value: 45 },
    { name: "Phishing", value: 30 },
    { name: "Safe", value: 25 },
  ];

  const COLORS = ["#ef4444", "#f59e0b", "#22c55e"];

  const isSpam = result?.spamScore >= 70;

  // Input common styles to keep code clean
  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    boxSizing: "border-box"
  };

  // =========================
  // MAIN RETURN
  // =========================
  return (
    <div className="main-wrapper">
      {!isLoggedIn ? (
        // =========================================
        // LOGIN / SIGNUP PAGE
        // =========================================
        <div
          className="auth-container"
          style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center", // <-- FIXED: Changed from 'justify' to 'justifyContent'
            alignItems: "center",
            background: "#0f172a",
            color: "white",
            padding: "20px"
          }}
        >
          <div
            className="auth-card"
            style={{
              background: "#1e293b",
              padding: "40px",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "450px",
              textAlign: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            }}
          >
            <ShieldCheck
              size={50}
              color="#3b82f6"
              style={{ marginBottom: "20px" }}
            />

            <h2 style={{ marginBottom: "10px" }}>
              {currentPage === "signup"
                ? "Create Account"
                : "Welcome To Email Spam Detector"}
            </h2>

            <p
              style={{
                color: "#94a3b8",
                marginBottom: "30px",
              }}
            >
              {currentPage === "signup"
                ? "Sign up to start protecting your inbox"
                : "Enter details to access MailGuard AI"}
            </p>

            {/* SIGNUP EXTRA FIELDS (Only shows when on signup page) */}
            {currentPage === "signup" && (
              <>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={authData.firstName}
                    onChange={(e) => setAuthData({ ...authData, firstName: e.target.value })}
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={authData.lastName}
                    onChange={(e) => setAuthData({ ...authData, lastName: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Contact Number"
                  value={authData.contactNumber}
                  onChange={(e) => setAuthData({ ...authData, contactNumber: e.target.value })}
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Nationality"
                  value={authData.nationality}
                  onChange={(e) => setAuthData({ ...authData, nationality: e.target.value })}
                  style={inputStyle}
                />
              </>
            )}

            {/* EMAIL INPUT */}
            <input
              type="email"
              placeholder="Email Address"
              value={authData.email}
              onChange={(e) =>
                setAuthData({
                  ...authData,
                  email: e.target.value,
                })
              }
              style={inputStyle}
            />

            {/* PASSWORD INPUT */}
            <input
              type="password"
              placeholder="Password"
              value={authData.password}
              onChange={(e) =>
                setAuthData({
                  ...authData,
                  password: e.target.value,
                })
              }
              style={inputStyle}
            />

            {/* CONFIRM PASSWORD (Only for Signup) */}
            {currentPage === "signup" && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={authData.confirmPassword}
                onChange={(e) =>
                  setAuthData({
                    ...authData,
                    confirmPassword: e.target.value,
                  })
                }
                style={inputStyle}
              />
            )}

            {/* BUTTON */}
            <button
              onClick={handleAuth}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                background: "#3b82f6",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "10px"
              }}
            >
              {currentPage === "signup"
                ? "Sign Up"
                : "Login to Dashboard"}
            </button>

            {/* TOGGLE LOGIN / SIGNUP */}
            <p
              style={{
                marginTop: "20px",
                fontSize: "14px",
                color: "#94a3b8",
              }}
            >
              {currentPage === "signup"
                ? "Already have an account?"
                : "New to MailGuard?"}

              <span
                onClick={() =>
                  setCurrentPage(
                    currentPage === "signup" ? "login" : "signup"
                  )
                }
                style={{
                  color: "#3b82f6",
                  cursor: "pointer",
                  marginLeft: "5px",
                  textDecoration: "underline",
                }}
              >
                {currentPage === "signup" ? "Login" : "Create one"}
              </span>
            </p>
          </div>
        </div>
      ) : (
        // =========================================
        // DASHBOARD
        // =========================================
        <div className="app">
          <div className="bg-circle one"></div>
          <div className="bg-circle two"></div>

           {/* SIDEBAR */}
          <aside className="sidebar">
            <div>
              <div className="logo-section">
                <div className="logo-icon">
                  <ShieldCheck size={34} />
                </div>

                <div>
                  <h2>MailGuard AI</h2>
                  <p>Cyber Security Platform</p>
                </div>
              </div>

              <div className="menu">
                <div className="menu-item active">
                  <ScanSearch size={20} />
                  <span>Threat Scanner</span>
                </div>

                <div className="menu-item">
                  <BarChart3 size={20} />
                  <span>Analytics</span>
                </div>

                <div className="menu-item">
                  <Radar size={20} />
                  <span>Threat Radar</span>
                </div>

                <div className="menu-item">
                  <Lock size={20} />
                  <span>Security Center</span>
                </div>
              </div>
            </div>

            <div className="sidebar-bottom">
              <div className="premium-card">
                <Sparkles size={20} />

                <div>
                  <h4>AI Protection</h4>
                  <p>Real-time defense active</p>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="main-content">
            {/* TOPBAR */}
            <div className="topbar">
              <div>
                <h1>Email Threat Intelligence</h1>
                <p>
                  Enterprise-level detection powered by AI.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div className="status-live">
                  <span></span>
                  Security Active
                </div>

                <button
                  onClick={handleLogout}
                  className="logout-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>

            {/* DASHBOARD CARDS */}
            <div className="dashboard-cards">
              <div className="dash-card">
                <div className="dash-icon blue">
                  <ShieldCheck size={26} />
                </div>

                <div>
                  <h2>99.2%</h2>
                  <p>Accuracy</p>
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-icon orange">
                  <AlertTriangle size={26} />
                </div>

                <div>
                  <h2>12K+</h2>
                  <p>Blocked</p>
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-icon green">
                  <TrendingUp size={26} />
                </div>

                <div>
                  <h2>24/7</h2>
                  <p>Live Ops</p>
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-icon purple">
                  <Zap size={26} />
                </div>

                <div>
                  <h2>AI</h2>
                  <p>Neural Engine</p>
                </div>
              </div>
            </div>

            {/* MAIN GRID */}
            <div className="main-grid">
              {/* SCANNER */}
              <div className="scanner-card">
                <div className="card-header">
                  <div>
                    <h2>Email Scanner</h2>
                    <p>
                      Paste content for advanced AI analysis.
                    </p>
                  </div>

                  <div className="scan-box">
                    <Mail size={28} />
                  </div>
                </div>

                {/* TEXTAREA */}
                <textarea
                  placeholder="Paste suspicious email content here..."
                  value={emailContent}
                  onChange={(e) =>
                    setEmailContent(e.target.value)
                  }
                />

                {/* SCAN BUTTON */}
                <button onClick={scanEmail}>
                  {loading ? (
                    <>
                      <Activity
                        className="spin-icon"
                        size={20}
                      />
                      AI Scanning...
                    </>
                  ) : (
                    <>
                      <ScanSearch size={20} />
                      Run Security Scan
                    </>
                  )}
                </button>

                {/* RESULT */}
                {result && (
                  <div className="result-box">
                    <div className="result-top">
                      <div className="threat-score">
                        <div className="circle-progress">
                          {result.spamScore}%
                        </div>

                        <div>
                          <h3>Threat Score</h3>
                          <p>Risk Level</p>
                        </div>
                      </div>

                      <div
                        className={
                          isSpam
                            ? "status danger"
                            : "status safe"
                        }
                      >
                        {isSpam ? (
                          <>
                            <AlertTriangle size={16} />
                            Dangerous
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={16} />
                            Safe Email
                          </>
                        )}
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div className="email-details">
                      <div className="detail-card">
                        <h4>Spam Type</h4>
                        <p>{result.type || "N/A"}</p>
                      </div>

                      <div className="detail-card">
                        <h4>Server</h4>
                        <p>{result.server || "N/A"}</p>
                      </div>

                      <div className="detail-card">
                        <h4>Provider</h4>
                        <p>{result.provider || "N/A"}</p>
                      </div>
                    </div>

                    {/* ANALYSIS */}
                    <div className="analysis-grid">
                      <div className="analysis-card">
                        <Globe size={24} />
                        <h4>Phishing</h4>
                        <p>Link analysis complete.</p>
                      </div>

                      <div className="analysis-card">
                        <Mail size={24} />
                        <h4>Behavior</h4>
                        <p>Patterns verified.</p>
                      </div>

                      <div className="analysis-card">
                        <Lock size={24} />
                        <h4>Reputation</h4>
                        <p>Domain checked.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ANALYTICS */}
              <div className="analytics-panel">
                {/* AREA CHART */}
                <div className="chart-card">
                  <div className="chart-header">
                    <div>
                      <h3>Threat Activity</h3>
                      <p>Weekly report</p>
                    </div>

                    <TrendingUp size={22} />
                  </div>

                  <ResponsiveContainer
                    width="100%"
                    height={220}
                  >
                    <AreaChart data={trafficData}>
                      <Tooltip />

                      <Area
                        type="monotone"
                        dataKey="threats"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* PIE CHART */}
                <div className="chart-card">
                  <div className="chart-header">
                    <div>
                      <h3>Classification</h3>
                      <p>AI categorized</p>
                    </div>

                    <BarChart3 size={22} />
                  </div>

                  <ResponsiveContainer
                    width="100%"
                    height={240}
                  >
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        dataKey="value"
                      >
                        {pieData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={COLORS[i]}
                          />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;