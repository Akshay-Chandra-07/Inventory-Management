class ProductsService {
  static async cleanProducts(rawProducts) {
    let cleanedProducts = rawProducts.reduce((resultant, product) => {
      const p = resultant.find(
        (cleanedProducts) => cleanedProducts.product_id === product.product_id,
      );
      if (!p) {
        resultant.push({
          product_id: product.product_id,
          product_name: product.product_name,
          product_image: product.product_image,
          unit: product.unit,
          quantity_in_stock: product.quantity_in_stock,
          category_name: product.category_name,
          vendors: [
            {
              vendor_id: product.vendor_id,
              vendor_name: product.vendor_name,
            },
          ],
        });
      } else {
        p.vendors.push({
          vendor_id: product.vendor_id,
          vendor_name: product.vendor_name,
        });
      }
      return resultant;
    }, []);
    return cleanedProducts;
  }
}

module.exports = ProductsService;
