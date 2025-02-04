const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config({ path: "./src/.env" });
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const cron = require('node-cron');
const socketIo = require('socket.io')
require("./mysql/db");
require("./aws/s3/s3Uploader")
const {
  errorLogger,
} = require("./middleware/error_handlers/global_error_handler");
const { excelDataProcessor } = require("./utils/excelDataProcessor");

const swaggerDefinition = {
  openapi : '3.0.0',
  info : {
    title : 'Inventory Management',
    version : '1.0.0',
    description : 'Documentation for managing inventory management APIs'
  },
  servers : [
    {
      url : process.env.SERVER_URL
    }
  ],
  components : {
    securitySchemes: {
      BearerAuth : {
        type : 'http',
        scheme : 'bearer',
        bearerFormat : 'JWT'
      }
    }
  },
  security : [
    {
      BearerAuth : []
    }
  ]
}

const options = {
  swaggerDefinition,
  apis : ['./src/v1/**/api_docs/*.js']
}

const swaggerSpec = swaggerJsDoc(options)

const app = express();
app.use(
  cors({ origin: "http://localhost:4200", exposedHeaders: ["Authorization"] }),
);
app.use(express.json());

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))

app.use("/v1", require("./v1/v1Routes"));

app.use(errorLogger);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Listening to port ${process.env.PORT}`);
});
require('./utils/socket_config').initializeSocket(server)

cron.schedule('*/10 * * * * ', () => {
  excelDataProcessor();
} );

const scheduleFun = async() => {
  const result = await excelDataProcessor();
  console.log(result)
}

// scheduleFun();