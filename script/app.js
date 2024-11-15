import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'node:url';

const server = createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/data/messages.json') {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
      const newMessage = JSON.parse(body);
      
      const filename = fileURLToPath(import.meta.url);
      const dirname = path.dirname(filename);
      const filePath = path.join(dirname, '../data/messages.json');

      readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end("Erreur serveur");
          return;
        }

        let messagesData = JSON.parse(data);
        let conversation = messagesData.find(conv => conv.conversationId === newMessage.conversationId);

        if (conversation) {
          // If conversation exist, add messages
          conversation.messages.push({
            senderId: newMessage.senderId,
            content: newMessage.content,
            timestamp: newMessage.timestamp
          });
        } else {
          console.log("conversation existe pas")
          // Creation of new conversation
          conversation = {
            conversationId: conversationId,
            friendId: newMessage.friendId,
            messages: [{
              senderId: newMessage.senderId,
              content: newMessage.content,
              timestamp: new Date().toISOString()
            }]
          };
        }

        // Écrire les données mises à jour dans le fichier JSON
        writeFile(filePath, JSON.stringify(messagesData, null, 2), (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end("Erreur lors de l'enregistrement du message");
            return;
          }

          // Répondre avec la conversation mise à jour
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(conversation));
        });
      });
    });
  } else {
  let reqPath = new URL(req.url, `http://${req.headers.host}`).pathname;

    // Par défaut, redirige vers index.html si on est à la racine
    if (reqPath === '/') {
        reqPath = '/index.html';
    }

    // Gérer les fichiers statiques
    const filePath = path.join(basePath, reqPath);
    const extname = path.extname(filePath);
    
    // Types MIME pour certains fichiers
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
  }
});

const PORT = 8888;
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const basePath = path.join(dirname, '../'); 

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});