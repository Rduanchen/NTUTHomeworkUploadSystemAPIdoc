"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const pathToSwaggerUi = require('swagger-ui-dist').absolutePath();
const swagger_jsdoc_1 = tslib_1.__importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = tslib_1.__importDefault(require("swagger-ui-express"));
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const app = (0, express_1.default)();
// 設置 Swagger UI 的路由
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.get('/', function (req, res) {
    res.send('<a href="/api-docs">Go to API Docs</a>');
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
    console.log('API docs are available at http://localhost:3000/api-docs');
});
//# sourceMappingURL=index.js.map