// MongoDB initialization script
db = db.getSiblingDB('career-guidance');

// Create collections
db.createCollection('users');
db.createCollection('assessmentresults');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.assessmentresults.createIndex({ "user": 1 });
db.assessmentresults.createIndex({ "completedAt": -1 });

print('Database initialized successfully');
