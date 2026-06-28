const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  try {
    const { feeId } = req.query;
    const where = feeId ? { feeId } : {};
    res.json(await prisma.payment.findMany({ where, orderBy: { createdAt: 'desc' } }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Record a payment and update fee.paid
router.post('/', auth, async (req, res) => {
  try {
    const { feeId, amount, method, paidBy } = req.body;
    if (!feeId || !amount || !method) return res.status(400).json({ error: 'feeId, amount and method required' });

    const fee = await prisma.fee.findUnique({ where: { id: feeId } });
    if (!fee) return res.status(404).json({ error: 'Fee not found' });

    const balance = fee.amount - fee.paid;
    if (amount > balance) return res.status(400).json({ error: `Amount exceeds outstanding balance of $${balance}` });

    const [payment] = await prisma.$transaction([
      prisma.payment.create({
        data: {
          feeId,
          studentName: fee.studentName,
          amount: parseFloat(amount),
          method,
          paidBy: paidBy || 'Parent',
          date: new Date().toISOString().slice(0, 10),
        },
      }),
      prisma.fee.update({
        where: { id: feeId },
        data: { paid: { increment: parseFloat(amount) } },
      }),
    ]);

    res.status(201).json(payment);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
