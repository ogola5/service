const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  try {
    const job = new Job({ ...req.body, postedBy: req.user.userId });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    // Basic filtering based on query params - you can expand this
    const jobs = await Job.find(req.query).populate('postedBy', 'username');
    res.json(jobs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.applyToJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const { pitch, rate } = req.body;
    const job = await Job.findByIdAndUpdate(
      jobId,
      { $push: { applicants: { userId: req.user.userId, pitch, rate } } },
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.selectProvider = async (req, res) => {
  try {
    const { jobId, providerId } = req.body;
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { selectedProvider: providerId },
      { new: true, runValidators: true }
    );
    if (!updatedJob) return res.status(404).json({ message: 'Job not found' });
    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};