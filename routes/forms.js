const { sendSchoolEnquiry, sendPartnerEnquiry } = require('../services/emailService');

router.post('/school', async (req, res) => {
  const { honeypot, ...data } = req.body;
  if (honeypot) return res.json({ success: true }); 

  try {
    await sendSchoolEnquiry(data);
    res.json({ success: true });
  } catch (err) {
    console.error('School form failed:', err);
    res.status(500).json({ error: 'Failed to send' });
  }
});

router.post('/partner', async (req, res) => {
  const { honeypot, ...data } = req.body;
  if (honeypot) return res.json({ success: true });

  try {
    await sendPartnerEnquiry(data);
    res.json({ success: true });
  } catch (err) {
    console.error('Partner form failed:', err);
    res.status(500).json({ error: 'Failed to send' });
  }
});