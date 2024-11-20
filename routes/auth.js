const router = require('express').Router()
const express = require('express')
const User = require('../model/User.js')
const fs = require("fs");
const path = require('path');
const multer = require("multer");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Ensure the uploads directory exists
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload2 = multer({ storage }).array('files', 2);
// Serve static files from the uploads directory
router.use('/files', express.static(uploadPath));

router.get("/get-files", async (req, res) => {
  try {
    const data = await Vehicle.find({});
    res.send({ status: "ok", data: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.cookies['auth-token'];
  if (!token) return res.status(401).json({ error: 'Access Denied' });

  try {
    const verified = jwt.verify(token, 'secretkey');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid Token' });
  }
};

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Username already exists' });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      name,
    });

    // Save user to the database
    const savedUser = await newUser.save();

    // Create and assign a token
    const token = jwt.sign({ _id: savedUser._id }, 'secretkey', { expiresIn: '1h' });
    res.cookie('auth-token', token, { httpOnly: true, secure: true, sameSite: 'Strict' }).status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, 'secretkey', { expiresIn: '1h' });
    res.cookie('auth-token', token, { httpOnly: true, secure: true, sameSite: 'Strict' }).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// New User Registration with Full Schema
router.post('/user_register', verifyToken, upload2, async (req, res) => {
  console.log("INFORMATION_FILES  ===> ", req.files);
  console.log("INFORMATION_body  ===> ", req.body);

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username: req.body.username });

    const userData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      advisor: req.body.advisor,
      anniversaryDate: req.body.anniversaryDate === "null" ? null : req.body.anniversaryDate,
      city: req.body.city,
      coverPic: req.body.coverPic,
      dateOfBirth: req.body.dateOfBirth === "null" ? null : req.body.dateOfBirth,
      dateOfConsultation: req.body.dateOfConsultation === "null" ? null : req.body.dateOfConsultation,
      doNotCall: req.body.doNotCall === 'true',
      emailOptOut: req.body.emailOptOut === 'true',
      fax: req.body.fax,
      firstName: req.body.firstName,
      homePhone: req.body.homePhone,
      lastName: req.body.lastName,
      leadSource: req.body.leadSource,
      leadSubType: req.body.leadSubType,
      leadType: req.body.leadType,
      mobile: req.body.mobile,
      officePhone: req.body.officePhone,
      postalCode: req.body.postalCode,
      primaryEmail: req.body.primaryEmail,
      referredBy: req.body.referredBy,
      secondaryEmail: req.body.secondaryEmail,
      state: req.body.state,
      website: req.body.website,
    };

    // Assign filenames to the respective fields
    const fileFields = [
      'profilePic',
      'uploadedFiles'
    ];

    req.files.forEach((file, index) => {
      userData[fileFields[index]] = file.filename;
    });

    // Hash the password if it's being updated
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    if (existingUser) {
      // Update existing user
      await User.updateOne({ username: req.body.username }, userData);
      res.send({ status: 'User updated successfully' });
      console.log("User updated successfully", userData);
    } else {
      // Create new user
      await User.create(userData);
      res.send({ status: 'User created successfully' });
      console.log("User created successfully", userData);
    }
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ status: error.message });
  }
});

// GET route to retrieve all users
router.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// route to serve image files
router.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(uploadPath, req.params.filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }
    res.sendFile(filePath);
  });
});

// DELETE route to delete a user by ID
router.delete('/users/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;