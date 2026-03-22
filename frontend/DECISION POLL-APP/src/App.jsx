import { useState, useEffect } from "react";
import PollForm from "./components/PollForm";
import PollList from "./components/polllist";
import Login from "./Pages/Login";
import Signup from "./Pages/signup";
import "./styles/main.css";

function App() {
  const [user, setUser] = useState(null);
  const [isSignup, setIsSignup] = useState(false);

  // ✅ Check token on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(true);
    }
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // ❌ Not logged in → show auth pages
  if (!user) {
    return (
      <div className="app">
        <h1>Decision Poll App</h1>

        {isSignup ? (
          <>
            <Signup setUser={setUser} />
            <p onClick={() => setIsSignup(false)}>
              Already have an account? Login
            </p>
          </>
        ) : (
          <>
            <Login setUser={setUser} />
            <p onClick={() => setIsSignup(true)}>
              Don't have an account? Signup
            </p>
          </>
        )}
      </div>
    );
  }

  // ✅ Logged in → show poll app
  return (
    <div className="app">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Decision Poll App</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <PollForm />
      <PollList />
    </div>
  );
}

export default App;