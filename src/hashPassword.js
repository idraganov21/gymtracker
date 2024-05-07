const bcrypt = require('bcrypt');

async function generateHashedPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

// Replace 'your_password' with the actual password you want to hash
generateHashedPassword('Test123!').then(console.log);
