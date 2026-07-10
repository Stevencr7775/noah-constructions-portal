const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function main() {
  const getTableData = (table) => {
    try {
      const output = execSync(`sqlite3 prisma/dev.db -json "SELECT * FROM ${table};"`);
      if (!output || output.toString().trim() === '') return [];
      return JSON.parse(output.toString());
    } catch (e) {
      console.error(`Failed to read table ${table}:`, e.message);
      return [];
    }
  };

  const convertDates = (obj) => {
    const newObj = { ...obj };
    if (newObj.createdAt) newObj.createdAt = new Date(newObj.createdAt);
    if (newObj.updatedAt) newObj.updatedAt = new Date(newObj.updatedAt);
    if (newObj.availableFrom) newObj.availableFrom = new Date(newObj.availableFrom);
    
    // SQLite stores booleans as 0/1. Prisma postgres expects true/false
    for (const key in newObj) {
      if (newObj[key] === 0 && (key.startsWith('is') || key === 'cornerPlot' || key === 'boundaryWall' || key === 'gardenFacing')) {
         newObj[key] = false;
      }
      if (newObj[key] === 1 && (key.startsWith('is') || key === 'cornerPlot' || key === 'boundaryWall' || key === 'gardenFacing')) {
         newObj[key] = true;
      }
    }
    
    return newObj;
  };

  // Base Data
  const tablesToMigrate = [
    'State', 'City', 'District', 'PropertyCategory', 'PlotSize', 'LayoutApproval',
    'Seller', 'Project', 'Property', 'Media'
  ];

  for (const table of tablesToMigrate) {
    const data = getTableData(table);
    console.log(`Migrating ${data.length} records for ${table}...`);
    for (const record of data) {
      const formatted = convertDates(record);
      try {
        await prisma[table.toLowerCase()].upsert({
          where: { id: record.id },
          update: formatted,
          create: formatted
        });
      } catch (err) {
        // If exact lowercase doesn't match the prisma model, do a manual mapping
        const modelName = table.charAt(0).toLowerCase() + table.slice(1);
        if (prisma[modelName]) {
          try {
            await prisma[modelName].upsert({
              where: { id: record.id },
              update: formatted,
              create: formatted
            });
          } catch(e2) {
            console.error(`Failed to insert ${table} record ${record.id}:`, e2.message);
          }
        } else {
            console.error(`Could not find Prisma model for ${table}`);
        }
      }
    }
  }

  console.log("Migration completed!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
