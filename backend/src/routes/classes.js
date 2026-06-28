const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { auth, requireRole } = require('../middleware/auth');
const prisma = new PrismaClient();

router.get('/', auth, async (_, res) => {
  try {
    const classes = await prisma.schoolClass.findMany({ orderBy: { name: 'asc' } });
    res.json(classes.map(c => ({ ...c, subjects: JSON.parse(c.subjects) })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const data = { ...req.body, subjects: JSON.stringify(req.body.subjects || []) };
    const cls = await prisma.schoolClass.create({ data });
    res.status(201).json({ ...cls, subjects: JSON.parse(cls.subjects) });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const data = { ...req.body, subjects: JSON.stringify(req.body.subjects || []) };
    const cls = await prisma.schoolClass.update({ where: { id: req.params.id }, data });
    res.json({ ...cls, subjects: JSON.parse(cls.subjects) });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try { await prisma.schoolClass.delete({ where: { id: req.params.id } }); res.json({ message: 'Class deleted' }); }
  catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
