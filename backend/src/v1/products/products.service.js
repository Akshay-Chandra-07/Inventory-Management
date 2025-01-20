class ProductsService {
  static async cleanProducts(pageNumber, pageCount, rawProducts) {
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
          unit_price: product.unit_price,
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

    const startIndex = (pageNumber - 1) * pageCount;
    const paginatedProducts = cleanedProducts.slice(
      startIndex,
      startIndex + parseInt(pageCount),
    );
    const data = [paginatedProducts, cleanedProducts.length];
    return data;
  }
}

module.exports = ProductsService;
