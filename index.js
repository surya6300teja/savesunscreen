import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "";
const yourAPIKey1="Or+hSP5RYJVgZDY7a8wQlg==mfX9bZbogMButfBG";
const yourAPIKey2="openuv-bytfqeorlrvrxshb-io";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



app.get("/",(req,res)=>{
    res.render("index.ejs");
})

app.post("/process-location",async(req,res)=>{
    const city = req.body.city;
    const country = req.body.country
    console.log('Received location:', { city,country });
    try{
        
        const result = await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=${city}&country=&${country}`, {
                headers: {
                  'X-Api-Key' : yourAPIKey1,
                },
              });
        const lat = result.data[0].latitude;
        const lon = result.data[0].longitude;
        const result2 = await axios.get(`https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}`,{
            headers:{
                'x-access-token' : yourAPIKey2,
            }
        });
        //const uv = 7;
        const uv = result2.data.result.uv;
        const uv_max = result2.data.result.uv_max;
        const maxUvIndexTime =result2.data.result.uv_max_time;
        res.render("index.ejs", { City : city, Country:country, uvIndex : uv , maxUvIndex: uv_max,maxUvIndexTime:maxUvIndexTime});
    }catch(error){
        console.error("Failed to make request:", error.message);
      res.render("index.ejs", {
        error: error.message,
    });
  }  
})




app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})