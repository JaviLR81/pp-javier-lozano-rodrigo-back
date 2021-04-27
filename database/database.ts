import mongoose from "mongoose";

(async () => {
  const db = await mongoose.connect("mongodb://localhost/dbUsers", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
  console.log("Database is connected to", db.connection.name);
})();



