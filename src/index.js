import http from 'http';
import url from 'url';
import fs from 'fs';

http.createServer(async (request, response) => {  
  // write code
  const path = url.parse(request.url, true).pathname; // url에서 path 추출
  if (request.method === 'GET') { // GET 요청이면
    if (path === '/') { // 주소가 /이면
      response.writeHead(200, {'Content-Type':'text/html'});

      fs.readFile(process.cwd() + '/src/index.html', (err, data) => {
        if (err) {
          return console.error(err);
        }
        response.end(data, 'utf-8');
      });
    } else { // 매칭되는 주소가 없으면
      response.statusCode = 404; // 404 상태 코드
      response.end('주소가 없습니다');
    }
  }
}).listen(8080);

