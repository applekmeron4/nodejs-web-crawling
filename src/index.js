import http from 'http';
import url from 'url';
import fs from 'fs';
import phantom from 'phantom';
import cheerio from 'cheerio';
import axios from 'axios';


http.createServer(async (request, response) => { 
  const ARTICLE_COUNT = 10; 
  let pathname = url.parse(request.url).pathname;

  if (request.method === 'GET') { // GET 요청이면
    if (pathname === '/'){
      pathname = 'src/index.html';
      open(response, pathname);
    } else if (pathname === '/search') {
      const params = url.parse(request.url, true).query;
      const keyword = encodeURIComponent(params.keyword);
      const { blogs, start, end } = params;

      const data = [];
      for (let i = start - 1; i < end; i ++) {
        const s = (ARTICLE_COUNT * i) + 1;
        await crawler(data, keyword, s);
      }

      response.writeHead(200, {'Content-Type': 'application/json'});
      response.end(JSON.stringify(data));
    } else if (pathname === '/searchBlog') {
      const params = url.parse(request.url, true).query;
      const list = JSON.parse(params.list);
      
      const data = [];
      for (const id of list) {
        await blogCrawler(data, id);
      }

      response.writeHead(200, {'Content-Type': 'application/json'});
      response.end(JSON.stringify(data));
    }
  }
}).listen(8080);

const open = (response, pathname) => {
  fs.readFile(pathname, (err, data) => {
    if (err) {
       console.log(err);
       // 페이지를 찾을 수 없음
       // HTTP Status: 404 : NOT FOUND
       // Content Type: text/plain
       response.writeHead(404, {'Content-Type': 'text/html'});
    }else{	
       // 페이지를 찾음	  
       // HTTP Status: 200 : OK
       // Content Type: text/plain
       response.writeHead(200, {'Content-Type': 'text/html'});	
       
       // 파일을 읽어와서 responseBody 에 작성
       response.write(data.toString());		
    }
    // responseBody 전송
    response.end();
 });   
};

// 크롤링 
const crawler = async (data, keyword, start) => {
  const url = `https://search.naver.com/search.naver?where=webkr&query=${keyword}&docid=0&lang=all&f=insite&srcharea=all&st=s&fd=2&start=${start}&display=10&domain=&filetype=none&sbni=&dtype=all&dfrom=&dto=&sm=tab_pge&r=http%3A%2F%2Fblog.naver.com&research_url=blog.naver.com&ie=utf8`;
  
  // const instance = await phantom.create(["--proxy=1.229.165.34:12389", "--proxy-type=socks5"]);
  const instance = await phantom.create();
  const page = await instance.createPage();
  await page.on('onResourceRequested', function(requestData) {
    console.info('Requesting', requestData.url);
  });
 
  const status = await page.open(url);
  const content = await page.property('content');

  console.log(content);
  const $ = cheerio.load(content);
  const list = $('#elThumbnailResultArea dl').toArray();
 
  $('#elThumbnailResultArea dl').each((i, el) => {
    const title = $(el).children('dt').text();
    const url = $(el).children('.txt_block').text().split('열기')[0];
    const desc = $(el).children('.sh_web_passage').text();
    let blogs = desc.split('블로그')[1].split('건')[0]
    blogs = parseInt(blogs.replace(/,/g, ''));
    console.log(title, url, desc, blogs);

    data.push({ title, url, desc, blogs });
  });

  await instance.exit();
};

const blogCrawler = async (data, id) => {
  // const url = `http://blog.naver.com/PostList.nhn?from=postList&blogId=${id}&currentPage=1`;
  const url = `http://blog.naver.com/profile/history.nhn?blogId=${id}`;
  
  // const instance = await phantom.create(["--proxy=1.229.165.34:12389", "--proxy-type=socks5"]);
  const instance = await phantom.create();
  const page = await instance.createPage();
  await page.on('onResourceRequested', function(requestData) {
    console.info('Requesting', requestData.url);
  });
 
  const status = await page.open(url);
  const content = await page.property('content');
  
  const $ = cheerio.load(content);

  const history = $('#post-area td').text().replace(/ /gi, "").replace(/\n/g, "").replace(/\r/g, "").replace(/\s+/, "").replace(/\s+$/g, "").replace(/\t/g, "").replace( /(\s*)/g, "");
  const idPos = history.indexOf(id);
  const date = history.slice(idPos - 12, idPos - 1);

  data.push(date);

  await instance.exit();
};
