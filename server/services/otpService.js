const crypto = require('crypto');
const HashService = require('./hashService')

// setup twilio for send otp from mobile number
const smsSid = process.env.SMS_SID;
const smsToken = process.env.SMS_TOKEN;
const twilio = require('twilio')(smsSid,smsToken, {
    lazyLoading: true
});

class OtpService {
    async generateOtp(){
        const otp = crypto.randomInt(1000, 9999);
        return otp;
    }

    async sendOtpBySms(phone, otp){
        return await twilio.messages.create({
            to: phone,
            from : process.env.SMS_NUMBER,
            body: `Your Podcast verification code is ${otp}`
        })
    }

    async verifyOtp(hashOtp, data){
        const compareHash = await HashService.hashOtp(data);
        // otp is valid then return true otherwise return false
        return compareHash === hashOtp;
    }

}


module.exports = new OtpService();