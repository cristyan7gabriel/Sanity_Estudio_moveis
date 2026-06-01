import { getCliClient } from 'sanity/cli';

const client = getCliClient();

const structure = [
  {
    name: "SALA DE JANTAR",
    subcategories: [
      "Mesa de Jantar c/ 04 cadeiras",
      "Mesa de Jantar c/ 06 cadeiras",
      "Mesa de Jantar c/ 08 cadeiras",
      "Mesa de Jantar c/ 10 cadeiras",
    ]
  },
  {
    name: "BUFFET/CRISTALEIRAS/APARADORES",
    subcategories: ["Buffet", "Cristaleira", "Aparador"]
  },
  {
    name: "SALA DE ESTAR",
    subcategories: ["Racks e Painéis"]
  },
  {
    name: "ESTOFADOS",
    subcategories: ["Sofá Retrátil/Reclinável", "Sofá de canto", "Sofá-Cama", "Poltrona"]
  },
  {
    name: "QUARTO",
    subcategories: ["Guarda-Roupa", "Cômodas", "Cabeceiras e Criados", "Penteadeira", "Sapateiras"]
  },
  {
    name: "COZINHA",
    subcategories: ["Cozinha Modulada", "Kit cozinha compacta", "Cozinha em aço"]
  },
  {
    name: "COLCHÕES",
    subcategories: []
  },
  {
    name: "BELICHE",
    subcategories: []
  },
  {
    name: "CABECEIRA",
    subcategories: []
  },
  {
    name: "MULTIUSO",
    subcategories: []
  },
  {
    name: "ESCRIVANINHA",
    subcategories: []
  },
  {
    name: "LINHA INFANTIL",
    subcategories: []
  },
  {
    name: "CADEIRAS",
    subcategories: []
  }
];

function generateSlug(text) {
  return text.toString().toLowerCase()
    .replace(/[àáâãäå]/g,"a")
    .replace(/ç/g,"c")
    .replace(/[èéêë]/g,"e")
    .replace(/[ìíîï]/g,"i")
    .replace(/[òóôõö]/g,"o")
    .replace(/[ùúûü]/g,"u")
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes
}

async function migrate() {
  console.log("Starting migration of sections and categories...");

  // Get existing sections and categories
  const existingSections = await client.fetch(`*[_type == "section"]`);
  const existingCategories = await client.fetch(`*[_type == "category"]`);

  let order = 1;
  for (const sec of structure) {
    const slug = generateSlug(sec.name);
    
    // Find or create section
    let sectionDoc = existingSections.find(s => s.name.toLowerCase() === sec.name.toLowerCase());
    if (!sectionDoc) {
      console.log(`Creating section: ${sec.name}`);
      sectionDoc = await client.create({
        _type: 'section',
        name: sec.name,
        id: { _type: 'slug', current: slug },
        order: order
      });
    } else {
      console.log(`Section already exists: ${sec.name}`);
      // Update order just in case
      await client.patch(sectionDoc._id).set({ order: order }).commit();
    }
    
    // Create subcategories
    for (const sub of sec.subcategories) {
      const subSlug = generateSlug(sub);
      
      let catDoc = existingCategories.find(c => c.name.toLowerCase() === sub.toLowerCase());
      
      if (!catDoc) {
        console.log(`  Creating category: ${sub}`);
        await client.create({
          _type: 'category',
          name: sub,
          id: { _type: 'slug', current: subSlug },
          section: {
            _type: 'reference',
            _ref: sectionDoc._id
          }
        });
      } else {
        console.log(`  Category already exists: ${sub}`);
        // Ensure it references the section
        if (!catDoc.section || catDoc.section._ref !== sectionDoc._id) {
          console.log(`  Updating category section reference: ${sub}`);
          await client.patch(catDoc._id).set({
            section: {
              _type: 'reference',
              _ref: sectionDoc._id
            }
          }).commit();
        }
      }
    }
    
    // Also, if the section has no subcategories (like COLCHÕES), should we create a category with the same name?
    // The user wants them as sections, but products need a "category" reference based on product.js schema.
    // If a section has no subcategories, we should probably create a category with the same name so products can be linked to it.
    if (sec.subcategories.length === 0) {
      let catDoc = existingCategories.find(c => c.name.toLowerCase() === sec.name.toLowerCase());
      if (!catDoc) {
        console.log(`  Creating category (same as section): ${sec.name}`);
        await client.create({
          _type: 'category',
          name: sec.name,
          id: { _type: 'slug', current: slug },
          section: {
            _type: 'reference',
            _ref: sectionDoc._id
          }
        });
      } else {
         if (!catDoc.section || catDoc.section._ref !== sectionDoc._id) {
            console.log(`  Updating category section reference: ${sec.name}`);
            await client.patch(catDoc._id).set({
              section: {
                _type: 'reference',
                _ref: sectionDoc._id
              }
            }).commit();
          }
      }
    }

    order++;
  }

  console.log("Migration complete!");
}

migrate().catch(console.error);
