import { getCliClient } from 'sanity/cli';

const client = getCliClient();

async function fixEspecificacoes() {
  const products = await client.fetch(`*[_type == 'product' && defined(especificacoes_gerais)]`);
  
  for (const prod of products) {
    let needsFix = false;
    let newArr = [];
    
    if (!Array.isArray(prod.especificacoes_gerais)) {
      // It's an object, convert to array
      needsFix = true;
      for (const [k, v] of Object.entries(prod.especificacoes_gerais)) {
        newArr.push({
          _key: Math.random().toString(36).substring(2, 10),
          _type: 'especificacao_item',
          chave: k,
          valor: String(v)
        });
      }
    } else {
      // It's already an array, ensure _type is set
      newArr = prod.especificacoes_gerais.map(item => {
        if (!item._type || item._type !== 'especificacao_item') {
          needsFix = true;
          return {
            ...item,
            _type: 'especificacao_item',
            _key: item._key || Math.random().toString(36).substring(2, 10)
          };
        }
        return item;
      });
    }

    if (needsFix) {
      await client.patch(prod._id).set({ especificacoes_gerais: newArr }).commit();
      console.log(`Fixed product: ${prod.title}`);
    } else {
      console.log(`Product ${prod.title} is already OK.`);
    }
  }
  console.log("Fix complete!");
}

fixEspecificacoes().catch(console.error);
