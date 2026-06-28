const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');

const prisma = new PrismaClient();

function sign(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name, studentId: user.studentId, className: user.className, subject: user.subject },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return res.status(401).json({ error: 'No account found for that email.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Incorrect password.' });

    res.json({ token: sign(user), user: { id: user.id, name: user.name, email: user.email, role: user.role, studentId: user.studentId, className: user.className, subject: user.subject } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, phone, role, studentId } = req.body;
    if (!fullName || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });

    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (exists) return res.status(409).json({ error: 'An account with this email already exists.' });

    let className = null;
    if ((role === 'student' || role === 'parent') && studentId) {
      const student = await prisma.student.findUnique({ where: { id: studentId } });
      if (student) className = student.className;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: fullName,
        email: email.toLowerCase().trim(),
        password: hashed,
        role: role || 'student',
        phone,
        studentId: studentId || null,
        className,
      },
    });

    res.status(201).json({ token: sign(user), user: { id: user.id, name: user.name, email: user.email, role: user.role, studentId: user.studentId, className } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, name: true, email: true, role: true, phone: true, studentId: true, className: true, subject: true } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
