const prisma = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const getRegistrations = async (req, res) => {
  try {
    const registrations = await prisma.registration.findMany({
      include: {
        camper: true,
        period: true,
        payments: true
      },
      orderBy: { submitted_at: 'desc' }
    });
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
};

const createRegistration = async (req, res) => {
  try {
    const { camper_id, period_id, overnight_type } = req.body;

    // Check capacity
    const period = await prisma.period.findUnique({
      where: { id: Number(period_id) },
      include: { _count: { select: { registrations: true } } }
    });

    if (!period) return res.status(404).json({ error: 'Period not found' });

    let status = 'enrolled';
    if (period._count.registrations >= period.capacity) {
      status = 'waitlisted';
    }

    // Flag mismatches (age or gender)
    const camper = await prisma.camper.findUnique({ where: { id: Number(camper_id) } });
    let has_mismatch_flag = false;
    
    if (period.gender && period.gender.toLowerCase() !== 'all' && camper.gender.toLowerCase() !== period.gender.toLowerCase()) {
      has_mismatch_flag = true;
    }

    const registration = await prisma.registration.create({
      data: {
        camper_id: Number(camper_id),
        period_id: Number(period_id),
        overnight_type,
        status,
        has_mismatch_flag,
        registration_code: uuidv4() // Generate a unique QR code payload
      },
      include: { camper: true, period: true }
    });

    res.status(201).json(registration);
  } catch (error) {
    console.error('Error creating registration:', error);
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Camper is already registered for this period' });
    }
    res.status(500).json({ error: 'Failed to create registration' });
  }
};

const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const registration = await prisma.registration.update({
      where: { id: Number(id) },
      data: { status }
    });
    res.json(registration);
  } catch (error) {
    console.error('Error updating registration:', error);
    res.status(500).json({ error: 'Failed to update registration' });
  }
};

module.exports = {
  getRegistrations,
  createRegistration,
  updateRegistrationStatus
};
