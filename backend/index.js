// This file is created to resolve Render deployment issue
// Render looks for index.js by default if no start script is properly detected
// This file simply imports and runs the main server.js file

require('./server.js');