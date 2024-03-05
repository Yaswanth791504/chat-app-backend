/* eslint-disable no-undef */
const { default: mongoose } = require("mongoose");
const app = require("./index.js");

app.listen(process.env.PORT || 7846, () => {
  console.log(`App is listening on ${process.env.PORT}`);
  mongoose
    .connect(process.env.MONGO_URL.replace("<password>", process.env.PASSWORD))
    .then(() => {
      console.log("Db is connected");
    })
    .catch((err) => {
      console.error(err.message);
    });
});
