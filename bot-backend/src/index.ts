import "dotenv/config";
import express from "express";
import bodyparser from "body-parser";
const { PORT } = process.env;

async function main() {
  const { default: auth } = await import("./routes/auth");
  const { default: user } = await import("./routes/user");
  const { default: tracks } = await import("./routes/tracks");
  const app = express();

  app.use(bodyparser.json());

  app.use("/api", auth);
  app.use("/api", user);
  app.use("/api", tracks);
  app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
  );
}

main();
