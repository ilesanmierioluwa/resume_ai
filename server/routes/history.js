import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Analysis from '../models/Analysis.js';
import ChatMessage from '../models/ChatMessage.js';

const router = express.Router();

/**
 * Returns all analyses for the authenticated user sorted by newest first.
 *
 * @param {import('express').Request} req - Authenticated request object.
 * @param {import('express').Response} res - Response containing analysis history.
 * @returns {Promise<void>} Resolves after history is fetched.
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user.id })
      .select('-resumeText')
      .sort({ createdAt: -1 });

    res.json({ analyses });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch history.', error: error.message });
  }
});

/**
 * Returns one analysis and its linked chat messages for the authenticated user.
 *
 * @param {import('express').Request} req - Request containing the analysis id route parameter.
 * @param {import('express').Response} res - Response containing one analysis and chat history.
 * @returns {Promise<void>} Resolves after the analysis is fetched.
 */
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.user.id });

    if (!analysis) {
      res.status(404).json({ message: 'Analysis not found.' });
      return;
    }

    const messages = await ChatMessage.find({ analysisId: analysis._id, userId: req.user.id }).sort({ createdAt: 1 });
    res.json({ analysis, messages });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch analysis.', error: error.message });
  }
});

export default router;

