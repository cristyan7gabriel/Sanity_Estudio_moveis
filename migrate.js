import { getCliClient } from 'sanity/cli';
import fs from 'fs';
import path from 'path';

const client = getCliClient();

const dataPath = path.resolve('data.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const { categories, products } = JSON.parse(rawData);

const publicDir = path.resolve('c:/Job/Estudio_Moveis/public');

async function uploadImage(imagePath) {
  if (!imagePath) return null;
  const fullPath = path.join(publicDir, imagePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found: ${fullPath}`);
    return null;
  }
  const isVideo = fullPath.endsWith('.mp4');
  const type = isVideo ? 'file' : 'image';
  
  try {
    const asset = await client.assets.upload(type, fs.createReadStream(fullPath), {
      filename: path.basename(fullPath)
    });
    return { asset, isVideo };
  } catch (error) {
    console.error(`Failed to upload ${fullPath}:`, error.message);
    return null;
  }
}

async function migrate() {
  console.log("Creating categories...");
  for (const cat of categories) {
    await client.createIfNotExists({
      _id: cat.id,
      _type: 'category',
      name: cat.name,
    });
    console.log(`Category created/exists: ${cat.name}`);
  }

  console.log("Uploading products...");
  for (const prod of products) {
    console.log(`Processing product: ${prod.title}`);
    
    let mainImageAsset = await uploadImage(prod.image);
    
    let galleryAssets = [];
    if (prod.images && prod.images.length > 0) {
      for (const imgPath of prod.images) {
        const result = await uploadImage(imgPath);
        if (result) galleryAssets.push(result);
      }
    }

    const newProd = {
      _id: prod.id,
      _type: 'product',
      id: { _type: 'slug', current: prod.id },
      categoryId: { _type: 'reference', _ref: prod.categoryId },
      title: prod.title,
      description: prod.description || '',
      longDescription: prod.longDescription || '',
      price: prod.price || 'Sob Consulta',
    };

    if (mainImageAsset) {
      newProd.image = {
        _type: 'image',
        asset: { _type: 'reference', _ref: mainImageAsset.asset._id }
      };
    }

    if (galleryAssets.length > 0) {
      newProd.images = galleryAssets.map((result, index) => {
        return {
          _key: result.asset._id + index,
          _type: result.isVideo ? 'file' : 'image',
          asset: { _type: 'reference', _ref: result.asset._id }
        };
      });
    }

    if (prod.especificacoes_mesa) newProd.especificacoes_mesa = prod.especificacoes_mesa;
    if (prod.especificacoes_cadeira) newProd.especificacoes_cadeira = prod.especificacoes_cadeira;
    if (prod.especificacoes_cozinha) newProd.especificacoes_cozinha = prod.especificacoes_cozinha;

    await client.createOrReplace(newProd);
    console.log(`Product created/replaced: ${prod.title}`);
  }
  
  console.log("Migration complete!");
}

migrate().catch(console.error);
