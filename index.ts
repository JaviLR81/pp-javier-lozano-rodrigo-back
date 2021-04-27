import Server from "./classes/server";
import { SERVER_PORT } from "./global/enviroment";
import  router  from "./routes/router";
import bodyParser from 'body-parser';
import cors from 'cors';
import {json,urlencoded} from  'express';

//Singleton
const server=Server.instance;

//BodyParser
//server.app.use(bodyParser.urlencoded({extended:true}));
//server.app.use(bodyParser.json());
server.app.use(json());
server.app.use(urlencoded({extended:true}));

//CORS
server.app.use(cors({origin:true,credentials:true}));
server.app.use("/",router);

server.start(()=>{
    console.log("Server running at port: "+SERVER_PORT);    
}); 
