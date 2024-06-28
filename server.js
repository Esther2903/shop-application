const  express = require('express');
const productRouter = require('./routers/product-router');

const app = express();
const PORT = 3000;

app.use("/", productRouter)


app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

