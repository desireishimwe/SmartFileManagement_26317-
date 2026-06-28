const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { auth, requireRole } = require('../middleware/auth');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  try {
    const { studentId, className } = req.query;
    const where = {};
    if (studentId) where.studentId = studentId;
    if (className) where.className = className;
    res.json(await prisma.result.findMany({ where, orderBy: { subject: 'asc' } }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, requireRole('admin', 'academic', 'teacher'), async (req, res) => {
  try {
    const records = Array.isArray(req.body) ? req.body : [req.body];
    const created = await Promise.all(records.map(r => prisma.result.create({ data: r })));
    res.status(201).json(created);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', auth, requireRole('admin', 'academic', 'teacher'), async (req, res) => {
  try { res.json(await prisma.result.update({ where: { id: req.params.id }, data: req.body })); }
  catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try { await prisma.result.delete({ where: { id: req.params.id } }); res.json({ message: 'Result deleted' }); }
  catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
