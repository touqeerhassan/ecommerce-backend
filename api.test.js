
const axios = require('axios');
axios.defaults.baseURL = 'http://localhost:5000';

test('store should have atleast one product', async() => {
    const products = await axios.get('/products');
    expect(products.data.length).toBeGreaterThan(0);
  });