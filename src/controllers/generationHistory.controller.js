import { GenerationHistory } from "../models/generationHistory.model.js";
import apiErrors from "../utils/apiErrors.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create Generation History
const createGenerationHistory = asyncHandler(async (req, res) => {
  const { template, inputData, generatedOutput, tokensUsed, creditsUsed } =
    req.body;
  if (!template || !inputData || !generatedOutput) {
    throw new apiErrors(400, "Required fields missing");
  }
  const history = await GenerationHistory.create({
    user: req.user._id,
    template,
    inputData,
    generatedOutput,
    tokensUsed: tokensUsed || 0,
    creditsUsed: creditsUsed || 0,
  });
  res
    .status(201)
    .json(
      new apiResponse(
        201,
        { data: history },
        "Generation History created successfully"
      )
    );
});

// Get all generation history for loggedIn user

const getAllGenerationHistory = asyncHandler(async (req, res) => {
  const historyList = await GenerationHistory.find({
    user: req.user._id,
  })
    .populate("template", "title slug category -_id")
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json(
      new apiResponse(200, { data: historyList }, "Load all generation history")
    );
});

// Get single generation history by id

const getSingleGenerationHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const history = await GenerationHistory.findOne({
    _id: id,
    user: req.user._id,
  }).populate("template", "title slug");
  if (!history) {
    throw new apiErrors(404, "Generation history not found");
  }
  res
    .status(200)
    .json(
      new apiResponse(200, { data: history }, "Generation history fetched")
    );
});

// Update generation history

const updateGenerationHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedHistory = await GenerationHistory.findOneAndUpdate(
    {
      _id: id,
      user: req.user._id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedHistory) {
    throw new apiErrors(404, "Generation history not found");
  }
  res
    .status(200)
    .json(
      new apiResponse(
        200,
        { data: updatedHistory },
        "Generation history updated"
      )
    );
});

// Delete Generation history

const deleteGenerationHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedHistory = await GenerationHistory.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });
  if (!deletedHistory) {
    throw new apiErrors(404, "Generation history not found");
  }
  res
    .status(200)
    .json(
      new apiResponse(
        200,
        { data: deletedHistory },
        "Generation history deleted"
      )
    );
});

export {
  createGenerationHistory,
  getAllGenerationHistory,
  getSingleGenerationHistory,
  updateGenerationHistory,
  deleteGenerationHistory,
};
