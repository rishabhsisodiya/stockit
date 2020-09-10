require("isomorphic-fetch");
const dotenv = require("dotenv");
const Koa = require("koa");
const Router = require("koa-router");
const nodemailer = require("nodemailer");
const next = require("next");
const { default: createShopifyAuth } = require("@shopify/koa-shopify-auth");
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const session = require("koa-session");
dotenv.config();
const { default: graphQLProxy } = require("@shopify/koa-shopify-graphql-proxy");
const { ApiVersion } = require("@shopify/koa-shopify-graphql-proxy");
const getSubscriptionUrl = require("./server/getSubscriptionUrl");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const {
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  API_VERSION,
  USER,
  PASS,
} = process.env;
const transport = {
  host: "smtp.gmail.com",
  auth: {
    user: USER,
    pass: PASS,
  },
};
let transporter = nodemailer.createTransport(transport);
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("All works fine, congratz!");
  }
});
app.prepare().then(() => {
  const server = new Koa();
  const router = Router();
  server.use(session({ secure: true, sameSite: "none" }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: [
        "write_products",
        "read_products",
        "read_inventory",
        "write_inventory",
      ],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });
        console.log('Before /');
        ctx.redirect("/");
        //  await getSubscriptionUrl(ctx, accessToken, shop);
        console.log('Start');
        router.get('/send',(req, res, next)=>{
          console.log('get');
        })
        router.post("/send", (req, res, next) => {
          console.log('POst: ',req, res);
          const name = req.body.name;
          const email = req.body.email;
          const message = req.body.messageHtml;
          var mail = {
            from: name,
            to: email,
            subject: "STOCKIT ALERT!",
            html: message,
          };

          transporter.sendMail(mail, (err, data) =>{
            if (err) {
              res.json({msg:'fail'})
            } else {
              res.json({msg:'success'})
            }
          }

          )
        });// End router post

      },
    })
  );
console.log('working');
  server.use(graphQLProxy({ version: ApiVersion.October19 }));
  server.use(verifyRequest());
  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return;
  });
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
