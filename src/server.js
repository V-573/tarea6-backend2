import { env } from "./config/env.config.js";
import app from "./app.js";
import { connectDB } from "./config/db.config.js";

const PORT = parseInt(env.PORT, 10) || 8080;

const startServer = async ()=>{
await connectDB();

app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

  
startServer();