import http from 'node:http'; 

const servidor = http.createServer((pedido, respuesta) => {
  respuesta.writeHead(200, {'Content-Type': 'text/html'});
  respuesta.write('<h1>Mi servidor funciona</h1>');
  respuesta.end();
});

servidor.listen(3000);
console.log('Servidor en http://localhost:3000');