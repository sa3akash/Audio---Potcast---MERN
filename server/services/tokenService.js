const jwt = require("jsonwebtoken");
const Refresh = require("../model/refreshTokenModel")

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWI_ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
        });
        const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_TOKEN_SECRET,{
            expiresIn: "1y",
        }
        );
        return { accessToken, refreshToken };
    }

    async verifyAccessToken(accessToken){
        return jwt.verify(accessToken, process.env.JWI_ACCESS_TOKEN_SECRET);
     }
     
     async verifyRefreshToken(refreshToken){
        return jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
     }

     // refresh database
    async storeRefreshToken(token, userId){
        try{
            await Refresh.create({
                token: token,
                userId: userId
            })
        }catch(err){
            return res.status(500).json({message: err.message});
        }
    }

    async findRefreshToken(userId, refreshToken){
        return await Refresh.findOne({userId: userId, token: refreshToken})
    }

    async updateRefreshToken(id, refreshToken){
        return await Refresh.updateOne({userId: id}, {token: refreshToken})
    }

    async removeToken(refreshToken){
        return await Refresh.deleteOne({token: refreshToken})
    }

    
}

module.exports = new TokenService();
