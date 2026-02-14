const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Assigned', 'In Progress', 'Completed'],
        default: 'Assigned'
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
