const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const portNum = 3000;

const filePath = path.join(__dirname, "users.json");

const server = http.createServer((req, res) => {
    const { method, url } = req;
    if (method === "GET" && url === "/users") {
        res.writeHead(200, { "Content-Type": "application/json" });

        const readStream = fs.createReadStream(filePath, { encoding: "utf8" });
        readStream.pipe(res);
    }

    else if (method === "POST" && url === "/users") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const user = JSON.parse(body);

            let users = "";
            const readStream = fs.createReadStream(filePath, { encoding: "utf8" });

            readStream.on("data", (chunk) => {
                users += chunk.toString();
            });

            readStream.on("end", () => {
                const usersArray = users.split("\n").filter((line) => line.trim()).map((line) => JSON.parse(line));

                const existingUser = usersArray.find((u) => u.id === user.id || u.email === user.email);

                if (existingUser) {
                    res.writeHead(409, { "Content-Type": "application/json" });
                    res.end(
                        JSON.stringify({ message: "user with this id or email already exists" })
                    );
                    return;
                }

                const writeStream = fs.createWriteStream(filePath, {
                    flags: "a",
                    encoding: "utf8",
                });

                writeStream.write(JSON.stringify(user) + "\n");
                writeStream.end();

                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "user created", user }));
            });
        });
    }

    else if (method === 'GET' && url.startsWith('/user/')) {
        const id_string = url.split('/')[2];
        const id = Number(id_string);

        let users = '';
        const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

        readStream.on('data', (chunk) => {
            users += chunk.toString();
        });

        readStream.on('end', () => {
            const usersArray = users.split('\n').filter(line => line.trim()).map(line => JSON.parse(line));

            const user = usersArray.find((u) => u.id === id);

            if (user) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(user));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'user not found' }));
            }
        });
    }



    else if (method === 'DELETE' && url.startsWith('/user/')) {
        const id_string = url.split('/')[2];
        const id = Number(id_string);

        let users = '';
        const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

        readStream.on('data', (chunk) => {
            users += chunk.toString();
        });

        readStream.on('end', () => {
            const usersArray = users.split('\n').filter(line => line.trim()).map(line => JSON.parse(line));

            const filteredUsers = usersArray.filter((u) => u.id !== id);

            const writeStream = fs.createWriteStream(filePath, {
                flags: 'w',
                encoding: 'utf8'
            });

            filteredUsers.forEach((user) => {
                writeStream.write(JSON.stringify(user) + '\n');
            });

            writeStream.end();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'user deleted', user: { id } }));
        });
    }


    else if (method === 'PATCH' && url.startsWith('/user/')) {
        const id_string = url.split('/')[2];
        const id = Number(id_string);

        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const updates = JSON.parse(body);

            let users = '';
            const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

            readStream.on('data', (chunk) => {
                users += chunk.toString();
            });

            readStream.on('end', () => {
                const usersArray = users.split('\n').filter(line => line.trim()).map(line => JSON.parse(line));

                const updatedUsers = usersArray.map((u) => {
                    if (u.id === id) {
                        return { ...u, ...updates };
                    }
                    return u;
                });

                const writeStream = fs.createWriteStream(filePath, {
                    flags: 'w',
                    encoding: 'utf8'
                });

                updatedUsers.forEach((user) => {
                    writeStream.write(JSON.stringify(user) + '\n');
                });

                writeStream.end();

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'user updated', user: updatedUsers.find((u) => u.id === id) }));
            });
        });
    }

    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'not found' }));
    }
});

server.listen(portNum, () => {
    console.log(
        `Server is listening on port ${portNum} http://localhost:${portNum}`
    );
});
