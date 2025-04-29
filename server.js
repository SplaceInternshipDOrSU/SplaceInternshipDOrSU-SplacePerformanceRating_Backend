const express = require("express");
const { dbConnect } = require("./utils/db");
const app = express();
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const port = process.env.PORT;
const { init: initSocket } = require("./socket"); // Import the socket initialization

const server = http.createServer(app);
// Set an extremely high header size (e.g., 1MB)
server.maxHeaderSize = 1048576; 

app.use(
  cors({
    origin:
      process.env.MODE === "proasdads"
        ? [
            process.env.client_trader_production_url,
            process.env.client_admin_production_url,
            "http://localhost:3000",
            "http://localhost:3003",
            "http://localhost:3009",
            "http://localhost:5173",
          ]
        : ["http://localhost:3000", "http://localhost:3003", "http://localhost:3009","http://localhost:5173"],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

dbConnect();

initSocket(server, {
  cors: {
    origin:
      process.env.MODE === "pro"
        ? [
            process.env.client_trader_production_url,
            process.env.client_admin_production_url,
            "http://localhost:3000",
            "http://localhost:3003",
            "http://localhost:5173",
          ]
        : ["http://localhost:3000", "http://localhost:3003", "http://localhost:5173"],
    credentials: true,
  },
});


app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/dashboard/userRoutes"));
app.use("/api", require("./routes/dashboard/adminActionRoutes"));
// app.use("/api", require("./routes/chatRoutes"));


app.get("/", (req, res) => {
  res.send("Welcome to Splace Performance Suite backend!");
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
