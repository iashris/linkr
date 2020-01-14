import express from "express";
import redirect from "express-redirect";
import bodyParser from "body-parser";
import http from "http";

import testRoute from "./routes/admin/testtxn";
import pageRedirectRoute from "./routes/admin/pgredirect";
import responseRoute from "./routes/admin/response";
import indexRoute from "./routes/index";
var app = express();
redirect(app);

var server = http.createServer(app);

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
const port = process.env.PORT || 8080;
server.listen(port, function() {
  var host = server.address();
  console.log("Example app listening at ", port);
});

app.use("/", indexRoute);
app.use("/testtxn", testRoute);
app.use("/pgredirect", pageRedirectRoute);
app.use("/complete", responseRoute);

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
