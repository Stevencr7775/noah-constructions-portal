const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  try {
    const ownerType = 'Agent';
    const agentDetails = {
      name: '',
      agency: 'olive builders',
      mobile: '',
      email: ''
    };
    
    const property = await prisma.property.create({
      data: {
        propertyId: 'PR-TEST',
        purpose: 'Sale',
        category: 'Apartment',
        isFeatured: false,
        isNegotiable: false,
        layoutApprovals: '[]',
        amenities: '[]',
        ...(ownerType === 'Agent' && agentDetails ? {
          seller: {
            create: {
              type: 'AGENT',
              name: agentDetails.name,
              agency: agentDetails.agency,
              mobile: agentDetails.mobile,
              email: agentDetails.email || `${Math.random()}@example.com`,
              password: 'defaultPassword',
              reraNumber: agentDetails.reraNumber
            }
          }
        } : {}),
      }
    });
    console.log("Success:", property.id);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
run();
