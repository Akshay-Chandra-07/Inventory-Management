const crypto = require("crypto-js");

exports.encrypt = (data) => {
  const encrypted_data = crypto.AES.encrypt(
    JSON.stringify(data),
    process.env.ENCRYPTION_KEY,
  );
  return encrypted_data.toString();
};

exports.decrypt = (cipher) => {
  const decrypted_bytes = crypto.AES.decrypt(
    cipher,
    process.env.ENCRYPTION_KEY,
  );
  const decrypted = decrypted_bytes.toString(crypto.enc.Utf8);
  return decrypted;
};
