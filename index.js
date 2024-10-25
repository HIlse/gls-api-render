const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Route to fetch data from an external API
app.get('/api/data', async (req, res) => {
    const ssid = req.headers['ssid'];
    const groupid = req.headers['groupid'];

    if (!ssid || !groupid) {
        return res.status(400).json({ error: 'Missing required headers: ssid and groupid' });
    }

    try {
        const response = await axios.get('https://food.grab.com/proxy/foodweb/v1/auth/grouporder/groups/'+ groupid +'/splitbill', {
            method: "get",
            headers: {
                'Host': 'food.grab.com',
                'User-Agent': 'PostmanRuntime/7.42.0',
                'X-MTS-SSID': ssid
        }}); // Replace with the actual URL test
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from external API' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});