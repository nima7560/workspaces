import Contact from "../models/Contact.js";

export const saveContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save to database
    const contact = await Contact.create({ name, email, message });
    res.status(201).json({ message: "Contact saved successfully", contact });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
