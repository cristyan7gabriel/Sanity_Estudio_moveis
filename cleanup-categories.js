import { getCliClient } from 'sanity/cli';
const client = getCliClient();

async function run() {
  const categories = await client.fetch(`*[_type == "category"]{
    _id,
    name,
    "slug": id.current,
    "hasProducts": count(*[_type == "product" && references(^._id)]) > 0,
    "hasSection": defined(section)
  }`);

  const toDelete = categories.filter(c => !c.hasProducts && !c.hasSection);

  console.log('Categories to delete (no products, no section):');
  toDelete.forEach(c => console.log(`- ${c.name} (${c.slug})`));

  for (const c of toDelete) {
    await client.delete(c._id);
  }
  console.log(`Deleted ${toDelete.length} legacy categories.`);
}

run().catch(console.error);
