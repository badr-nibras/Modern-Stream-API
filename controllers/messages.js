const Stream = require('../models/streaming')
const User = require('../models/user')



exports.pushMessage = async (socketId, message, sender) => {
    try {

        const result = await User.findOne({ _id: ObjectId(sender) });

        const item = {
            message: message,
            sender: sender,
        }

        await Stream.updateOne({ "socketId": socketId }, {
            "$push": {
                "chat": item
            }
        });
        return result.username;

    } catch (error) {
        console.log(error)

    }
}
