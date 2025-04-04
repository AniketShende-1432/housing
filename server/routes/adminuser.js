const router = require("express").Router();
const User = require('../models/user');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
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

  router.get('/export-userexcel', verifyAdmin, async (req, res) => {
    try {
        const users = await User.find(); // Fetch data from MongoDB
        const data = users.map((user,index) => ({
            ID: index+1,
            Name: user.name,
            Email: user.email,
            Phone_Number: user.phone,
            User_Type: user.usertype,
        }));
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        // Set headers for Excel file download
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", 'attachment; filename="users.xlsx"');
        // Send the file to the client
        res.send(excelBuffer);
    } catch (error) {
        console.error("Error exporting data:", error);
        res.status(500).json({ message: "Failed to export data" });
    }
});

router.put("/:id/add-coins", verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { coin } = req.body;
        const user = await User.findByIdAndUpdate(
            id,
            { $inc: { coins: coin } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;