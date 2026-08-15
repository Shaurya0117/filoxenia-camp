const prisma = require('../config/db');
const { detectDuplicate } = require('../services/duplicateDetector');

const getCampers = async (req, res) => {
  try {
    const { search, limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
        { contact_phone: { contains: search, mode: 'insensitive' } },
      ]
    } : {};

    const [campers, total] = await Promise.all([
      prisma.camper.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { created_at: 'desc' }
      }),
      prisma.camper.count({ where })
    ]);

    res.json({ campers, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error('Error fetching campers:', error);
    res.status(500).json({ error: 'Failed to fetch campers' });
  }
};

const getCamperById = async (req, res) => {
  try {
    const { id } = req.params;
    const camper = await prisma.camper.findUnique({
      where: { id: Number(id) },
      include: {
        registrations: { include: { period: true } },
        medical_records: true
      }
    });

    if (!camper) return res.status(404).json({ error: 'Camper not found' });
    res.json(camper);
  } catch (error) {
    console.error('Error fetching camper:', error);
    res.status(500).json({ error: 'Failed to fetch camper' });
  }
};

const createCamper = async (req, res) => {
  try {
    const camperData = req.body;
    
    // Check for duplicates
    const duplicateCheck = await detectDuplicate(prisma, camperData);
    
    if (duplicateCheck.isDuplicate && !req.query.force) {
      return res.status(409).json({ 
        error: 'Potential duplicate found', 
        details: duplicateCheck 
      });
    }

    const camper = await prisma.camper.create({
      data: {
        first_name: camperData.first_name,
        last_name: camperData.last_name,
        dob: new Date(camperData.dob),
        gender: camperData.gender,
        address: camperData.address,
        father_name: camperData.father_name,
        father_profession: camperData.father_profession,
        mother_name: camperData.mother_name,
        mother_profession: camperData.mother_profession,
        contact_phone: camperData.contact_phone,
        contact_email: camperData.contact_email,
        is_large_family: camperData.is_large_family || false
      }
    });

    res.status(201).json(camper);
  } catch (error) {
    console.error('Error creating camper:', error);
    res.status(500).json({ error: 'Failed to create camper' });
  }
};

const updateCamper = async (req, res) => {
  try {
    const { id } = req.params;
    const camperData = req.body;

    const camper = await prisma.camper.update({
      where: { id: Number(id) },
      data: {
        first_name: camperData.first_name,
        last_name: camperData.last_name,
        dob: camperData.dob ? new Date(camperData.dob) : undefined,
        gender: camperData.gender,
        address: camperData.address,
        father_name: camperData.father_name,
        father_profession: camperData.father_profession,
        mother_name: camperData.mother_name,
        mother_profession: camperData.mother_profession,
        contact_phone: camperData.contact_phone,
        contact_email: camperData.contact_email,
        is_large_family: camperData.is_large_family
      }
    });

    res.json(camper);
  } catch (error) {
    console.error('Error updating camper:', error);
    res.status(500).json({ error: 'Failed to update camper' });
  }
};

const deleteCamper = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.camper.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Camper deleted successfully' });
  } catch (error) {
    console.error('Error deleting camper:', error);
    res.status(500).json({ error: 'Failed to delete camper' });
  }
};

const enrollCamper = async (req, res) => {
  try {
    const { first_name, last_name, dob, gender, period_id } = req.body;

    if (!first_name || !last_name || !dob || !period_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Atomic transaction to create Camper and Registration
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the camper
      const camper = await tx.camper.create({
        data: {
          first_name,
          last_name,
          dob: new Date(dob),
          gender,
          contact_email: req.user ? req.user.email : null // associate with logged-in parent
        }
      });

      // 2. Create the registration for the selected period
      const registration = await tx.registration.create({
        data: {
          camper_id: camper.id,
          period_id: parseInt(period_id),
          status: 'enrolled'
        }
      });

      return { camper, registration };
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error enrolling camper:', error);
    res.status(500).json({ error: 'Failed to enroll camper' });
  }
};

module.exports = {
  getCampers,
  getCamperById,
  createCamper,
  updateCamper,
  deleteCamper,
  enrollCamper
};
