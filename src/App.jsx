import React, { useState, useEffect } from "react";
import { gapi } from "gapi-script";

// ==== Your Credentials ====
const CLIENT_ID = "39379073787-gnq31beeka04q1c0r0onhc0a13ifv5sj.apps.googleusercontent.com";
const API_KEY = "AIzaSyA80giW7aEIefPM76FLylNZPjIqxHMCoyk";
const SHEET_ID = "1FCuCfOTr_UNcR6_fwqjFL5DpIYNjF1BjfpsguibsT_M";
const SHEET_NAME = "Attendance"; // Change if your sheet tab name is different
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

function App() {
  const [students, setStudents] = useState([
    { name: "Alice", present: "", grade: "", remarks: "" },
    { name: "Bob", present: "", grade: "", remarks: "" },
    { name: "Charlie", present: "", grade: "", remarks: "" },
  ]);

  // Load Google API Client
  useEffect(() => {
    function start() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
        })
        .then(() => console.log("✅ GAPI client loaded"));
    }
    gapi.load("client:auth2", start);
  }, []);

  // Google Sign In / Out
  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  // Save data to Google Sheets
  const saveToSheet = () => {
    const today = new Date().toISOString().split("T")[0];
    const values = students.map((s) => [
      today,
      s.name,
      s.present,
      s.grade,
      s.remarks,
    ]);

    gapi.client.sheets.spreadsheets.values
      .append({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A:E`,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        resource: { values },
      })
      .then(() => {
        alert("✅ Attendance saved to Google Sheet!");
      })
      .catch((err) => {
        console.error("❌ Error saving to sheet:", err);
        alert("Error saving to Google Sheet. Check console for details.");
      });
  };

  // Update student values in form
  const updateStudent = (index, field, value) => {
    const updated = [...students];
    updated[index][field] = value;
    setStudents(updated);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📋 Attendance & Grades</h1>
      <div>
        <button onClick={handleSignIn}>Sign In with Google</button>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>

      <table border="1" style={{ marginTop: "20px", width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Present? (Yes/No)</th>
            <th>Grade</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={i}>
              <td>{s.name}</td>
              <td>
                <input
                  value={s.present}
                  onChange={(e) => updateStudent(i, "present", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={s.grade}
                  onChange={(e) => updateStudent(i, "grade", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={s.remarks}
                  onChange={(e) => updateStudent(i, "remarks", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "green",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
        onClick={saveToSheet}
      >
        ✅ Save to Google Sheet
      </button>
    </div>
  );
}

export default App;
