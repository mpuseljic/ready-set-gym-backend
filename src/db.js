import mongo from "mongodb";

let connection_string =
  "mongodb+srv://mpuseljic:mirna123@cluster0.tjbw8it.mongodb.net/?retryWrites=true&w=majority";

let client = new mongo.MongoClient(connection_string);

let db = null;

export default () => {
  return new Promise((resolve, reject) => {
    if (db && client.isConnected()) {
      resolve(db);
    } else {
      client.connect((err) => {
        if (err) {
          reject("Spajanje na bazu nije uspjelo:" + err);
        } else {
          console.log("Database connected successfully!");
          db = client.db("readySetGymDB");
          resolve(db);
        }
      });
    }
  });
};
