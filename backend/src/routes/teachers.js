const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { auth, requireRole } = require('../middleware/auth');
const prisma = new PrismaClient();

router.get('/', auth, async (_, res) => {
  try { res.json(await prisma.teacher.findMany({ orderBy: { fullName: 'asc' } })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const t = await prisma.teacher.findUnique({ where: { id: req.params.id } });
    if (!t) return res.status(404).json({ error: 'Teacher not found' });
    res.json(t);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, requireRole('admin'), async (req, res) => {
  try { res.status(201).json(await prisma.teacher.create({ data: req.body })); }
  catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', auth, requireRole('admin'), async (req, res) => {
  try { res.json(await prisma.teacher.update({ where: { id: req.params.id }, data: req.body })); }
  catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try { await prisma.teacher.delete({ where: { id: req.params.id } }); res.json({ message: 'Teacher deleted' }); }
  catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
