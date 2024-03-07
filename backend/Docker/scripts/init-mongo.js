db.createUser({
  user: "trainer",
  pwd: "3333",
  roles: [
    {
      role: "readWrite",
      db: "trainingsApp_Mongo_DB",
    },
  ],
});

db = new Mongo().getDB("trainingsApp_Mongo_DB");

db.createCollection("chats");
db.createCollection("messages");

db.runCommand({
  collMod: "messages",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["timestamp", "content", "sender", "chat_id"],
      properties: {
        content: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        sender: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        timestamp: {
          bsonType: "date",
          description: "must be a date and is required",
        },
        chat_id: {
          bsonType: "objectId",
          description: "must be an ObjectID and is required",
        },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});

db.runCommand({
  collMod: "chats",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user1", "user2"],
      properties: {
        user1: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        user2: {
          bsonType: "string",
          description: "must be a string and is required",
        },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});
