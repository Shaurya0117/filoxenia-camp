const prisma = require('../config/db');

// Get all invoices
const getInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        registration: {
          include: {
            camper: { select: { id: true, first_name: true, last_name: true } },
            period: { select: { id: true, name: true, price: true } }
          }
        }
      },
      orderBy: { id: 'desc' }
    });
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Server error fetching invoices' });
  }
};

// Create a new invoice / APY
const createInvoice = async (req, res) => {
  try {
    const { registration_id, amount, status, due_date, apy_number } = req.body;
    
    if (!registration_id || !amount) {
      return res.status(400).json({ error: 'Registration ID and amount are required' });
    }

    const invoice = await prisma.invoice.create({
      data: {
        registration_id: parseInt(registration_id),
        amount: parseFloat(amount),
        status: status || 'not_issued',
        due_date: due_date ? new Date(due_date) : null,
        apy_number: apy_number || null,
        issued_at: status === 'issued' || status === 'paid' ? new Date() : null
      },
      include: {
        registration: {
          include: {
            camper: true,
            period: true
          }
        }
      }
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Server error creating invoice' });
  }
};

// Update invoice
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, apy_number } = req.body;
    
    const invoice = await prisma.invoice.update({
      where: { id: parseInt(id) },
      data: {
        status,
        apy_number,
        ...(status === 'issued' && { issued_at: new Date() })
      }
    });
    
    res.json(invoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Server error updating invoice' });
  }
}

module.exports = {
  getInvoices,
  createInvoice,
  updateInvoice
};
