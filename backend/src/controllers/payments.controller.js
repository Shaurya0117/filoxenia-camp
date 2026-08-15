const prisma = require('../config/db');

const getPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        registration: {
          include: { camper: true, period: true }
        },
        recorder: {
          select: { name: true }
        }
      },
      orderBy: { payment_date: 'desc' }
    });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

const createPayment = async (req, res) => {
  try {
    const { registration_id, amount, payment_date, method, note } = req.body;
    const recorded_by = req.user.id; // From auth middleware

    const payment = await prisma.payment.create({
      data: {
        registration_id: Number(registration_id),
        amount: parseFloat(amount),
        payment_date: new Date(payment_date),
        method,
        note,
        recorded_by
      },
      include: {
        registration: { include: { camper: true, period: true } }
      }
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

const getCamperBalance = async (req, res) => {
  try {
    const { camper_id } = req.params;

    const registrations = await prisma.registration.findMany({
      where: { camper_id: Number(camper_id), status: 'enrolled' },
      include: {
        period: true,
        payments: true
      }
    });

    let totalDue = 0;
    let totalPaid = 0;

    registrations.forEach(reg => {
      totalDue += parseFloat(reg.period.price);
      reg.payments.forEach(payment => {
        totalPaid += parseFloat(payment.amount);
      });
    });

    res.json({
      totalDue,
      totalPaid,
      balance: totalDue - totalPaid
    });
  } catch (error) {
    console.error('Error calculating balance:', error);
    res.status(500).json({ error: 'Failed to calculate balance' });
  }
};

module.exports = {
  getPayments,
  createPayment,
  getCamperBalance
};
