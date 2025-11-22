import mongoose from "mongoose";

const generationHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      required: true,
    },
    inputData: {
      type: Object,
      required: true,
    },
    generatedOutput: {
      type: String,
      required: true,
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
    creditsUsed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const GenerationHistory = mongoose.model(
  "GenerationHistory",
  generationHistorySchema
);
