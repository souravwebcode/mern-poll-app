import { useState } from "react";
import axios from "axios";

export default function PollForm({ refresh }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]); // ✅ 4 options
  const [images, setImages] = useState([null, null, null, null]); // ✅ 4 images
  const [expiry, setExpiry] = useState("");

  const handleSubmit = async () => {
    try {
      // ✅ Validation
      if (!question || !expiry || options.some((o) => !o.trim())) {
        return alert("Fill all fields");
      }

      const formData = new FormData();

      formData.append("question", question);
      formData.append("expiry", new Date(expiry).toISOString());

      // ✅ Append options (IMPORTANT)
      options.forEach((opt) => {
        formData.append("options", opt);
      });

      // ✅ Append images
      images.forEach((img) => {
        if (img) formData.append("images", img);
      });

      await axios.post("http://localhost:5000/api/polls", formData);

      alert("Poll Created!");

      // ✅ Reset form properly
      setQuestion("");
      setOptions(["", "", "", ""]);
      setImages([null, null, null, null]);
      setExpiry("");

      if (refresh) refresh();

    } catch (err) {
      console.error("FRONTEND ERROR:", err);
      alert(err.response?.data?.message || "Server Error");
    }
  };

  return (
    <div className="poll-form">
      {/* Question */}
      <input
        placeholder="Enter Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {/* Options + Images */}
      {options.map((opt, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <input
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => {
              const newOpts = [...options];
              newOpts[i] = e.target.value;
              setOptions(newOpts);
            }}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const newImgs = [...images];
              newImgs[i] = e.target.files[0];
              setImages(newImgs);
            }}
          />
        </div>
      ))}

      {/* Expiry */}
      <input
        type="datetime-local"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
      />

      <button onClick={handleSubmit}>Create Poll</button>
    </div>
  );
}