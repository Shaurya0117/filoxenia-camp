const prisma = require('../config/db');

const getPeriods = async (req, res) => {
  try {
    const periods = await prisma.period.findMany({
      orderBy: { start_date: 'desc' }
    });
    res.json(periods);
  } catch (error) {
    console.error('Error fetching periods:', error);
    res.status(500).json({ error: 'Failed to fetch periods' });
  }
};

const getPeriodById = async (req, res) => {
  try {
    const { id } = req.params;
    const period = await prisma.period.findUnique({
      where: { id: Number(id) },
      include: {
        registrations: true,
        groups: true
      }
    });
    if (!period) return res.status(404).json({ error: 'Period not found' });
    res.json(period);
  } catch (error) {
    console.error('Error fetching period:', error);
    res.status(500).json({ error: 'Failed to fetch period' });
  }
};

const createPeriod = async (req, res) => {
  try {
    const period = await prisma.period.create({
      data: {
        ...req.body,
        start_date: new Date(req.body.start_date),
        end_date: new Date(req.body.end_date)
      }
    });
    res.status(201).json(period);
  } catch (error) {
    console.error('Error creating period:', error);
    res.status(500).json({ error: 'Failed to create period' });
  }
};

const updatePeriod = async (req, res) => {
  try {
    const { id } = req.params;
    const period = await prisma.period.update({
      where: { id: Number(id) },
      data: {
        ...req.body,
        start_date: req.body.start_date ? new Date(req.body.start_date) : undefined,
        end_date: req.body.end_date ? new Date(req.body.end_date) : undefined,
      }
    });
    res.json(period);
  } catch (error) {
    console.error('Error updating period:', error);
    res.status(500).json({ error: 'Failed to update period' });
  }
};

const deletePeriod = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.period.delete({ where: { id: Number(id) } });
    res.json({ message: 'Period deleted successfully' });
  } catch (error) {
    console.error('Error deleting period:', error);
    res.status(500).json({ error: 'Failed to delete period' });
  }
};

module.exports = {
  getPeriods,
  getPeriodById,
  createPeriod,
  updatePeriod,
  deletePeriod
};
