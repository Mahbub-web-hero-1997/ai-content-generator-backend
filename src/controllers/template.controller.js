import { Template } from "../models/template.model";
import apiErrors from "../utils/apiErrors";
import apiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";

// Get all templates
const getAllTemplates = asyncHandler(async (req, res) => {
  const templates = await Template.find().sort({ createdAt: -1 });
  if (!templates || templates.length === 0) {
    throw new apiErrors(404, "No templates fund");
  }
  res
    .status(200)
    .json(new apiResponse(200, templates, "Template found successfully"));
});

// Get templates by slug
const getAllTemplateBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const template = await Template.findOne({ slug });
  if (!template) {
    throw new apiErrors(404, "Template not found");
  }
  res.status(200).json(200, template, "Template fetched successfully");
});

// Create a new template

const createTemplate = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    description,
    category,
    inputFields,
    aiPrompt,
    exampleOutput,
  } = req.body;
  if (!title || !slug || !category || !aiPrompt) {
    throw new apiErrors(400, "All fields are required");
  }
  const existing = await Template.findOne({ slug });
  if (existing) {
    throw new apiErrors(400, "Template already exists");
  }
  const newTemplate = await Template.create({
    title,
    slug,
    description: description || "",
    category,
    inputFields: inputFields || [],
    aiPrompt,
    exampleOutput: exampleOutput || "",
    createdBy: req.user._id,
  });
  if (!newTemplate) {
    throw new apiErrors(500, "Failed to create new template");
  }
  res
    .status(200)
    .json(
      new apiResponse(
        200,
        { template: newTemplate },
        "Template create successful"
      )
    );
});

export { getAllTemplates, getAllTemplateBySlug, createTemplate };
