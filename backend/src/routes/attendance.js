const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { auth, requireRole } = require('../middleware/auth');
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  try {
    const { studentId, className, date } = req.query;
    const where = {};
    if (studentId) where.studentId = studentId;
    if (className) where.className = className;
    if (date)      where.date = date;
    res.json(await prisma.attendance.findMany({ where, orderBy: { date: 'desc' } }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, requireRole('admin', 'academic', 'teacher'), async (req, res) => {
  try {
    const records = Array.isArray(req.body) ? req.body : [req.body];
    const created = await prisma.attendance.createMany({ data: records, skipDuplicates: true });
    res.status(201).json({ count: created.count });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', auth, requireRole('admin', 'academic', 'teacher'), async (req, res) => {
  try { res.json(await prisma.attendance.update({ where: { id: req.params.id }, data: req.body })); }
  catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
