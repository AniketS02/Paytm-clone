const express = require("express")
const mainRouter = require("../backend/routes/index");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json())
app.use('api/v1',mainRouter); // this will be applicable to every route

module.exports = mainRouter
app.listen(3000);