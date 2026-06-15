const Example = require('../models/Example');

const getExamples = async (req, res, next) => {
  try {
    const examples = await Example.find().sort({ createdAt: -1 });
    res.json({ success: true, count: examples.length, data: examples });
  } catch (error) {
    next(error);
  }
};

const getExampleById = async (req, res, next) => {
  try {
    const example = await Example.findById(req.params.id);
    if (!example) {
      res.status(404);
      throw new Error('Example not found');
    }
    res.json({ success: true, data: example });
  } catch (error) {
    next(error);
  }
};

const createExample = async (req, res, next) => {
  try {
    const example = await Example.create(req.body);
    res.status(201).json({ success: true, data: example });
  } catch (error) {
    next(error);
  }
};

const updateExample = async (req, res, next) => {
  try {
    const example = await Example.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!example) {
      res.status(404);
      throw new Error('Example not found');
    }
    res.json({ success: true, data: example });
  } catch (error) {
    next(error);
  }
};

const deleteExample = async (req, res, next) => {
  try {
    const example = await Example.findByIdAndDelete(req.params.id);
    if (!example) {
      res.status(404);
      throw new Error('Example not found');
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExamples,
  getExampleById,
  createExample,
  updateExample,
  deleteExample,
};
