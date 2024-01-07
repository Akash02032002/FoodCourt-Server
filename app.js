require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(express.json());
app.use(cors());

// checkout api

app.post("/api/create-checkout-session", async (req, res) => {
  const { products } = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.dish,
        images: [product.imgdata],
      },
      unit_amount: product.price * 100,
    },
    quantity: product.qnty,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "https://food-court-one.vercel.app/success",
    cancel_url: "https://food-court-one.vercel.app/cancel",
  });

  res.json({ id: session.id });
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(
    `Server started at https://foodcourt-server.onrender.com:${PORT}`
  );
});
