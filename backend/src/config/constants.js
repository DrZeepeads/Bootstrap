const axios = require("axios");

const API_URL = "https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6b";
const API_KEY = process.env.HF_API_KEY;

const queryHuggingFace = async (inputs) => {
    const response = await axios.post(
        API_URL,
        { inputs },
        { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
    return response.data;
};

module.exports = { queryHuggingFace };