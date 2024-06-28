const {Router} = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
require('dotenv').config();

const productRouter = Router();
const data_file = 'products.json'; 

productRouter.use(bodyParser.json());

function displayProduct() {
    const data = fs.readFileSync(data_file, 'utf-8');
    return JSON.parse(data);
}

const checkAccessPassword = (req, res, next) => {
    if (req.headers.password === process.env.PASSWORD) {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
};


productRouter.get('/products', (req, res) => {
    const products = displayProduct();
    res.json(products);
});

productRouter.get('/products/:id', (req, res) => {
    const products = displayProduct();
    const product = products.find(product => product.id == req.params.id);
    if(product){
        res.send(product);
    }
    else{
        res.send("Product not found");
    }
});

function createProduct(products) {
    fs.writeFileSync(data_file, JSON.stringify(products, null, 2), 'utf-8');
}

productRouter.post('/products', checkAccessPassword, (req, res) => {
    const products = displayProduct();
    const new_product = req.body;
    new_product.id = (products.length + 1).toString();
    products.push(new_product);
    createProduct(products);
    res.send({ message: "Product successfully registered", product: new_product });
});

productRouter.put('/products/:id', checkAccessPassword ,(req, res) => {
    const products = displayProduct();
    const index = products.findIndex(product => product.id == req.params.id);
    if(index !== -1){
        products[index] = { ...products[index], ...req.body };
        createProduct(products);
        res.json(products[index]);
    }
    else{
        res.status(404).send("Product not found");
    }
});


productRouter.delete('/products/:id', checkAccessPassword ,(req, res) => {
    const products = displayProduct();
    const index = products.findIndex(product => product.id == req.params.id);
    if(index !== -1){
        const productDelete =products.splice(index, 1)
        createProduct(products);
        res.json(productDelete);
    }
    else{
        res.status(404).send("Product not found");
    }
});

module.exports = productRouter;
