import { Template } from "../models/template.model.js";
import apiErrors from "../utils/apiErrors.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get all templates
const getAllTemplates = asyncHandler(async (req, res) => {
  console.log("Load user form template controller", req.user);
  const templates = await Template.find().sort({ createdAt: -1 });
  if (!templates || templates.length === 0) {
    throw new apiErrors(404, "No templates fund");
  }
  res
    .status(200)
    .json(new apiResponse(200, templates, "Template found successfully"));
});

// Get templates by slug
const getTemplateBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const template = await Template.findOne({ slug });
  if (!template) {
    throw new apiErrors(404, "Template not found");
  }
  res
    .status(200)
    .json(new apiResponse(200, template, "Template fetched successfully"));
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
    .status(201)
    .json(
      new apiResponse(
        201,
        { template: newTemplate },
        "Template create successful"
      )
    );
});
// Update Template

const updateTemplate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new apiErrors(400, "Template Id is required");
  }
  const update = await Template.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!update) {
    throw new apiErrors(404, "Template not found");
  }
  res
    .status(200)
    .json(
      new apiResponse(200, { data: update }, "Template updated successfully")
    );
});

// Delete Template

const deleteTemplate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new apiErrors(400, "Template Id is required");
  }
  const deletedTemplate = await Template.findByIdAndDelete(id);
  if (!deleteTemplate) {
    throw new apiErrors(404, "Template not found");
  }
  res
    .status(200)
    .json(
      new apiResponse(
        200,
        { data: deleteTemplate },
        "Template Deleted Successfully"
      )
    );
});

export {
  getAllTemplates,
  getTemplateBySlug,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};
