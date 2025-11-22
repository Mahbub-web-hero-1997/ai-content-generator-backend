
import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Template title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Template slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Template description is required"],
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Template category is required"],
      trim: true,
      enum: [
        "marketing",
        "ecommerce",
        "social media",
        "blogging",
        "business",
        "caption",
        "product",
        "email",
        "ad",
        "productivity",
        "education",
        "entertainment",
        "other",
      ],
      default: "other",
    },
    inputFields: [
      {
        name: {
          type: String,
          required: true,
        },
        placeholder: {
          type: String,
          default: "",
        },
        type: {
          type: String,
          enum: ["text", "textarea", "number", "email"],
          default: "text",
        },
        required: {
          type: Boolean,
          default: true,
        },
      },
    ],
    aiPrompt: {
      type: String,
      required: [true, "AI prompt is required"],
    },
    exampleOutput: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Template = mongoose.model("Template", templateSchema);
  