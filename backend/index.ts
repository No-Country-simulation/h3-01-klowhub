import dotenv from "dotenv";
dotenv.config();
//
import app from "./src/app";
import sequelize from "./src/config/database";

const PORT = process.env.PORT || 3001;

sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });