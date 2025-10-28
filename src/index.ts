import express from "express";
const pathToSwaggerUi = require("swagger-ui-dist").absolutePath();
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import session from "express-session";

// 啟用 CORS 中介軟體，允許所有來源
const corsOptions = cors({
  origin: "*",
  credentials: true,
});
const options = {
  definition: {
    openapi: "3.0.3", // 指定 OpenAPI 版本
    info: {
      title: "NTUT Homework Upload API",
      version: "1.0.0",
      description: "API documentation for NTUT Homework Upload system",
    },
    // 將 components, security, servers 移入 definition 物件中
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "session",
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
    servers: [
      {
        url: "/",
        description: "相對路徑伺服器",
      },
    ],
  },
  // apis 陣列指向包含 JSDoc 註解的檔案或規格檔案
  apis: ["./swagger.yaml"], // Path to the API docs
};

// swagger-jsdoc 會讀取 options 並產生完整的 OpenAPI 規格
const swaggerSpec = swaggerJSDoc(options);

const app = express();

// 設置 Swagger UI 的路由
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get("/", function (req, res) {
  res.send('<a href="/api-docs">Go to API Docs</a>');
});

app.use(corsOptions);
app.use(express.json());
app.use(
  session({
    secret: "wESDEDfdmf",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // 在非 HTTPS 環境下設置為 false
  })
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  console.log("API docs are available at http://localhost:3000/api-docs");
});
