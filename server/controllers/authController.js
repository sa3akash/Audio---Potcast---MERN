const OtpService = require("../services/otpService");
const HashService = require("../services/hashService");
const UserService = require("../services/userService");
const TokenService = require("../services/tokenService");

class AuthController {
    // send otp from mobile number
    async sendOtp(req, res){
        const {phone} = req.body;

        if(!phone){
            return  res.status(400).json({message: "Phone field is required"})
        }
        // generateOtp from otpService file
        const otp = await OtpService.generateOtp();
        // generate hash data
        const ttl = 1000 * 60 * 2;
        const expires = Date.now() + ttl;

        const data = `${phone}.${otp}.${expires}`;
        // hash otp from hashService
        const hashOtp = await HashService.hashOtp(data)

        // send otp for mobile number
        try{
            //await OtpService.sendOtpBySms(phone, otp);
            return res.status(200).json({
                hash: `${hashOtp}.${expires}`,
                phone: phone,
                otp: otp
            })
        }catch(err){
            return res.status(500).json({message: "Message sending failed", err})
        }

    }

    // verifyOtp controller start
    async verifyOtp(req, res){
        const {hash, otp, phone} = req.body;

        if(!hash || !otp || !phone){
            return res.status(404).json({message: "All field are required"});
        }
 
        // spilit hash and expires
        const [hashOtp, expires] = hash.split('.');

        // otp expires or not
        if(Date.now() > +expires){
            return res.status(404).json({message: "Your otp is expired"});
        }

        // hash data isvalid or not
        const data = `${phone}.${otp}.${expires}`;
        const isValid = await OtpService.verifyOtp(hashOtp, data);

        if(!isValid){
            console.log(isValid)
            return res.status(404).json({message: "Invalid OTP"});
        }

        // create a new user
        let user;

        try{
            user = await UserService.findUser({phone});

            if(!user){
               user = await UserService.createUser({phone});
            }

         }catch(err){
            return res.status(404).json({message: "DB Error"});
         }


        // access token and refresh token generate for user
        const {accessToken, refreshToken} = TokenService.generateTokens({
            _id: user._id, activated: user.activated
        });


         // refresh token save in database
        await TokenService.storeRefreshToken(refreshToken, user._id)



      
      // refresh token sav for cookie
      res.cookie('refreshToken', refreshToken,{
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
      })
      res.cookie('accessToken', accessToken,{
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
      })


      res.status(200).json({user, isAuth: true});

    }

    // auto refresh and user still login in browser
    async refresh (req, res) {
        // get refresh token from cookie
        const { refreshToken: refreshTokenFromCookie } = req.cookies;

        // check refresh token is valid 
        let userData;
        try{
            userData = await TokenService.verifyRefreshToken(refreshTokenFromCookie);
        }catch(err){
            return res.status(401).json({message: "invalid token"});
        }

        // check refresh token in database

        try{
            const token = await TokenService.findRefreshToken(userData._id, refreshTokenFromCookie)
            
            if(!token){
                return res.status(401).json({message: "invalid token"});
            }

        }catch(err){
            return res.status(500).json({message: "internalError"})
        }

        // check if valid user in database

        const user = await UserService.findUser({_id: userData._id})
  
        if(!user){
            return res.status(404).json({message: "No user found!"})
        }

        // genarate refreshToken and accessToken auto

        const {refreshToken, accessToken} = TokenService.generateTokens({_id: user._id, activated: user.activated})

        // update refreshToken in database

        try{

            await TokenService.updateRefreshToken(user._id, refreshToken)

        }catch(err){
            return res.status(500).json({message: "internalError!"})
        }

        // then put token in cookie

           // refresh token sav for cookie
        res.cookie('refreshToken', refreshToken,{
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })
        res.cookie('accessToken', accessToken,{
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        })

     // response user

      res.status(200).json({user, isAuth: true});
      
    }


    async logout (req, res) {

        const {refreshToken} = req.cookies;
        // delete refresh token from database

        await TokenService.removeToken(refreshToken)

        // delete refresh token from cookie
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');


        res.status(200).json({user: null, isAuth: false});

    }


}


module.exports = new AuthController();