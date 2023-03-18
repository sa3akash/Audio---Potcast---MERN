const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RefreshTokenModel = new Schema({
    token: {type: String},
    userId: {type: Schema.Types.ObjectId, ref: 'User'}
},{timeseries: true});


const Refresh = new mongoose.model('Refresh', RefreshTokenModel, 'tokens');

module.exports = Refresh;