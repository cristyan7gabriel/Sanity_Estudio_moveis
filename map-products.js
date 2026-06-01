import { getCliClient } from 'sanity/cli';

const client = getCliClient();

async function run() {
  const products = await client.fetch(`*[_type == "product"]{
    _id,
    title,
    "categoryId": categoryId._ref,
    "categoryName": categoryId->name
  }`);

  const categories = await client.fetch(`*[_type == "category"]{
    _id,
    name,
    "sectionName": section->name
  }`);

  const getCatId = (name) => {
    const cat = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
    return cat ? cat._id : null;
  };

  const migrations = [];

  for (const p of products) {
    if (!p.title) continue; // skip empty
    
    let newCatName = null;
    const titleLower = p.title.toLowerCase();
    const oldCatName = p.categoryName || '';

    if (oldCatName.toUpperCase() === 'ROUPEIROS') {
      newCatName = 'Guarda-Roupa';
    } 
    else if (oldCatName.toUpperCase() === 'COLCHÕES') {
      newCatName = 'COLCHÕES';
    }
    else if (oldCatName.toUpperCase() === 'COZINHA') {
      if (titleLower.includes('aço')) newCatName = 'Cozinha em aço';
      else if (titleLower.includes('compacta')) newCatName = 'Kit cozinha compacta';
      else newCatName = 'Cozinha Modulada';
    }
    else if (oldCatName.toUpperCase() === 'SALA DE JANTAR' || titleLower.includes('mesa')) {
      if (titleLower.includes('04 cad') || titleLower.includes('4 cad')) newCatName = 'Mesa de Jantar c/ 04 cadeiras';
      else if (titleLower.includes('06 cad') || titleLower.includes('6 cad')) newCatName = 'Mesa de Jantar c/ 06 cadeiras';
      else if (titleLower.includes('08 cad') || titleLower.includes('8 cad')) newCatName = 'Mesa de Jantar c/ 08 cadeiras';
      else if (titleLower.includes('10 cad')) newCatName = 'Mesa de Jantar c/ 10 cadeiras';
      else newCatName = 'Mesa de Jantar c/ 06 cadeiras'; // default guess
    }
    else if (oldCatName.toUpperCase() === 'CADEIRAS' || titleLower.includes('cadeira')) {
      // User didn't specify a "CADEIRAS" section in the new structure.
      // But they need to go somewhere. Let's create a "CADEIRAS" section/category if it doesn't exist,
      // or put them in SALA DE JANTAR -> Mesa de Jantar c/ 04 cadeiras?
      // It's better to keep them in a CADEIRAS category.
      newCatName = 'CADEIRAS';
    }

    if (!newCatName) {
       newCatName = oldCatName; // fallback to keeping the same name
    }

    const newCatId = getCatId(newCatName);
    
    if (newCatId && newCatId !== p.categoryId) {
      console.log(`Mapping "${p.title}" from [${oldCatName}] to [${newCatName}]`);
      migrations.push({
        id: p._id,
        patch: {
          set: {
            categoryId: {
              _type: 'reference',
              _ref: newCatId
            }
          }
        }
      });
    } else if (!newCatId) {
      console.log(`WARNING: Category "${newCatName}" not found for product "${p.title}"`);
    }
  }

  console.log(`Total migrations to run: ${migrations.length}`);
  
  // Execute migrations
  for (const m of migrations) {
    await client.patch(m.id).set(m.patch.set).commit();
  }
  console.log('Migration completed!');
}

run().catch(console.error);
