const express = require('express');
const fs = require('fs');
const app = express();
const port = 3030;

// JSON veriyi işlemek için body-parser ekleyin
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// IP Value'yu kaydetmek için POST endpoint
app.post('/save-ip', (req, res) => {
    const ipValue = req.body.ipValue;
    fs.writeFile('ipValue.json', JSON.stringify({ ipValue: ipValue }, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).json({ message: 'Error writing to file' });
        }
        res.status(200).json({ message: 'IP Value saved successfully' });
    });
});

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
