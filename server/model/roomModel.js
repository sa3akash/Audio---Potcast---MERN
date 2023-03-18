const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RoomModel = new Schema({
    topic: {type: String, required: true},
    roomType: {type: String, required: true},
    ownerId: {type: Schema.Types.ObjectId, ref: 'User'},
    speakers: [
        {type: Schema.Types.ObjectId, ref: 'User'},
    ]
},{timeseries: true});


module.exports = new mongoose.model('Room', RoomModel, 'rooms');