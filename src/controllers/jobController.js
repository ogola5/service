const Job = require('../models/Job');

// Create a Job
exports.createJob = async (req, res) => {
  try {
    const job = new Job({ ...req.body, postedBy: req.user.userId });
    await job.save();
    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create job', error: error.message });
  }
};

// Get Jobs with Filtering and Pagination
exports.getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', ...filters } = req.query;

    const jobs = await Job.find(filters)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('postedBy', 'username');

    const totalJobs = await Job.countDocuments(filters);

    res.json({
      jobs,
      pagination: {
        totalJobs,
        totalPages: Math.ceil(totalJobs / limit),
        currentPage: Number(page),
      },
    });
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch jobs', error: error.message });
  }
};

// Apply to a Job
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { applicationMessage, rate } = req.body;

    const job = await Job.findByIdAndUpdate(
      jobId,
      {
        $push: {
          applicants: { userId: req.user.userId, applicationMessage, rate },
        },
      },
      { new: true, runValidators: true }
    );

    if (!job) return res.status(404).json({ message: 'Job not found' });

    res.json({ message: 'Application submitted successfully', job });
  } catch (error) {
    res.status(400).json({ message: 'Failed to apply to job', error: error.message });
  }
};

// Select a Job Provider
exports.selectProvider = async (req, res) => {
  try {
    const { jobId, providerId } = req.body;

    const job = await Job.findById(jobId);

    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user.userId)
      return res.status(403).json({ message: 'You are not authorized to select a provider for this job' });

    job.selectedProvider = providerId;
    await job.save();

    res.json({ message: 'Provider selected successfully', job });
  } catch (error) {
    res.status(400).json({ message: 'Failed to select provider', error: error.message });
  }
};
