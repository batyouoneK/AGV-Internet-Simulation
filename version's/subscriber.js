var zmq = require("zeromq");
var fs = require("fs");
var sock = zmq.socket("sub");

sock.connect("tcp://192.168.2.126:5556");
sock.subscribe("pnet");
console.log("Subscriber connected to port 5556");

sock.on("message", function(topic, message) {
  console.log("received a message related to:", topic.toString(), "containing message:", message.toString());

  // Gelen mesajı ASCII'ye çevirelim
  var asciiData = message.toString('ascii');

  // ASCII veriyi ';' karakterine göre ayıralım
  var dataParts = asciiData.split(';');

  // Ayrılan verileri ilgili değişkenlere atayalım
  var InternetSpeed = parseInt(dataParts[0]);
  var X = parseInt(dataParts[1]);
  var Y = parseInt(dataParts[2]);

  console.log("InternetSpeed:", InternetSpeed);
  console.log("X:", X);
  console.log("Y:", Y);

  // Verileri bir nesneye dönüştürelim
  var dataToWrite = {
    InternetSpeed: InternetSpeed,
    X: X,
    Y: Y
  };

  // JSON formatına çevirip dosyaya yazalım
  fs.writeFile("output.json", JSON.stringify(dataToWrite, null, 2), (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("Data successfully written to file");
    }
  });
});
