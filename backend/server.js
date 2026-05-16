require('dotenv').config({ quiet: true });

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const DOMPurify = require("isomorphic-dompurify");

const app = express();

/* =======================================================
   🔐 SECURITY MIDDLEWARES
======================================================= */

app.use(helmet());
app.use(helmet.frameguard({ action: "deny" }));

app.use(express.json({ limit: "10kb" }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  })
);

/* 🚫 BLOCK DIRECT ACCESS (Only frontend allowed) */
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || origin !== "http://localhost:3000") {
    return res.status(403).json({
      success: false,
      error: "Access denied - Unauthorized origin",
    });
  }

  next();
});

/* =======================================================
   ⚡ RATE LIMITING (ANTI-SPAM ATTACK)
======================================================= */

const scanLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: "Too many requests!",
    message: "You exceeded scan limit (10 per minute).",
  },
});

/* =======================================================
   🗄️ DATABASE CONNECTION (MYSQL POOL)
======================================================= */

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "spam_detector",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/* DB TEST CONNECTION */
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Database Connected Successfully");
    connection.release();
  }
});

/* =======================================================
   👤 SIGNUP API
======================================================= */

app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password required",
    });
  }

  const checkUser = "SELECT * FROM users WHERE email = ?";

  db.query(checkUser, [email], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const insertUser = "INSERT INTO users (email, password) VALUES (?, ?)";

    db.query(insertUser, [email, password], (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      return res.json({
        success: true,
        message: "Account created successfully",
      });
    });
  });
});

/* =======================================================
   🔐 LOGIN API
======================================================= */

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password required",
    });
  }

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    if (results.length > 0) {
      return res.json({
        success: true,
        message: "Login successful",
        user: {
          email: results[0].email,
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  });
});

/* =======================================================
   📧 MAIN SCAN ENGINE (AI LOGIC)
======================================================= */

app.post("/scan", scanLimiter, (req, res) => {
  try {
    let { emailContent } = req.body;

    if (!emailContent || typeof emailContent !== "string") {
      return res.status(400).json({
        error: "Email content required",
      });
    }

    /* ---------------- CLEAN INPUT ---------------- */
    const cleanContent = DOMPurify.sanitize(emailContent);
    const normalized = cleanContent.toLowerCase();

    /* ===================================================
       🌐 EMAIL SERVER DETECTION
    =================================================== */

    let senderServer = "Unknown";
    let provider = "Unknown";

    const emailMatch = cleanContent.match(
      /[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
    );

    if (emailMatch) {
      senderServer = emailMatch[1];

      if (senderServer.includes("gmail.com")) {
        provider = "Google Gmail";
      } else if (senderServer.includes("yahoo.com")) {
        provider = "Yahoo Mail";
      } else if (
        senderServer.includes("outlook.com") ||
        senderServer.includes("hotmail.com")
      ) {
        provider = "Microsoft Outlook";
      } else if (senderServer.includes("icloud.com")) {
        provider = "Apple iCloud Mail";
      } else if (senderServer.includes("proton.me")) {
        provider = "Proton Mail";
      } else {
        provider = "Unknown / Suspicious Domain";
      }
    }

    /* ===================================================
       🚨 SPAM DETECTION ENGINE
    =================================================== */

    const spamKeywords = [
      "free", "winner", "lottery", "urgent", "money",
      "click here", "claim now", "bank", "password",
      "verify", "suspend", "login", "security",
      "bitcoin", "gift card", "limited time"
    ];

    let spamScore = 0;

    spamKeywords.forEach((word) => {
      if (normalized.includes(word)) {
        spamScore += 15;
      }
    });

    const linkPattern = /https?:\/\/[^\s]+/g;
    if (linkPattern.test(cleanContent)) {
      spamScore += 25;
    }

    /* ===================================================
       📊 STATUS CLASSIFICATION
    =================================================== */

    let status = "Safe";

    if (spamScore >= 40 && spamScore < 65) {
      status = "Spam";
    } else if (spamScore >= 65) {
      status = "Phishing/Dangerous";
    }

    /* ===================================================
       🧠 SPAM TYPE CLASSIFICATION (AI LOGIC)
    =================================================== */

    let type = "Normal Email";

    if (normalized.includes("winner") || normalized.includes("lottery")) {
      type = "Lottery Scam";
    } else if (normalized.includes("bank") || normalized.includes("password")) {
      type = "Phishing Attack";
    } else if (normalized.includes("urgent")) {
      type = "Urgent Scam";
    } else if (normalized.includes("bitcoin")) {
      type = "Crypto Scam";
    } else if (linkPattern.test(cleanContent)) {
      type = "Malicious Link Spam";
    }

    /* ===================================================
       ⚠️ RISK LEVEL ENGINE
    =================================================== */

    let riskLevel = "Low";

    if (spamScore >= 30) riskLevel = "Medium";
    if (spamScore >= 60) riskLevel = "High";

    /* ===================================================
       💾 SAVE TO DATABASE
    =================================================== */

    const sql =
      "INSERT INTO scan_logs (email_text, spam_score, status) VALUES (?, ?, ?)";

    db.query(sql, [
      cleanContent.substring(0, 500),
      spamScore,
      status
    ]);

    /* ===================================================
       📤 FINAL RESPONSE (FRONTEND DASHBOARD READY)
    =================================================== */

    return res.json({
      spamScore,
      status,
      type,
      riskLevel,
      server: senderServer,
      provider: provider,
      recommendation:
        status === "Safe"
          ? "Email is safe to open"
          : "⚠ This email looks suspicious!",
    });

  } catch (error) {
    console.error("Server Error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

/* =======================================================
   ❌ 404 HANDLER
======================================================= */

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

/* =======================================================
   🚀 START SERVER
======================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});