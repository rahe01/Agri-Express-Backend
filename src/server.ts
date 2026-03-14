import app from "./app"
import envConfig from "./config/env";



const server = async () =>{
    try{
        app.listen(envConfig.PORT, () => {
            console.log(`Server is running on port ${envConfig.PORT}`);
        })
    }catch(err){
        console.log(err)
    
    }
}

server();

