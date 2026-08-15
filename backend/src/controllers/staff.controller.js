const prisma = require('../config/db');

const getStaff = async (req, res) => {
  try {
    const staffMembers = await prisma.staff.findMany({
      include: {
        user: { select: { email: true, role: true } }
      },
      orderBy: { name: 'asc' }
    });
    res.json(staffMembers);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
};

const createStaff = async (req, res) => {
  try {
    const { name, role_title, phone, background_check, ministry_statement, health_check, active } = req.body;
    const staff = await prisma.staff.create({
      data: {
        name,
        role_title,
        phone,
        background_check: Boolean(background_check),
        ministry_statement: Boolean(ministry_statement),
        health_check: Boolean(health_check),
        active: active !== undefined ? Boolean(active) : true
      }
    });
    res.status(201).json(staff);
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({ error: 'Failed to create staff' });
  }
};

const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { background_check, ministry_statement, health_check, active, role_title } = req.body;
    const staff = await prisma.staff.update({
      where: { id: Number(id) },
      data: {
        role_title,
        background_check: background_check !== undefined ? Boolean(background_check) : undefined,
        ministry_statement: ministry_statement !== undefined ? Boolean(ministry_statement) : undefined,
        health_check: health_check !== undefined ? Boolean(health_check) : undefined,
        active: active !== undefined ? Boolean(active) : undefined,
      }
    });
    res.json(staff);
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({ error: 'Failed to update staff' });
  }
};

module.exports = {
  getStaff,
  createStaff,
  updateStaff
};
