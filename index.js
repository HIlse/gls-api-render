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
            }
        }); 
        res.json(dataSimplify(response.data));
       
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/api/say-hi', async (req, res) => {
    try {
        res.json({
            message: 'Hi there!'
        })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

function dataSimplify(resp) {
    if (resp.groupID) {
        
        let simplifiedRes = {
            OrderInfo: [
                {
                    name: 'GroupID',
                    value: resp.groupID,

                }, {
                    name: 'Tên quán',
                    value: resp.merchantName
                }, {
                    name: 'Tổng',
                    value: resp.breakdowns.find(breakdown => breakdown.key === "subtotal").value.amountInMinor
                }, {
                    name: 'Phí',
                    value: resp.breakdowns.find(breakdown => breakdown.key === "service_fees").value.amountInMinor
                }, {
                    name: 'Giảm giá',
                    value: (-1)*resp.breakdowns
                        .filter(breakdown => breakdown.value && typeof breakdown.value.amountInMinor === 'number' && breakdown.value.amountInMinor < 0)
                        .reduce((sum, breakdown) => sum + breakdown.value.amountInMinor, 0)
                }, {
                    name: '#################',
                    value: '##############################'
                }
            ]
        }
        resp.memberBills.forEach(e => {
            let item = {
                name: nameCheck(e.memberID),
                value: e.breakdowns.find(breakdown => breakdown.key === "subtotal").value.amountInMinor
            }
            simplifiedRes.OrderInfo.push(item);
        });


        return simplifiedRes;
    } else {
        return resp;
    }
   
}

function nameCheck(id) {
    switch (id) {
        case 'eM1d13':
            return `DatQ`;
            break;
        case '7676Zw':
            return 'Hải';
            break;
        case '4wr0mj':
            return 'a Thành';
            break;
        case 'rg1dge':
            return 'a Thor';
            break;
        case '9ZKvvL':
            return 'Sara';
            break;
        case 'A7vZy':
            return 'Dat An';
            break;
        case 'OadyZ7A':
            return 'Thảo nhỏ';
            break;
        case '0Yb8Zj':
            return 'Bi Phạm';
            break;
        case 'yZ6b1zM':
            return 'a Xuyên';
            break;
        case '5VOQQP':
            return 'a Luân';
            break;
        case '5EYKpY':
            return 'Duy';
            break;
        case 'yZ2X8W':
            return 'a Nhân';
            break;
        case 'K4Q1xJ':
            return 'c Thảo';
            break;
        case 'KrxGbN':
            return 'Nam';
            break;
        case '4EKZkwA':
            return 'a Thư';
            break;
        case 'rjka1L':
            return 'Phước';
            break;
        case 'EOVbrv':
            return 'c Vân';
            break;
        case 'KxW30M':
            return 'Bảo';
            break;
        default:
            return id;
            break;
    }
}