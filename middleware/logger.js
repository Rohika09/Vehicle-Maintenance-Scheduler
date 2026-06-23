const axios = require("axios");
require("dotenv").config();

const BASE_URL = "http://4.224.186.213/evaluation-service";

async function Log(stack, level, packageName, message){
    try{
        await axios.post(`${BASE_URL}/logs`, {
            stack,
            level,
            package: packageName,
            message
        },
        {
            headers: {
                 Authorization: `Bearer ${process.env.TOKEN}`
            }
        }
        );
    }catch(error){

    }
}
module.exports = Log;