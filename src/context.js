import React, { Component } from "react";
import { storeProducts, detailProduct } from "./data";
import { isStyledComponent } from "styled-components";
const ProductContext = React.createContext();
//Provider
//Consumer

class ProductProvider extends Component {
  state = {
    products: [],
    detailProduct: detailProduct,
    cart: [],
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubtotal: 0,
    cartTax: 0,
    cartTotal: 0,

  };
  componentDidMount() {
    this.setProducts();
  }
  setProducts = () => {
    let tempProducts = [];
    storeProducts.forEach(item => {
      const singleItem = { ...item };
      tempProducts = [...tempProducts, singleItem];
    });
    this.setState(() => {
      return { products: tempProducts };
    });
  };

  getItem = id => {
    const product = this.state.products.find(item => item.id === id);
    return product;
  };
  handleDetail = id => {
    const product = this.getItem(id);
    this.setState(() => {
      return { detailProduct: product };
    });
  };
  addToCart = id => {
    let tempProducts = [...this.state.products];
    const index = tempProducts.indexOf(this.getItem(id));
    const product = tempProducts[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;
    this.setState(
      () => {
        return { products: tempProducts, cart: [...this.state.cart, product] };
      },
      () => {
         this.addTotal();//console.log(this.state);
      }
    );

    //console.log(`hello from add to cart.id is ${id}`);
  };
  openModal = id => {
    const product = this.getItem(id);
    this.setState(() => {
      return { modalProduct: product, modalOpen: true };
    });
  };
  closeModal = () => {
    this.setState(() => {
      return { modalOpen: false };
    });
  };
   increment = (id) =>{
      let tempCart =  [...this.state.cart];                                            // console.log('this is increment method');
      const selectedProduct = tempCart.find(item => item.id === id);
      
      const index = tempCart.indexOf(selectedProduct);
      const product = tempCart[index];
      
      product.count = product.count + 1;
      product.total = product.count * product.price;

      this.setState(
        () => {
          return { cart: [...tempCart] };
        },
          () => {
             this.addTotal();
          }
          );

   };
  decrement = (id) => {
    let tempCart = [...this.state.cart];                                            // console.log('this is increment method');
    const selectedProduct = tempCart.find(item => item.id === id);

    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count = product.count -1;                                                    //console.log('this is decrement method');

    if(product.count === 0){
      this.removeItem(id)
    }
    else{
      product.tital = product.count * product.price;
      this.setState(
        () => {
          return { cart: [...tempCart] };
        },
        () => {
          this.addTotal();
        }
      );
       
    }

                                                         
 };

removeItem = (id) =>{
    let tempProducts = [...this.state.products];
     let tempCart = [...this.state.cart];
     
     tempCart = tempCart.filter(item => item.id !== id);  
     
     const index = tempProducts.indexOf(this.getItem(id));                //console.log('item removed');
      let removedProduct = tempProducts[index];
      removedProduct.inCart = false;
      removedProduct.count = 0;
      removedProduct.total = 0;

      this.setState(()=>{
        return {
          cart:[...tempCart],
          product:[...tempProducts],

        }
      },()=>{
        this.addTotal();
      })


    };
clearCart =() =>{
  this.setState(() =>{
    return{cart:[]};
  },
  () => {
    this.setProducts();
    //this.addTotals();
  });                                  //console.log('cart was cleared');
};
addTotal = () =>{
  let subTotal = 0;
  this.state.cart.map(item =>(subTotal += item.total));
  const tempTax = subTotal *0.14;
  const tax = parseFloat(tempTax.toFixed(2));
  const total = subTotal + tax
  this.setState(()=>{
    return{
      cartSubtotal:subTotal,
      cartTax:tax,
      cartTotal:total
    }
  })
}

  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem:this.removeItem,
          clearCart:this.clearCart,
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}
const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
