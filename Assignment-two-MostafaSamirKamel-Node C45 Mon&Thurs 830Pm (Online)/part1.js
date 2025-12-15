const { log } = require('console');
const path = require('node:path');
const fs = require('node:fs');
const EventEmitter = require('node:events');
const os = require('node:os');

// Part 1

//1
function logCurrentFileAndDirectory() {
    const info = {
        File: __filename,
        Dir: __dirname
    };
    log(info);
}
logCurrentFileAndDirectory();

//

let myPath = 'D:/web_route/backend/apply/index.js'
function logFileInfo(Path){
   const info = {
        File: path.basename(Path),
        Dir: path.dirname(Path)
    };
    log(info);
}
logFileInfo(myPath);


//2
function logFileName(Path){
    log(path.basename(Path));
}
logFileName(myPath);

//3
const obj = {
  root: 'D:/',
  dir: 'D:/web_route/backend/apply',
  base: 'index.js',
  ext: '.js',
  name: 'index'
};
function builtPath(obj){
    log(path.format(obj));
}
builtPath(obj);

//4
function logFileExtension(Path){
    log(path.extname(Path));
}
logFileExtension(myPath);

//5
function parsePath(Path){
    log(path.parse(Path));
}
parsePath(myPath);


//6
function logIsAbsolute(Path){
    log(path.isAbsolute(Path));
}
logIsAbsolute(myPath);

//7
function joinPaths(...paths){
    log(path.join(...paths));
}
joinPaths('D:/web_route/backend/apply', 'index.js');

//8
function resolvePath(...paths){
    log(path.resolve(...paths));
}
resolvePath('index.js');

//9
function joinTwoPaths(path1, path2) {
    log(path.join(path1, path2));
}
joinTwoPaths('/folder1', 'folder2/file.txt');

//10
function deleteFileAsync(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) {
             log('Error deleting file (maybe it does not exist)'); 
        } else {
            log(`The ${path.basename(filePath)} is deleted.`);
        }
    });
}
// deleteFileAsync(myPath);


//11
function createFolderSync(folderName) {
    try {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
            log("Success");
        } else {
            log("Folder already exists");
        }
    } catch (err) {
        log("Error creating folder");
    }
}
// createFolderSync('newFolder');

//12
const myEmitter = new EventEmitter();
myEmitter.on('start', () => {
    log('Welcome event triggered!');
});
myEmitter.emit('start');

//13
myEmitter.on('login', (username) => {
    log(`User logged in: ${username}`);
});
myEmitter.emit('login', 'Mostafa');

//14
function readFileSynchronously(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        log(`the file content => "${content}"`);
    } catch (err) {
        log("Error reading file: " + err.message);
    }
}
readFileSynchronously('./nodejs.txt');

//15
function writeFileAsync(filePath, content) {
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            log('Error writing file: ' + err.message);
        } else {
             log('File saved asynchronously');
        }
    }); 
}
writeFileAsync('./async.txt', 'Async saved successfully');

//16
function checkDirectoryExists(dirPath) {
    if (fs.existsSync(dirPath)) {
        log("true");
    } else {
        log("false");
    }
}
checkDirectoryExists('./nodejs.txt'); 

function checkIsDirectory(dirPath) {
     if (fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()) { // Strictly directory
         log("true");
     } else {
        log(fs.existsSync(dirPath));
     }
}

function checkPathExists(pathStr) {
    log(fs.existsSync(pathStr));
}
checkPathExists('./nodejs.txt');


//17
function getOSInfo() {
    const info = {
        Platform: os.platform(),
        Arch: os.arch()
    };
    log(info);
}
getOSInfo();
