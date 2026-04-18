// We have already setted up the dotenv in the db.js file , so we just need to import the connectDB function from db.js file and call it here to connect to the database.


import connectDB from "./db/db.js";
import { app } from "./app.js";





const port = process.env.PORT || 8000


connectDB()
.then(() => {
     app.listen( port , () => {
        console.log(`Server is running on port ${port}`);
     });
})
.catch((error) => {
    console.error("Failed to connect to the database", error);
});


