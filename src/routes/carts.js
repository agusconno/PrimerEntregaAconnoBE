import express from 'express';
import fs from 'fs';

const router = express.Router();
let lastCartId = 0; 

// Métodos

// Método POST para crear un nuevo carrito
router.post('/api/carts/', (req, res) => {
  const newCart = req.body;
  const cartsData = fs.readFileSync('../data/carts.json', 'utf8');
  const carts = JSON.parse(cartsData);

  newCart.id = ++lastCartId; //ID unico y Aumenta el contador y usa el nuevo valor como ID

  carts.push(newCart);

  fs.writeFileSync('../data/carts.json', JSON.stringify(carts, null, 2));

  res.status(201).json(newCart);
});

//Método GET  para listar los productos de un carrito
router.get('/api/carts/list/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cartsData = fs.readFileSync('../data/carts.json', 'utf8');
  const carts = JSON.parse(cartsData);

  const cart = carts.find((c) => c.id === cartId);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Método POST  para agregar un producto a un carrito
router.post('/api/carts/add/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;

  const cartsData = fs.readFileSync('../data/carts.json', 'utf8');
  const carts = JSON.parse(cartsData);

  const cart = carts.find((c) => c.id === cartId);

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  //la lógica para buscar el producto por su ID
  const product = {
    id: productId,
    quantity: quantity,
  };

  cart.products.push(product);

  fs.writeFileSync('../data/carts.json', JSON.stringify(carts, null, 2));

  res.status(201).json(product);
});

export default router;


