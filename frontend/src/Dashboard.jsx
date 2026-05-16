import React, { useState } from "react";
import axios from "axios";

function Dashboard() {
  const [emailContent, setEmailContent] = useState("");
  const [result, setResult] = useState(null);

  const scanEmail = async () => {
    const res = await axios.post("http://localhost:5000/scan", {
      emailContent,
    });

    setResult(res.data);
  };

  return (
    <div style={styles.container}>
      <h1>Email Spam Detector AI</h1>

      <textarea
        placeholder="Paste email here..."
        onChange={(e) => setEmailContent(e.target.value)}
        style={styles.textarea}
      />

      <button onClick={scanEmail} style={styles.button}>
        Scan Email
      </button>

      {result && (
        <div style={styles.card}>
          <h3>Result</h3>
          <p>Spam Score: {result.spamScore}%</p>
          <p>Status: {result.status}</p>
          <p>Type: {result.type}</p>
          <p>Risk: {result.riskLevel}</p>
          <p>Provider: {result.provider}</p>
          <p>Server: {result.server}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
    textAlign: "center",
  },
  textarea: {
    width: "60%",
    height: "150px",
    padding: "10px",
    margin: "20px",
  },
  button: {
    padding: "10px 20px",
    background: "#3b82f6",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  card: {
    marginTop: "20px",
    padding: "20px",
    background: "#1e293b",
    borderRadius: "10px",
  },
};

export default Dashboard;