const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const projectsList = [
  { title: 'Parsonage construction', location: 'Bhavani nagar ECIL Hyderabad', client: 'DGLC', cost: '70 lakhs', status: 'Completed' },
  { title: 'Residential project', location: 'Dammaiguda', client: 'Jaganadham Engineer In Finolex Pvt Ltd', cost: '60 lakhs', status: 'Completed' },
  { title: 'Residential Project', location: 'Dammaiguda', client: 'Christina DELL', cost: '42 Lakhs', status: 'Completed' },
  { title: 'Residential Project', location: 'Dammaiguda', client: 'Rajsekhar Pvt Firm - Engr', cost: '28 lakhs', status: 'Completed' },
  { title: 'Residential Apartment', location: 'Dammaiguda', client: 'Partha Sarathy', cost: '90 Lakhs', status: 'Completed' },
  { title: 'Residential Group housing', location: 'Bandlaguda', client: 'NCL employees', cost: '120 lakhs', status: 'Completed' },
  { title: 'Residential Project', location: 'Venkatramana colony Nagole', client: 'Subba Lakshmi Abdul Sammad', cost: '80 lakhs', status: 'Completed' },
  { title: 'Residential Project', location: 'LB Nagar', client: 'Satya babu Commissioner', cost: '75 lakhs', status: 'Completed' },
  { title: 'Residential Apartment', location: 'Unknown', client: 'Srinivas SBI', cost: '140 lakhs', status: 'Completed' },
  { title: 'Residential Building', location: 'Unknown', client: 'Kandar Kenya', cost: '120 lakhs', status: 'Completed' },
  { title: 'Residential Building Renovation and extension', location: 'Unknown', client: 'Suresh Satyam', cost: '40 lakhs', status: 'Completed' },
  { title: 'Residential Building', location: 'Alwal', client: 'Senthil Aurobindo', cost: '80 lakhs', status: 'Completed' },
  { title: 'Residential Building', location: 'Alwal', client: 'Suresh babu', cost: '60 lakhs', status: 'Completed' },
  { title: 'Commercial Building Renovation and Interiors', location: 'Jubilee Hills', client: 'MNRAO CEO - Medisys', cost: '180 lakhs', status: 'Completed' },
  { title: 'Commercial Building Studio construction', location: 'Jubilee Hills', client: 'Lakshman Rao', cost: '120 Lakhs', status: 'Completed' },
  { title: 'Residential Apartment', location: 'Kondapur', client: 'Uday', cost: '140 lakhs', status: 'Under Construction' },
  { title: 'Residential Apartment', location: 'Kondapur', client: 'Ravindar', cost: '120 Lakhs', status: 'Under Construction' },
  { title: 'Residential Apartment', location: 'Kondapur', client: 'Murthy', cost: '140 lakhs', status: 'Under Construction' },
  { title: 'Residential Bungalow', location: 'Kollur', client: 'Ratnakar', cost: '180 lakhs', status: 'Under Construction' },
  { title: 'Residential Apartment', location: 'Gandhinagar', client: 'Gopal Reddy', cost: '120 lakhs', status: 'Completed' },
  { title: 'Commercial 3star Hotel Suite Rooms', location: 'Yadagirigutta, Bhongir Dist, Telangana', client: 'Subhamasthu Infra projects', cost: '30 crores', status: 'Under Construction', description: 'Construction of Commercial Hotel Suite Rooms of 150 with 3 star accommodation tied with LEMON TREE HOTELS. 1,50,000 sft Area.' },
  { title: 'Residential Apartments Of 70 Flats', location: 'Jangaon, Jangaon District, Telangana', client: 'Subhamasthu Infra projects', cost: '24 Crores', status: 'Under Construction', description: 'Construction of Residential Apartments with 70 Flats (84000 sft Area) in 2 acres and Independent Housing Project of 20 units of Duplex Housing (40000 sft).' }
];

async function addProjects() {
  let builder = await prisma.seller.findFirst({
    where: { name: 'Noah Infra Projects' }
  });

  if (!builder) {
     console.log('Builder not found!');
     return;
  }

  for (let i = 0; i < projectsList.length; i++) {
     const p = projectsList[i];
     const uniqueTitle = `${p.title} - ${p.location}`;
     const existing = await prisma.project.findFirst({ where: { title: uniqueTitle }});
     if (existing) {
         console.log('Skipping existing:', uniqueTitle);
         continue;
     }

     await prisma.project.create({
       data: {
         title: uniqueTitle,
         description: p.description || `Client: ${p.client}. Estimated Cost: ${p.cost}.`,
         status: p.status === 'Completed' ? 'Completed' : 'Under Construction',
         progress: p.status === 'Completed' ? 100 : 45,
         builderId: builder.id,
         projectCode: 'NP-' + Date.now().toString() + '-' + i,
         projectType: p.title.toLowerCase().includes('commercial') ? 'Commercial' : 'Residential',
         location: p.location,
       }
     });
     console.log('Created project:', p.title);
  }
}

addProjects().catch(console.error).finally(() => prisma.$disconnect());
