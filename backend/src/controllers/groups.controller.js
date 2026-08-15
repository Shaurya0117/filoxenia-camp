const prisma = require('../config/db');

const getGroups = async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      include: {
        period: true,
        members: {
          include: { camper: true }
        }
      },
      orderBy: { group_number: 'asc' }
    });
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

const createGroup = async (req, res) => {
  try {
    const { period_id, group_number, leader_name, assistants } = req.body;
    const group = await prisma.group.create({
      data: {
        period_id: Number(period_id),
        group_number: Number(group_number),
        leader_name,
        assistants: assistants ? JSON.stringify(assistants) : "[]"
      }
    });
    res.status(201).json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
};

const assignCamperToGroup = async (req, res) => {
  try {
    const { id: group_id } = req.params;
    const { camper_id } = req.body;

    const groupMember = await prisma.groupMember.create({
      data: {
        group_id: Number(group_id),
        camper_id: Number(camper_id)
      }
    });

    res.status(201).json(groupMember);
  } catch (error) {
    console.error('Error assigning camper:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Camper already in this group' });
    }
    res.status(500).json({ error: 'Failed to assign camper' });
  }
};

module.exports = {
  getGroups,
  createGroup,
  assignCamperToGroup
};
