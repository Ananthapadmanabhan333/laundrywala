const { MongoMemoryServer } = require('mongodb-memory-server');

async function startServer() {
  console.log('📡 Starting in-memory MongoDB server on port 27017...');
  try {
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: 'laundrywala',
      },
      binary: {
        version: '6.0.14',
      }
    });

    const uri = mongod.getUri();
    console.log(`\n=========================================`);
    console.log(`✅ MongoDB is running locally at:`);
    console.log(`   ${uri}`);
    console.log(`=========================================\n`);
    console.log('👉 Keep this process running while developing.');
    
    // Keep process alive
    process.on('SIGINT', async () => {
      console.log('📴 Stopping MongoDB server...');
      await mongod.stop();
      process.exit(0);
    });
  } catch (err) {
    console.error('❌ Failed to create MongoMemoryServer instance:', err);
    process.exit(1);
  }
}

startServer().catch(err => {
  console.error('❌ Failed to start MongoDB server:', err);
  process.exit(1);
});
