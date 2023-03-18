const crypto = require('crypto');

class HashService {
    async hashOtp (data){
      return crypto.createHmac('sha256', process.env.CRYPTO_HASH_KEY).update(data).digest('hex');
    }
}



module.exports = new HashService();