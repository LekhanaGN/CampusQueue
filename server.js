const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

const PORT = process.env.PORT || 3000;

const supabase = require("./config/supabase");

app.get("/api/services", async (req, res) => {
    const { data, error } = await supabase
        .from("services")
        .select("*");

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});