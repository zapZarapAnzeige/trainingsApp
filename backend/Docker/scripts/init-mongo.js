(function() {
db.runCommand({createUser: "trainer", pwd:"3333", roles: [
  {
    role: "readWrite",
    db: "trainingsApp_Mongo_DB",
  },
],})

db=  new Mongo().getDB("trainingsApp_Mongo_DB");

db.createCollection ("chats");

db.createCollection ("messages");

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
          bsonType: "int",
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
      required: [
        "participants",
        "unread_messages",
        "last_message_content",
        "last_message_timestamp",
        "last_sender_id",
      ],
      properties: {
        participants: {
          bsonType: "array",
          description: "must be a string and is required",
        },
        unread_messages: {
          bsonType: "int",
        },
        last_message_content: {
          bsonType: "string",
        },
        last_sender_id: {
          bsonType: "int",
        },
        last_message_timestamp: {
          bsonType: "date",
        },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});
})();
