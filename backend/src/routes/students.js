const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { auth, requireRole } = require('../middleware/auth');

const prisma = new PrismaClient();

// GET /api/students
router.get('/', auth, async (req, res) => {
  try {
    const { search, className, level } = req.query;
    const where = {};
    if (className) where.className = className;
    if (level)     where.level = level;
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName:  { contains: search } },
        { email:     { contains: search } },
        { id:        { contains: search } },
      ];
    }
    const students = await prisma.student.findMany({ where, orderBy: { firstName: 'asc' } });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/students/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/students
router.post('/', auth, requireRole('admin', 'academic'), async (req, res) => {
  try {
    const student = await prisma.student.create({ data: req.body });
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/students/:id
router.put('/:id', auth, requireRole('admin', 'academic'), async (req, res) => {
  try {
    const student = await prisma.student.update({ where: { id: req.params.id }, data: req.body });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/students/:id
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    await prisma.student.delete({ where: { id: req.params.id } });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
