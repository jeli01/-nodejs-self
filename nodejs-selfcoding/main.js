let http = require('http');
let fs = require('fs');
let url = require('url');
let qs = require('querystring');

let app = http.createServer(function(request,response){
    let _url = request.url;
    let queryData = url.parse(_url, true).query;
    let pathname = url.parse(_url, true).pathname;
    
    let list = '';
    let title = queryData.id;
    if(title === undefined) {
      title = 'nodejs';
    }

    filelist = fs.readdirSync(`./data`, 'utf8');
    list += '<ul>'
    for(let i = 0 ; i < filelist.length ; i++) {
      list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    }
    list += '</ul>'

    if(pathname == '/') {
      fs.readFile(`./data/${title}`, 'utf8', function(error, description) {
        if(description === undefined) {
          description = 'hello! nodejs!';
        }
        let template = `
        <!doctype html>
        <html>
        <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        <a href ="/create">create</a> <a href ="/update?id=${title}">update</a>
        <form action="/delete_process" method="post">
          <input type="hidden" name="id" value="title">
          <input type="submit" value="delete">
        </form>
        <h2>${title}</h2>
        <p>${description}</p>
        </body>
        </html>
        `
        response.writeHead(200);
        response.end(template);
      });
    } else if (pathname == '/create') {
      fs.readFile(`./data/${title}`, 'utf8', function(error, description) {
        if(description === undefined) {
          description = 'hello! nodejs!';
        }
        let template = `
        <!doctype html>
        <html>
        <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="id"></p>
          <p><textarea name ="description" placeholder="description"></textarea></p>
          <p><input type="submit"></p>
        </form>
        </body>
        </html>
        `
        response.writeHead(200);
        response.end(template);
      });
    } else if (pathname === '/create_process') {
      body = '';
      request.on('data', function(data) {
        body += data;
      });
      request.on('end', function() {
        let post = qs.parse(body);
        let title = post.title;
        let description = post.description;
        fs.writeFile(`./data/${title}`, description, 'utf8', function() {
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        });
      });
    } else if (pathname === '/update') {
      fs.readFile(`./data/${title}`, 'utf8', function(error, description) {
        if(description === undefined) {
          description = 'hello! nodejs!';
        }
        let template = `
        <!doctype html>
        <html>
        <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="id" value="${title}"></p>
          <p><textarea name ="description" placeholder="description">${description}</textarea></p>
          <p><input type="submit"></p>
        </form>
        </body>
        </html>
        `
        response.writeHead(200);
        response.end(template);
      });
    } else if (pathname === '/update_process') {
      body = '';
      request.on('data', function(data) {
        body += data;
      });
      request.on('end', function() {
        let post = qs.parse(body);
        let id = post.id;
        let title = post.title;
        let description = post.description;
        fs.rename(`./data/${id}`, `./data${title}`, function(err) {
          fs.writeFile(`./data/${title}`, description, 'utf8', function() {
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          });
        })
      });
    } else if (pathname === '/delete_process') {
      body = '';
      request.on('data', function(data) {
        body += data;
      });
      request.on('end', function() {
        let post = qs.parse(body);
        let id = post.id;
      });
    } else {
      response.writeHead(404);
      response.end('Not Found');
      fs.unlink(`./data/${id}`,function(err) {
        response.writeHead(302, {Location: `/`});
        response.end();
      })
    }
});
app.listen(3000);