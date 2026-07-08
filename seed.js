const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Database...");

  // Seed State
  const state = await prisma.state.upsert({
    where: { id: 'st_telangana' },
    update: {},
    create: {
      id: 'st_telangana',
      name: 'Telangana',
    },
  });

  // Seed City
  const city = await prisma.city.upsert({
    where: { id: 'ct_hyderabad' },
    update: {},
    create: {
      id: 'ct_hyderabad',
      name: 'Hyderabad',
      stateId: state.id,
    },
  });

  // Seed Districts
  const districts = ['Hyderabad', 'Medchal-Malkajgiri', 'Rangareddy', 'Sangareddy', 'Vikarabad', 'Yadadri Bhuvanagiri'];
  for (const d of districts) {
    const dId = `dt_${d.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    await prisma.district.upsert({
      where: { id: dId },
      update: {},
      create: {
        id: dId,
        name: d,
        cityId: city.id,
      },
    });
  }

  // Seed Categories
  const categories = ['Residential', 'Commercial', 'Farm Land', 'Agricultural Land'];
  for (const cat of categories) {
    const cId = `cat_${cat.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    await prisma.propertyCategory.upsert({
      where: { id: cId },
      update: {},
      create: {
        id: cId,
        name: cat,
      },
    });
  }

  // Seed Plot Sizes
  const sizes = ['Below 500 Sq.Ft.', '500-1000 Sq.Ft.', '1000-2000 Sq.Ft.', '2000-4000 Sq.Ft.', 'Above 4000 Sq.Ft.', '1-10 Acres', '10-100 Acres', '100-500 Acres', '500-1000 Acres'];
  for (const size of sizes) {
    const sId = `ps_${size.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    await prisma.plotSize.upsert({
      where: { id: sId },
      update: {},
      create: {
        id: sId,
        name: size,
      },
    });
  }

  // Seed Layout Approvals
  const layouts = ['HMDA', 'DTCP', 'GHMC', 'Municipal', 'Panchayat', 'Open Layout', 'Gated Community', 'Venture Layout'];
  for (const layout of layouts) {
    const lId = `la_${layout.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    await prisma.layoutApproval.upsert({
      where: { id: lId },
      update: {},
      create: {
        id: lId,
        name: layout,
      },
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
