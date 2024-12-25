const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { queryHuggingFace } = require("./config/constants");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/chat", async (req, res) => {
    const { inputs } = req.body;

    try {
        const response = await queryHuggingFace(inputs);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch response from Hugging Face API" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});