const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { auth, requireRole } = require('../middleware/auth');
const prisma = new PrismaClient();

router.get('/stats', auth, requireRole('admin', 'academic', 'finance'), async (_, res) => {
  try {
    const [students, teachers, classes, attendance, fees] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.schoolClass.count(),
      prisma.attendance.findMany(),
      prisma.fee.findMany(),
    ]);

    const present  = attendance.filter(a => a.status === 'Present').length;
    const rate     = attendance.length ? Math.round((present / attendance.length) * 100) : 0;
    const subjects = await prisma.schoolClass.findMany({ select: { subjects: true } });
    const uniqueSubjects = new Set(subjects.flatMap(c => JSON.parse(c.subjects)));

    const totalFees      = fees.reduce((s, f) => s + f.amount, 0);
    const totalCollected = fees.reduce((s, f) => s + f.paid, 0);

    res.json({ students, teachers, classes, subjects: uniqueSubjects.size, attendanceRate: rate, totalFees, totalCollected, outstanding: totalFees - totalCollected });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
