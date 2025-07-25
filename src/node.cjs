/*const http = require('http');

const PORT = 3001; // Change this line

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, world!');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
}); */

 const http = require('http');

 const port = 5000;

  const server = http.createServer ((req,res) => {
    res.writeHead(200, {'content-type' : 'text/plain'});
    res.end("hello vishal");
  });

  server.listen(port,() =>{
    console.log(`server running at http://localhost:${port}/`);
  }
  )

