import queryModel from "../models/queryModel.js";

export const createQuery = async (req, res) => {
  try {
    const { title, description, subject } = req.body;

    const query = await queryModel.create({
      title,
      description,
      subject,
      askedBy: req.user.id   // assuming auth middleware sets req.user
    });

    res.status(201).json({ success: true, query });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getQueries = async (req, res) => {
  try {
    const queries = await queryModel.find()
      .populate("askedBy", "name email")
      .populate("answers.answeredBy", "name email")
      .sort({ createdAt: -1 }); // newest first

    res.json({ success: true, queries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const answerQuery = async (req, res) => {
  try {
    const { id } = req.params; // query ID
    const { answer } = req.body;

    const query = await queryModel.findById(id);
    if (!query) return res.status(404).json({ success: false, message: "Query not found" });

    query.answers.push({
      answer,
      answeredBy: req.user.id
    });

    await query.save();

    res.json({ success: true, query });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateQueryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    const query = await queryModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!query) return res.status(404).json({ success: false, message: "Query not found" });

    res.json({ success: true, query });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
