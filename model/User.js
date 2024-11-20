const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    min: 2,
    max: 255,
    required: false,
  },
  email: {
    type: String,
    unique: true,
    min: 2,
    max: 255,
    required: false,
  },
  password: {
    type: String,
    min: 6,
    max: 1024,
    required: false,
  },
  name: {
    type: String,
    min: 2,
    max: 255,
    required: false,
  },
  addressLine1: {
    type: String,
    max: 255,
    required: false,
  },
  addressLine2: {
    type: String,
    max: 255,
    required: false,
  },
  advisor: {
    type: String,
    max: 255,
    required: false,
  },
  anniversaryDate: {
    type: Date,
    required: false,
  },
  city: {
    type: String,
    max: 255,
    required: false,
  },
  coverPic: {
    type: String,
    max: 1024,
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  dateOfConsultation: {
    type: Date,
    required: false,
  },
  doNotCall: {
    type: Boolean,
    default: false,
    required: false,
  },
  emailOptOut: {
    type: Boolean,
    default: false,
    required: false,
  },
  fax: {
    type: String,
    max: 20,
    required: false,
  },
  firstName: {
    type: String,
    max: 255,
    required: false,
  },
  homePhone: {
    type: String,
    max: 20,
    required: false,
  },
  lastName: {
    type: String,
    max: 255,
    required: false,
  },
  leadSource: {
    type: String,
    max: 255,
    required: false,
  },
  leadSubType: {
    type: String,
    max: 255,
    required: false,
  },
  leadType: {
    type: String,
    max: 255,
    required: false,
  },
  mobile: {
    type: String,
    max: 20,
    required: false,
  },
  officePhone: {
    type: String,
    max: 20,
    required: false,
  },
  postalCode: {
    type: String,
    max: 20,
    required: false,
  },
  primaryEmail: {
    type: String,
    max: 255,
    required: false,
  },
  referredBy: {
    type: String,
    max: 255,
    required: false,
  },
  secondaryEmail: {
    type: String,
    max: 255,
    required: false,
  },
  state: {
    type: String,
    max: 255,
    required: false,
  },
  website: {
    type: String,
    max: 1024,
    required: false,
  },
  profilePic: {
    type: String,
    required: false,
  },
  uploadedFiles: {
    type: String,
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: false,
  },
  updated_at: {
    type: Date,
    default: Date.now,
    required: false,
  },
});

module.exports = mongoose.model('User', userSchema);
