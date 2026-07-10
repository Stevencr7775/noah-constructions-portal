const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        purpose: 'Sale',
        category: 'Apartment',
        ownerType: 'Agent',
        agentDetails: {
          name: '',
          agency: 'olive builders',
          mobile: '',
          email: ''
        },
        mediaFiles: []
      })
    });
    console.log(res.status, await res.text());
  } catch (e) {
    console.error(e);
  }
}
run();
