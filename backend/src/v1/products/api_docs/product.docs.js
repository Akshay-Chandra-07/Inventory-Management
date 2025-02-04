/**
 * @swagger
 * /v1/products/get-page-products:
 *   get:
 *     summary: Get paginated and filtered products
 *     description: Retrieve a list of products based on pagination, search value, and filters.
 *     parameters:
 *       - in: query
 *         name: pageNumber
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: pageCount
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: The number of products to fetch per page.
 *       - in: query
 *         name: searchValue
 *         required: true
 *         schema:
 *           type: string
 *           example: " "
 *         description: A string to search products table.
 *       - in: query
 *         name: searchFilters
 *         required: true
 *         schema:
 *           type: string
 *           example : "{}"
 *         description: A JSON string containing filters for search.
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "All products fetched"
 *                 cleanedProducts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: integer
 *                         example: 1
 *                       product_name:
 *                         type: string
 *                         example: "Smartphone"
 *                       product_image:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       quantity_in_stock:
 *                         type: number
 *                         example: 1
 *                       category_name:
 *                         type: string
 *                         example: "Beverages"
 *                       unit:
 *                         type: string
 *                         example: "millimeters"
 *                       unit_price:
 *                         type: integer
 *                         example: 30
 *                       vendors:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             vendor_name:
 *                               type: string
 *                               example: "Vendor A"
 *                       totalProducts:
 *                         type: integer
 *                         example: 100
 *       400:
 *         description: Invalid request or error fetching products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Error fetching files"
 */