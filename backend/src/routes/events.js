const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { auth, requireRole } = require('../middleware/auth');
const prisma = new PrismaClient();

router.get('/', auth, async (_, res) => {
  try {
    const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });
    res.json(events.map(e => ({ ...e, audience: JSON.parse(e.audience) })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, requireRole('admin', 'academic'), async (req, res) => {
  try {
    const data = { ...req.body, audience: JSON.stringify(req.body.audience || ['all']) };
    const event = await prisma.event.create({ data });
    res.status(201).json({ ...event, audience: JSON.parse(event.audience) });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', auth, requireRole('admin', 'academic'), async (req, res) => {
  try {
    const data = { ...req.body, audience: JSON.stringify(req.body.audience || ['all']) };
    const event = await prisma.event.update({ where: { id: req.params.id }, data });
    res.json({ ...event, audience: JSON.parse(event.audience) });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try { await prisma.event.delete({ where: { id: req.params.id } }); res.json({ message: 'Event deleted' }); }
  catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
