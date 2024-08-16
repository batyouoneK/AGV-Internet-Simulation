const zmq = require("zeromq");
const fs = require("fs");

let sock = zmq.socket("sub");
let currentIpValue = null;
const jsonFilePath = "ipValue.json";
const dataFilePath = "output.json";

// ZeroMQ Subscriber'ı başlat
function startSubscriber(ipValue) {
  if (sock) {
    sock.close(); // Önceki bağlantıyı kapat
  }

  sock = zmq.socket("sub");
  sock.connect(`tcp://${ipValue}`);
  sock.subscribe("pnet");
  console.log(`Subscriber connected on this Port and IP : ${ipValue}`);

  sock.on("message", function(topic, message) {
    console.log("Received a message related to:", topic.toString(), "containing message:", message.toString());

    // Gelen mesajı ASCII'ye çevirelim
    const asciiData = message.toString('ascii');

    // ASCII veriyi ';' karakterine göre ayıralım
    const dataParts = asciiData.split(';');

    // Ayrılan verileri ilgili değişkenlere atayalım
    const InternetSpeed = parseInt(dataParts[0]);
    const X = parseInt(dataParts[1]);
    const Y = parseInt(dataParts[2]);

    console.log("InternetSpeed:", InternetSpeed);
    console.log("X:", X);
    console.log("Y:", Y);

    // Verileri bir nesneye dönüştürelim
    const dataToWrite = {
      InternetSpeed: InternetSpeed,
      X: X,
      Y: Y
    };

    // JSON formatına çevirip dosyaya yazalım
    fs.writeFile(dataFilePath, JSON.stringify(dataToWrite, null, 2), (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log("Data successfully written to file");
      }
    });
  });
}

// IP değerini kontrol et ve gerekirse bağlantıyı güncelle
function checkAndUpdateIpValue() {
  fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading ipValue.json:", err);
      return;
    }

    try {
      const newIpValue = JSON.parse(data).ipValue;
      if (!newIpValue) {
        console.error("IP address not found in ipValue.json");
        return;
      }

      if (currentIpValue !== newIpValue) {
        console.log(`IP value updated from ${currentIpValue} to ${newIpValue}`);
        currentIpValue = newIpValue;
        startSubscriber(currentIpValue); // Yeni IP ile bağlantıyı başlat
      }
    } catch (parseError) {
      console.error("Error parsing ipValue.json:", parseError);
    }
  });
}

// IP değeri kontrolünü her saniye yap
setInterval(checkAndUpdateIpValue, 1000);
