const fs = require("node:fs");
const zlib = require("node:zlib");
const { pipeline } = require("node:stream");
const gzip = zlib.createGzip();

const readStream = fs.createReadStream("data.txt", {
  // encoding: 'utf8',
  // highWaterMark: .25 * (1024 * 1024)
});

const writeStream = fs.createWriteStream("data_dest.txt", {
  encoding: "utf8",
  flags: "w",
});

//1

readStream.on("open", () => {
  console.log("Read Stream Open");
});

readStream.on("ready", () => {
  console.log("Read Stream is Ready");
});

let i = 1;

readStream.on("data", (chunk) => {
  console.log(chunk);
  console.log(`---------${i}----------`);
  i++;
});

readStream.on("end", () => {
  console.log("Read Stream end");
});

readStream.on("error", (err) => {
  console.error("Error reading file:", err);
});

readStream.on("close", () => {
  console.log("Read Stream closed");
});

// 2
readStream.on("data", (chunk) => {
  writeStream.write(chunk);
});

readStream.on("end", () => {
  writeStream.end();
  console.log("File copied using streams");
});

// 2_2
readStream.pipe(writeStream).on("finish", () => {
  console.log("File copied using pipe");
});

// 3
// pipeline(readStream, gzip, writeStream, (err) => {
//   if (err) {
//     console.error("Pipeline failed:", err);
//   } else {
//     console.log("File compressed successfully!");
//   }
// });

