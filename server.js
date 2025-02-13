require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// API to request payment
app.post('/request-payment', async (req, res) => {
    try {
        const { upi_id, amount } = req.body;

        if (!upi_id || !amount) {
            return res.status(400).json({ error: "UPI ID and amount are required" });
        }

        // Convert amount to paisa (Razorpay accepts in INR * 100)
        const paymentRequest = await razorpay.paymentLink.create({
            amount: amount * 100, // Convert to paisa
            currency: "INR",
            accept_partial: false,
            description: "NPTEL Exam Services",
            customer: { contact: upi_id },
            notify: { sms: true, email: true },
            upi: { flow: "collect" }
        });

        res.json({ success: true, payment_request: paymentRequest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
