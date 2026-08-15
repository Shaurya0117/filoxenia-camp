const prisma = require('../config/db');

const getIncidents = async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      include: {
        camper: { select: { id: true, first_name: true, last_name: true } },
        reporter: { select: { id: true, name: true } }
      },
      orderBy: { date: 'desc' }
    });
    res.json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: 'Server error fetching incidents' });
  }
};

const createIncident = async (req, res) => {
  try {
    const { camper_id, type, description, action_taken, date } = req.body;
    
    if (!type || !description) {
      return res.status(400).json({ error: 'Type and description are required' });
    }

    const incident = await prisma.incident.create({
      data: {
        camper_id: camper_id ? parseInt(camper_id) : null,
        type,
        description,
        action_taken: action_taken || null,
        date: date ? new Date(date) : new Date(),
        reported_by: req.user ? req.user.id : null
      },
      include: {
        camper: true,
        reporter: { select: { id: true, name: true } }
      }
    });

    res.status(201).json(incident);
  } catch (error) {
    console.error('Error creating incident:', error);
    res.status(500).json({ error: 'Server error creating incident' });
  }
};

module.exports = {
  getIncidents,
  createIncident
};
