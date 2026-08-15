const prisma = require('../config/db');

const getCheckinLogs = async (req, res) => {
  try {
    const logs = await prisma.checkinLog.findMany({
      include: {
        registration: {
          include: { camper: true, period: true }
        },
        scanner: { select: { name: true } }
      },
      orderBy: { scanned_at: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching checkin logs:', error);
    res.status(500).json({ error: 'Failed to fetch checkin logs' });
  }
};

const scanQR = async (req, res) => {
  try {
    const { registration_code, event_type } = req.body; // event_type: 'arrival' or 'departure'
    const scanned_by = req.user.id;

    // Find registration by QR code
    const registration = await prisma.registration.findUnique({
      where: { registration_code },
      include: { camper: true, period: true }
    });

    if (!registration) {
      return res.status(404).json({ error: 'Invalid QR code. Registration not found.' });
    }

    if (registration.status !== 'enrolled') {
      return res.status(400).json({ error: 'Camper is not enrolled in this period.' });
    }

    // Log the checkin/checkout
    const log = await prisma.checkinLog.create({
      data: {
        registration_id: registration.id,
        event_type,
        scanned_by
      }
    });

    res.status(201).json({
      message: `Successfully logged ${event_type}`,
      log,
      camper: `${registration.camper.first_name} ${registration.camper.last_name}`,
      period: registration.period.name
    });
  } catch (error) {
    console.error('Error scanning QR:', error);
    res.status(500).json({ error: 'Failed to process QR scan' });
  }
};

module.exports = {
  getCheckinLogs,
  scanQR
};
