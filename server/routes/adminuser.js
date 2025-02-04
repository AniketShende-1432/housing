const router = require("express").Router();
const User = require('../models/user');
const { verifyAdmin } = require('../middleware/authadmin');

router.get('/users',verifyAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);  // Return all users
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

router.delete('/users/:id',verifyAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete user' });
    }
  });

  router.get('/filterusers', async (req, res) => {
    try {
      const { type, search } = req.query; // Get the filter params from the query string
      let query = {}; // Initialize an empty query object
      if (type) {
        query.usertype = type;
      }
      // If 'search' is provided, filter by name or email using regex
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } }, // Search by name (case-insensitive)
          { email: { $regex: search, $options: 'i' } }, // Search by email (case-insensitive)
          { phone: { $regex: new RegExp(`^${search}`, 'i')} }, // Search by phone (case-insensitive)
        ];
      }
      // Find users based on the query filters
      const users = await User.find(query);
      // Return the filtered users as a response
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching filtered users:', error);
      res.status(500).json({ message: 'Error fetching filtered users' });
    }
  });

  router.put("/useredit", verifyAdmin, async (req, res) => {
      try {
          const { name, email, phone, usertype, _id } = req.body; // Extract data from the request body
          // Find the user by ID and update the document
          const updatedUser = await User.findByIdAndUpdate(
              _id, 
              { name, email, phone, usertype }, 
              { new: true } // This returns the updated document
          );
          if (!updatedUser) {
              return res.status(404).json({ message: "User not found" });
          }
          res.status(200).json(updatedUser); // Return the updated user data
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Server Error" });
      }
  });

module.exports = router;