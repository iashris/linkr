import checksum from "../../model/checksum";

export default function(app) {
  app.get("/", function(req, res) {
    res.render("pgredirect.ejs");
  });
}
//vidisha
