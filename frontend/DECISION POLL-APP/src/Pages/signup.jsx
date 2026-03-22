// pages/Signup.jsx
import { useState } from "react";
import { signupUser } from "../services/AuthApi";

export default function Signup({setuser}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    try {
      await signupUser(form);
      alert("Signup Success!");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="auth">
      <h2>Signup</h2>

      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={handleSubmit}>Signup</button>
    </div>
  );
}