import { getCliClient } from 'sanity/cli';
const client = getCliClient();
async function run() {
  const categories = await client.fetch(`*[_type == "category"]{
    _id,
    name,
    "slug": id.current,
    "section": section->name
  }`);
  console.log(categories.filter(c => c.name.toLowerCase().includes('cozinha') || (c.slug && c.slug.includes('cozinha'))));
}
run().catch(console.error);
