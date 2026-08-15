const prisma = require('../config/db');

// Get all food logs
const getFoodLogs = async (req, res) => {
  try {
    const logs = await prisma.foodLog.findMany({
      include: {
        recorder: {
          select: { id: true, name: true }
        }
      },
      orderBy: { date: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching food logs:', error);
    res.status(500).json({ error: 'Server error fetching food logs' });
  }
};

// Create a new food log
const createFoodLog = async (req, res) => {
  try {
    const { type, description, status, date } = req.body;
    
    if (!type || !description) {
      return res.status(400).json({ error: 'Type and description are required' });
    }

    const log = await prisma.foodLog.create({
      data: {
        type,
        description,
        status: status || 'ok',
        date: date ? new Date(date) : new Date(),
        recorded_by: req.user ? req.user.id : null
      },
      include: {
        recorder: {
          select: { id: true, name: true }
        }
      }
    });

    res.status(201).json(log);
  } catch (error) {
    console.error('Error creating food log:', error);
    res.status(500).json({ error: 'Server error creating food log' });
  }
};

module.exports = {
  getFoodLogs,
  createFoodLog
};
