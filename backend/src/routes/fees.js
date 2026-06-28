const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { auth, requireRole } = require('../middleware/auth');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  try {
    const { studentId } = req.query;
    const where = studentId ? { studentId } : {};
    res.json(await prisma.fee.findMany({ where, include: { payments: true } }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const fee = await prisma.fee.findUnique({ where: { id: req.params.id }, include: { payments: true } });
    if (!fee) return res.status(404).json({ error: 'Fee not found' });
    res.json(fee);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, requireRole('admin', 'finance'), async (req, res) => {
  try { res.status(201).json(await prisma.fee.create({ data: req.body })); }
  catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', auth, requireRole('admin', 'finance'), async (req, res) => {
  try { res.json(await prisma.fee.update({ where: { id: req.params.id }, data: req.body })); }
  catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
