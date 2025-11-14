import express from "express";
const pathToSwaggerUi = require("swagger-ui-dist").absolutePath();
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import session from "express-session";
import apiRouter from "./routes/index";

declare module "express-session" {
  interface SessionData {
    [key: string]: any;
  }
}

declare global {
  namespace Express {
    interface Request {
      sessionID: string;
    }
  }
}

// 啟用 CORS 中介軟體，允許所有來源
const corsOptions = cors({
  origin: "http://localhost:3000", // 前端應用程式的 URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
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

app.use(corsOptions);
app.use(express.json());
app.use(
  // session({
  //   secret: "wESDEDfdmf",
  //   resave: false,
  //   saveUninitialized: true,
  //   cookie: { secure: false, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 }, // 1 天
  // })
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// 設置 Swagger UI 的路由
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// 引用所有的 router
app.use("/api", apiRouter);

// 提供 Swagger UI 所需的靜態檔案
app.use("/swagger-ui-assets", express.static(pathToSwaggerUi));

app.get("/", function (req, res) {
  res.send('<a href="/api-docs">Go to API Docs</a>');
});

app.get("/status", (req, res) => {
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views++;
  }
  res.json({ status: "ok", views: req.session.views });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
  console.log("API docs are available at http://localhost:3001/api-docs");
});
