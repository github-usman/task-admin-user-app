const {User}= require('../database');

exports.getData = async (req, res) => {
    try {
        const value = await User.find({});
        res.json(value);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};