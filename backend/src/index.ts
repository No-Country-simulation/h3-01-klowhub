import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import sequelize from "./config/database";

const PORT = process.env.PORT || 3000;

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
