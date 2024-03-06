db.createUser({
    user: 'trainer',
    pwd: '3333',
    roles: [
      {
        role: 'readWrite',
        db: 'trainingsApp_Mongo_DB',
      },
    ],
  });
  
  db = new Mongo().getDB('trainingsApp_Mongo_DB');
  
  db.createCollection('chats');
  db.chats.insert({ initialized: true });
  db.createCollection('videos');
  db.videos.insert({ initialized: true });
  