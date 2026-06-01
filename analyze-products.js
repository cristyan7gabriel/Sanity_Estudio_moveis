import { getCliClient } from 'sanity/cli';

const client = getCliClient();

async function run() {
  const products = await client.fetch(`*[_type == "product"]{
    _id,
    title,
    "categoryName": categoryId->name
  }`);
  
  const byCategory = {};
  for (const p of products) {
    const catName = p.categoryName || 'Uncategorized';
    if (!byCategory[catName]) byCategory[catName] = [];
    byCategory[catName].push({ id: p._id, title: p.title });
  }
  
  console.log(JSON.stringify(byCategory, null, 2));
}

run().catch(console.error);
