console.log("----------------------------------------");
console.log("Planner App > backend > server.js");
console.log("---------------------------------------");

//----------------------------------------------
// imports
//----------------------------------------------
const app = require('./controller/app');
// const publicIp = require('public-ip');
const port = process.env.PORT || 4202;
//----------------------------------------------
// configurations
//----------------------------------------------
// (async () => {
// 	const hostname = await publicIp.v4();
// 	const port = 3000;

//     //----------------------------------------------
//     // main
//     //----------------------------------------------
//     // start the server and start listening for incoming requests
//     app.listen(port, hostname, () => {
//         console.log(`Server started and accessible via http://${hostname}:${port}/`);
//     });
// })();

    app.listen(port, () => {
        console.log(`Server started and accessible via http://localhost:${port}/`);
    });     