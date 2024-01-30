const express = require("express");
const cors = require("cors");
const db = require('./app/config/db'); // Import the database connection module
const Role = require('./app/models').role; // Import the Role model

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// Connect to MongoDB
try {
  db().then(() => {
    // Database connection is established, perform initialization or start the server
    initial();
    startServer();
  });
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1);
}

async function initial() {
  // Initialization tasks (e.g., role creation)
  try {
    const count = await Role.countDocuments();
    if (count === 0) {
      const roles = ['user', 'moderator', 'admin'];
      roles.forEach(async role => {
        try {
          await new Role({ name: role }).save();
          console.log(`Added '${role}' to roles collection`);
        } catch (error) {
          console.error(`Error creating '${role}' role:`, error);
        }
      });
    }
  } catch (error) {
    console.error("Error initializing roles:", error);
  }
}

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

function startServer() {
  // Start the Express server
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}
