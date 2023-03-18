const Room = require("../model/roomModel");

class RoomService {
    async create(payload){
        const {topic, roomType, ownerId} = payload;
        const room = await Room.create({
            topic,
            roomType,
            ownerId,
            speakers: [ownerId]
        })
        return room;
    }

    async getRooms(types) {
        const rooms = await Room.find({roomType: {$in: types}}).populate('speakers').exec();

        return rooms;
    }
    async getRoomById(roomId) {
        const getRoom = await Room.findById(roomId).populate('speakers').exec();
        return getRoom;
    }
}

module.exports = new RoomService();