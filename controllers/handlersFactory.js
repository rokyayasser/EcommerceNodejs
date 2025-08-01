const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // First, get the document (do NOT delete yet)
    const document = await Model.findById(id);
    if (!document) {
      return next(new ApiError(`No document found for this id ${id}`, 404));
    }

    // Trigger deleteOne middleware
    await document.deleteOne(); // ✅ this now triggers your `post('deleteOne')`

    res.status(204).json({ status: "success", data: null });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    //Trigger "save" event
    document.save();
    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne = (Model, populationOpts) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    //1- Build the query
    let query = Model.findById(id);
    if (populationOpts) {
      query = query.populate(populationOpts);
    }

    //2- Execute the query
    const document = await query;
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    res.status(200).json({ data: document.toJSON() });
  });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const documentsCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCount)
      .filter()
      .search(modelName)
      .sort()
      .limitFields();

    const { mongooseQuery, paginationResult } = apiFeatures;

    const documents = await mongooseQuery;

    res.status(200).json({
      results: documents.length,
      paginationResult,
      data: documents,
    });
  });
