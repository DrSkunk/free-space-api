const checkDiskSpace = require("check-disk-space").default;
const http = require("http");
const PORT = process.env.PORT || 8454;

const server = http.createServer(async (req, res) => {
  const { size, free } = await checkDiskSpace("/data");
  const data = {
    sizeBytes: size,
    freeBytes: free,
    sizeGigabytes: byteToGigabyte(size),
    freeGigabytes: byteToGigabyte(free),
    freeSpacePercent: freeSpacePercentage(size, free),
  };
  if (req.url === "/api" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(data));
    res.end();
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});

function byteToGigabyte(bytes) {
  return +(bytes / 1000000000).toFixed(2);
}

function freeSpacePercentage(size, free) {
  return Math.round((free / size) * 100);
}
