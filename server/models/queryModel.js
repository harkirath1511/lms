import mongoose from "mongoose";

const querySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  askedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  answers: [
    {
      answer: { type: String, required: true },
      answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  status: { type: String, enum: ["open", "closed"], default: "open" },
  createdAt: { type: Date, default: Date.now }
});

const queryModel = mongoose.models.query || mongoose.model("query", querySchema);

export default queryModel;
