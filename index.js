const express = require('express');
const pathToSwaggerUi = require('swagger-ui-dist').absolutePath();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.3', // 指定 OpenAPI 版本
        info: {
            title: 'NTUT Homework Upload API',
            version: '1.0.0',
            description: 'API documentation for NTUT Homework Upload system',
        },
        // 將 components, security, servers 移入 definition 物件中
        components: {
          securitySchemes: {
            cookieAuth: {
              type: 'apiKey',
              in: 'cookie',
              name: 'session',
            },
          },
        },
        security: [
            {
                cookieAuth: []
            }
        ],
        servers: [
          {
            url: '/',
            description: '相對路徑伺服器',
          },
        ],
    },
    // apis 陣列指向包含 JSDoc 註解的檔案或規格檔案
    apis: ['./swagger.yaml'], // Path to the API docs
};

// swagger-jsdoc 會讀取 options 並產生完整的 OpenAPI 規格
const swaggerSpec = swaggerJSDoc(options);

const app = express();

// 設置 Swagger UI 的路由
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get('/', function (req, res) {
  res.send('<a href="/api-docs">Go to API Docs</a>');
});

// 這行是為了讓 swagger-ui-dist 的靜態檔案能被存取，但通常 swagger-ui-express 會處理好一切
// 如果 '/api-docs' 正常運作，可以考慮移除這行
app.use(express.static(pathToSwaggerUi));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    console.log('API docs are available at http://localhost:3000/api-docs');
});