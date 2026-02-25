
const express = require("express");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const cors = require('cors');

// Restrict CORS to allowed origins
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/v1/payment", paymentRoutes);

app.get("/", (req, res) => {
    res.send("MANAS360 Backend is Running!");
});

module.exports = app;
