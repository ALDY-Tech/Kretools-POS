// lib/midtrans.js
import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: false, // ubah ke true jika production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export default snap;
