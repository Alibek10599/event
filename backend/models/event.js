const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    blockNumber: Number,
    from: String,
    to: String,
    amount: String,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
