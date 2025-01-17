//server inialize
const express = require('express');
const {exec} = require('child_process');
const app = express();


//middleware
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const sequelize = require('./config/db');


//use  middleware in app
app.use(cors());
app.use(fileUpload());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));




// Run the cleanup script
exec('node ./cleanupIndexes.js', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing cleanup script: ${error}`);
        return;
    }
    console.log(`Cleanup script output: ${stdout}`);
    if (stderr) {
        console.error(`Cleanup script stderr: ${stderr}`);
    }
});
//sync database
sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced successfully.');
}).catch((error) => {
    console.error('Error syncing database:', error);
});


//import routes
const InputRoute = require('./API/Model/Inputs/InputRoutes');
const MemberRoute = require('./API/Member/memberRoute');
const ModelRoute=require('./API/Model/ModelRoute');
const QuotationRouter=require('./API/Quotation/QuotationRoute');
const BranchRoute=require('./API/BranchManagament/branchRoute');




app.get('/', (req, res) => {
    res.send(' Get Model Name with Quantity ');
});



//use routes in app
app.use('/api/member', MemberRoute);
app.use('/api/model',ModelRoute);
app.use('/api/quotation',QuotationRouter);
app.use('/api/input', InputRoute);
app.use('/api/branch',BranchRoute);//



//start server
const port = 5000;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});


//