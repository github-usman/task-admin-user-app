const {User}= require('../database');

exports.getData = async (req, res) => {
    try {
        const value = await User.find({}).limit(2);
        res.json(value);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};