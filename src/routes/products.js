import express from 'express';
import fs from 'fs';

const router = express.Router();
let lastProductId = 0; // Inicializa el contador

// método GET para listar los productos con limitación
router.get('/api/products/', (req, res) => {
  const productsData = fs.readFileSync('../data/products.json'  , 'utf8');
  const products = JSON.parse(productsData);

  const limit = req.query.limit;

  // Verifica si se dio el parámetro 'limit' y si es válido
  if (limit && !isNaN(limit)) {
    // Limitar la lista de productos según el parámetro 'limit'
    const limitedProducts = products.slice(0, parseInt(limit, 10));
    res.json(limitedProducts);
  } else {
    
    res.json(products);
  }
});

// método GET /:pid para obtener un producto por su ID
router.get('/api/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const productsData = fs.readFileSync('../data/products.json', 'utf8');
  const products = JSON.parse(productsData);

  const product = products.find((p) => p.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Método POST para agregar un nuevo producto
router.post('/api/products/new/', (req, res) => {
  const newProduct = req.body;
  const productsData = fs.readFileSync('../data/products.json', 'utf8');
  const products = JSON.parse(productsData);

  newProduct.id = ++lastProductId; //ID unico y Aumenta el contador y usa el nuevo valor como ID

  products.push(newProduct);

  fs.writeFileSync('data/productos.json', JSON.stringify(products, null, 2));

  res.status(201).json(newProduct);
});

// Método PUT /:pid actualiza un producto
router.put('/api/products/update/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProductData = req.body;
  const productsData = fs.readFileSync('../data/products.json', 'utf8');
  const products = JSON.parse(productsData);

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  // lógica para actualizar el producto con los datos enviados
  fs.writeFileSync('../data/products.json', JSON.stringify(products, null, 2));

  res.json(updatedProductData);
});

// método DELETE /:pid para un producto
router.delete('/api/products/delete/:pid', (req, res) => {
  const productId = req.params.pid;
  const productsData = fs.readFileSync('../data/products.json', 'utf8');
  const products = JSON.parse(productsData);

  const index = products.findIndex((p) => p.id === productId);

  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  products.splice(index, 1);
  fs.writeFileSync('../data/products.json', JSON.stringify(products, null, 2));

  res.status(204).end();
});

export default router;





