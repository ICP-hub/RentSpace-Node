const { checkout } = require("../routes/stripeRoutes");

const stripe = require("stripe")(
  // This is your test secret API key.
  "sk_test_51PaXs7RuJSsA6J7Jvj8JgceLc0AZgVasMVPy8lRxf3dKdD2xd7XoDS9XwO8vrXLL0d2tiSHZmLQpflvkFnGnv7Dx00ckBf9tVZ",
  {
    apiVersion: "2023-10-16",
  }
);

const YOUR_DOMAIN = "http://localhost:5000/"

module.exports = {
  async createAccount(req, res) {
    console.log("Creating account call");
    try {
      const account = await stripe.accounts.create();

      res.json({
        account: account.id,
      });
    } catch (error) {
      console.error(
        "An error occurred when calling the Stripe API to create an account",
        error
      );
      res.status(500);
      res.send({ error: error.message });
    }
  },

  async createAccountLink(req, res) {
    try {
      const { account } = req.body;

      const accountLink = await stripe.accountLinks.create({
        account: account,
        return_url: `${req.headers.origin}/return/${account}`,
        refresh_url: `${req.headers.origin}/refresh/${account}`,
        type: "account_onboarding",
      });

      res.json(accountLink);
    } catch (error) {
      console.error(
        "An error occurred when calling the Stripe API to create an account link:",
        error
      );
      res.status(500);
      res.send({ error: error.message });
    }
  },

  async createPaymentIntent(req, res) {
    console.log("paymrnt intent called ::");
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "usd",
        payment_method_types: ["card"],
        transfer_data: {
          destination: req.body.account_id,
          // destination: 'acct_1Pht03Rs4aX6a4EN',
        },
      });
      res.json(paymentIntent);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  async webHook(req, res) {
    const sig = req.headers["strip-signature"];
    let event;

    try {
      event = stripe.webHook.constructEvent(
        req.boy,
        sig,
        "whsec_63ea03433be6cf04031dde73eacfaee256e5f90ace8e9786add31345db178544"
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${(err, message)}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "account.updated":
        const account = event.data.object;
        // Handle account update
        break;
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        // Handle successful payment
        break;
      default:
        // Unexpected event type
        return res.status(400).end();
    }

    res.json({ received: true });
  },


  async checkout(req,res){
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: 'price_1Ph6u6RuJSsA6J7JKPiY0dRJ',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/                                                                                                                                                                                                          `,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });
  
    console.log(session)
    // res.redirect(303, session.url);
    res.send({url:session.url})
  },



};
