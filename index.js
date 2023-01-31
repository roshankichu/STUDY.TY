const express = require('express')
const mongoose = require("mongoose");
const app = express()
const port = 3000
const authRoutes = require("./routes/user.route");

require("dotenv").config();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/upload",express.static('upload'))
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "awwf",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection Success.");
  })
  .catch((err) => {
    console.error("Mongo Connection Error", err);
  });
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
app.use("/users", authRoutes);

