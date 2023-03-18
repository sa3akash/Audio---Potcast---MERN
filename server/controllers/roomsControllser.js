const RoomService = require("../services/roomService");


class RoomsController {
    async create(req, res){
        const {createTopic, typeRoom} = req.body;

        if(!createTopic || !typeRoom){
            return res.status(400).json({message: "All fields are required!"})
        }
        // create a new room 
        const room = await RoomService.create({
            topic: createTopic,
            roomType: typeRoom,
            ownerId: req.user._id
        })
        return res.status(200).json(room);
    }


    async getAllRooms(req, res){
        const rooms = await RoomService.getRooms(['public']);
        return res.json(rooms)
    }


    async getRoom(req, res){

        const {roomId} = req.params;
        const room = await RoomService.getRoomById(roomId);
        return res.json(room)
    }
}


module.exports = new RoomsController();