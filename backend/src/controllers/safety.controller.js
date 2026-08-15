const prisma = require('../config/db');

const getSafetyChecks = async (req, res) => {
  try {
    const checks = await prisma.safetyCheck.findMany({
      include: {
        inspector: { select: { id: true, name: true } }
      },
      orderBy: { date: 'desc' }
    });
    res.json(checks);
  } catch (error) {
    console.error('Error fetching safety checks:', error);
    res.status(500).json({ error: 'Server error fetching safety checks' });
  }
};

const createSafetyCheck = async (req, res) => {
  try {
    const { area, status, notes, date } = req.body;
    
    if (!area) {
      return res.status(400).json({ error: 'Area is required' });
    }

    const check = await prisma.safetyCheck.create({
      data: {
        area,
        status: status || 'pass',
        notes: notes || null,
        date: date ? new Date(date) : new Date(),
        inspector_id: req.user ? req.user.id : null
      },
      include: {
        inspector: { select: { id: true, name: true } }
      }
    });

    res.status(201).json(check);
  } catch (error) {
    console.error('Error creating safety check:', error);
    res.status(500).json({ error: 'Server error creating safety check' });
  }
};

module.exports = {
  getSafetyChecks,
  createSafetyCheck
};
