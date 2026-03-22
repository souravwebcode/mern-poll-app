import Poll from "../models/poll.js";

// ✅ CREATE POLL
export const createPoll = async (req, res) => {
  try {
    const { question, expiry } = req.body;

    let options = req.body.options;

    // ✅ Validation
    if (!question || !expiry) {
      return res.status(400).json({ message: "Question & expiry required" });
    }

    if (!options) {
      return res.status(400).json({ message: "Options required" });
    }

    // ✅ Ensure array
    if (!Array.isArray(options)) {
      options = [options];
    }

    // ✅ Remove empty options
    options = options.filter((opt) => opt && opt.trim() !== "");

    if (options.length < 2) {
      return res.status(400).json({ message: "Minimum 2 options required" });
    }

    const files = req.files || [];

    // ✅ Safe mapping
    const formattedOptions = options.map((text, i) => ({
      text,
      image: files[i] ? `/uploads/${files[i].filename}` : "",
      votes: 0,
    }));

    const poll = await Poll.create({
      question,
      options: formattedOptions,
      expiry: new Date(expiry), // ✅ FIX DATE
    });

    res.json(poll);

  } catch (err) {
    console.error("🔥 CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



// ✅ GET POLLS
export const getPolls = async (req, res) => {
  try {
    const now = new Date();

    const polls = await Poll.find();

    const updatedPolls = polls.map((poll) => {
      const isExpired = new Date(poll.expiry) < now;

      const totalVotes = poll.options.reduce(
        (sum, opt) => sum + opt.votes,
        0
      );

      let winner = null;

      if (isExpired && totalVotes > 0) {
        winner = poll.options.reduce((max, opt) =>
          opt.votes > max.votes ? opt : max
        );
      }

      return {
        ...poll._doc,
        status: isExpired ? "Expired" : "Active",
        totalVotes,
        winner,
      };
    });

    res.json(updatedPolls);

  } catch (err) {
    console.error("🔥 GET ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



// ✅ VOTE POLL
export const votePoll = async (req, res) => {
  try {
    const { optionIndex } = req.body;

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (new Date(poll.expiry) < new Date()) {
      return res.status(400).json({ message: "Poll expired" });
    }

    // ✅ Safety check
    if (!poll.options[optionIndex]) {
      return res.status(400).json({ message: "Invalid option" });
    }

    poll.options[optionIndex].votes += 1;

    await poll.save();

    res.json(poll);

  } catch (err) {
    console.error("🔥 VOTE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};