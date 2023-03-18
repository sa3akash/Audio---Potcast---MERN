const Jimp = require('jimp');
const path = require('path');
const UserService = require("../services/userService");

class ActivateController {
    async activate(req, res){
        // activation logic for save in datebass
        const {name, avater} = req.body;

        if(!name || !avater){
            return res.status(400).json({message: "All feilds are res"})
        }
        
        // Image Base64 ke buffer convanrt and unwanted data to replace black string
        const buffer = Buffer.from(avater.replace(/^data:image\/(png|jpeg|jpg);base64,/,''),'base64');
        // install jimp package and read this file
        // set image path for jimp write
        const imageFileName = `podcast-sa3akash-${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
        // work jimp package and read this file
        try{
        const jimpResponse = await Jimp.read(buffer);
         // user upload a big image so resize image after database upload
         jimpResponse.resize(150, Jimp.AUTO).write(path.resolve(__dirname, `../storage/${imageFileName}`));

        }catch(err){
            return res.status(500).json({message: "Image not processed"})
        }

        // after image processing then update user activated feilds false to true
        try{
            const user = await UserService.findUser({_id: req.user._id});
            if(!user){
                return res.status(404).json({message: "User not found!"})
            }

            user.activated = true;
            user.name = name;
            user.avater = `/storage/${imageFileName}`;
            user.save();
            // response user
            return res.json({user, isAuth: true});

        }catch(err){
            return res.status(500).json({message: "Internal Server Error"})
        }

    }
}

module.exports = new ActivateController();