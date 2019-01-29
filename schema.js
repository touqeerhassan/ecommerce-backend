const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema
} = require('graphql');

const axios = require('axios');
axios.defaults.baseURL = 'http://localhost:5000';

// Product category functionality is not completed
//product category
// const productCategoryType = new GraphQLObjectType({
//   name: "productCategory",
//   fields: () => ({
//     id: { type: GraphQLID },
//     name: { type: GraphQLString }
//   })
// });

//product
const productType = new GraphQLObjectType({
  name: "product",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    image: { type: GraphQLString },
    brand: { type: GraphQLString },
    color: { type: GraphQLString },
    price: { type: GraphQLInt }

    // Product category functionality is not completed
    // category: {
    //   type: productCategoryType,
    //   resolve: (parent) => {
    //     return axios.get('/productCategories/' + parent.categoryId).then((res) => res.data);
    //   }
    // }
  })
});

//order
const orderType = new GraphQLObjectType({
  name: "order",
  fields: () => ({
    id: { type: GraphQLID },
    customerName: { type: GraphQLString },
    customerEmail: { type: GraphQLString },
    customerAddress: { type: GraphQLString },
    products: {
      type: new GraphQLList(productType),
      resolve: async (parent) => {
        let arr = [];
        if (parent.products) {
          await Promise.all(
            parent.products.map(async productId => {
              const element = await axios.get('/products/' + productId).then((res) => res.data);
              arr.push(element);
            })
          )
        }
        return arr;
      }
    }
  })
});


const rootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // Product category functionality is not completed
    // productCategory: {
    //   type: productCategoryType,
    //   args: {
    //     id: { type: GraphQLID }
    //   },
    //   resolve: (parent, args) => {
    //     return axios.get('/productCategories/' + args.id).then((res) => res.data);
    //   }
    // },
    // productCategories: {
    //   type: new GraphQLList(productCategoryType),
    //   resolve: () => {
    //     return axios.get('/productCategories/').then((res) => res.data);
    //   }
    // },
    product: {
      type: productType,
      args: {
        id: { type: GraphQLID }
      },
      resolve: (parent, args) => {
        return axios.get('/products/' + args.id).then((res) => res.data);
      }
    },
    products: {
      type: new GraphQLList(productType),
      resolve: () => {
        return axios.get('/products/').then((res) => res.data);
      }
    },
    order: {
      type: orderType,
      args: {
        id: { type: GraphQLID }
      },
      resolve: async (parent, args) => {
        return axios.get('/orders/' + args.id).then((res) => res.data);
      }
    },
    orders: {
      type: new GraphQLList(orderType),
      resolve: () => {
        return axios.get('/orders/').then((res) => res.data);
      }
    }

  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addOrder: {
      type: orderType,
      args: {
        customerName: { type: new GraphQLNonNull(GraphQLString) },
        customerEmail: { type: new GraphQLNonNull(GraphQLString) },
        customerAddress: { type: new GraphQLNonNull(GraphQLString) },
        products: {type: new GraphQLList(GraphQLInt)}
      },
      resolve: (parent, args) => {
        return axios.post('/orders', {
          customerName: args.customerName,
          customerEmail: args.customerEmail,
          customerAddress: args.customerAddress,
          products: args.products,
        }).then((res) => res.data);
      }
    },

    addProduct: {
      type: productType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLInt) },
        color: { type: new GraphQLNonNull(GraphQLString) },
        brand: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
        return axios.post('/products', {
          name: args.name,
          price: args.price,
          color: args.color,
          brand: args.brand
        }).then((res) => res.data);
      }
    }

  },
});

module.exports = new GraphQLSchema({
  query: rootQuery,
  mutation
})