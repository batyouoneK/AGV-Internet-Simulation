const fs = require("fs");
const express = require("express");
const app = express();
const port = 3030;

// output.json dosyasını hizmet et
app.get("/data", (req, res) => {
  fs.readFile("output.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading file");
    }

    // Dosyayı boşalt
    fs.writeFile("output.json", "", (err) => {
      if (err) {
        console.error("Error clearing file:", err);
        return res.status(500).send("Error clearing file");
      }

      res.send(data);
    });
  });
});

// index.html dosyasını hizmet et
app.use(express.static(__dirname));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
