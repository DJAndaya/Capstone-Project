require("dotenv").config();
const app = require('./app')

app.listen(3000, () => {
  console.log(`Listening on port 3000...`);
});

module.exports = app;
