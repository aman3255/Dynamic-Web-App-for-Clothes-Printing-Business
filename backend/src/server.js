// ========== Importing =================
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { dbConnect } =  require('./database/connect.db');
const v1Router = require('./routes/v1/v1.router');

//  ========== ENVIRONMENT VARIABLES ==========
const DEV_PORT = process.env.DEV_PORT;
const NODE_ENV = process.env.NODE_ENV;
// ===========================================


// ======= Server =========
const server = express();
server.use(express.json());
server.use(cors());
// ========================

// ======= Routes =========
server.use('/api/v1', v1Router);
// ========================



// ============ Start Server ============
async function startServer() {
    try {
        await dbConnect(); // connect to db
        server.listen(DEV_PORT, () => {
            console.log(`Server is running on port ${DEV_PORT} & enviroment is ${NODE_ENV}`);
        })
    } catch (error) {
        console.error(`Error while starting the server ${error}`);
    }
}

startServer(); // start the server
// ================================