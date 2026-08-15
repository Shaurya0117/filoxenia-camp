const prisma = require('../config/db');

const getMedicalRecords = async (req, res) => {
  try {
    const records = await prisma.medicalRecord.findMany({
      include: {
        camper: true
      },
      orderBy: { submitted_at: 'desc' }
    });
    res.json(records);
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({ error: 'Failed to fetch medical records' });
  }
};

const createOrUpdateMedicalRecord = async (req, res) => {
  try {
    const { camper_id, allergies, conditions, medications, emergency_contact, emergency_phone } = req.body;
    
    // Check if record exists
    const existingRecord = await prisma.medicalRecord.findFirst({
      where: { camper_id: Number(camper_id) }
    });

    let record;
    if (existingRecord) {
      record = await prisma.medicalRecord.update({
        where: { id: existingRecord.id },
        data: {
          allergies,
          conditions: conditions ? JSON.stringify(conditions) : "[]",
          medications,
          emergency_contact,
          emergency_phone,
          status: 'parent_submitted',
          submitted_at: new Date()
        }
      });
    } else {
      record = await prisma.medicalRecord.create({
        data: {
          camper_id: Number(camper_id),
          allergies,
          conditions: conditions ? JSON.stringify(conditions) : "[]",
          medications,
          emergency_contact,
          emergency_phone,
          status: 'parent_submitted',
          submitted_at: new Date()
        }
      });
    }

    res.json(record);
  } catch (error) {
    console.error('Error saving medical record:', error);
    res.status(500).json({ error: 'Failed to save medical record' });
  }
};

const reviewMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g., doctor_reviewed

    const record = await prisma.medicalRecord.update({
      where: { id: Number(id) },
      data: { status }
    });

    res.json(record);
  } catch (error) {
    console.error('Error reviewing medical record:', error);
    res.status(500).json({ error: 'Failed to review medical record' });
  }
};

module.exports = {
  getMedicalRecords,
  createOrUpdateMedicalRecord,
  reviewMedicalRecord
};
