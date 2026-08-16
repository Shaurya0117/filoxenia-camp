const prisma = require('../config/db');

const getNotifications = async (req, res) => {
  try {
    const { camper_id } = req.query;
    
    // Fetch global broadcasts (camper_id is null) or specific camper notifications
    const where = camper_id 
      ? { OR: [{ camper_id: Number(camper_id) }, { camper_id: null }] } 
      : { camper_id: null };

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { sent_at: 'desc' },
      take: 20
    });

    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

const createBroadcast = async (req, res) => {
  try {
    const { title, message, type } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    const broadcast = await prisma.notification.create({
      data: {
        title,
        message,
        type: type || 'broadcast',
        channel: 'dashboard',
        camper_id: null // Global broadcast
      }
    });

    res.status(201).json(broadcast);
  } catch (error) {
    console.error('Error creating broadcast:', error);
    res.status(500).json({ error: 'Failed to create broadcast' });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.notification.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

module.exports = {
  getNotifications,
  createBroadcast,
  deleteNotification
};
