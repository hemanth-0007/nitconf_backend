import User from "../models/User.js";

const getProfile = async (req, res) => {
  const user_id = req.user_id;
  try {
    const user = await User.findById(user_id);
    const { firstname, lastname, email } = user;
    const data = { firstname, lastname, email };
    res.send(data);
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  const user_id = req.user_id;
  const { firstname, lastname } = req.body;
  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(400).send({ message: "Bad Request User not found" });
    }
    user.firstname = firstname;
    user.lastname = lastname;
    await user.save();
    res.send({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

export { getProfile, updateProfile };
