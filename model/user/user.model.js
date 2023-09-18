// const mongoose = require("mongoose"),
//   Schema = mongoose.Schema;

// const User = new Schema({
//   designation: {
//     type: String,
//     enum: [
//       "Super Admin",
//       "Admin",
//       "User",
//     ],
//   },
//   firstName: String,
//   lastName: String,
//   deviceToken: String,
//   email: String,
//   mobileNumber: String,
//   location: {
//     address: String,
//     landmark: String,
//     state: String,
//     city: String,
//     pincode: Number,
//     country: String,
//     lat: {
//       type: String,
//     },
//     lng: {
//       type: String,
//     },
//   },
//   avatar: String,
//   loginType: {
//     type: String,
//     enum: ["Google", "Facebook", "Password", "OTP"],
//     default: "Password",
//     required: true,
//   },
//   password: String,
//   wallet: Number,
//   username: String,
//   status: {
//     type: String,
//     default: "active",
//   },
//   encryptedEmail: String,
//   gender: {
//     type: String,
//     enum: ["Male", "Female"],
//   },
//   dob: String,
//   isMobileVerified: {
//     type: String,
//     enum: ["Not", "Verified"],
//     default: "Not",
//   },
//   isEmailVerified: {
//     type: String,
//     enum: ["Not", "Verified"],
//     default: "Not",
//   },
//   otp: {
//     type: String,
//   },
//   customerId: {
//     type: String,
//   },
// }, {
//   timestamps: true,
//   versionKey: false
// });
// module.exports = mongoose.model("User", User);






const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },

  lastName: { type: String, required: true },

  middleName: { type: String, },

  age: { type: Number, required: true },

  address: { type: String },

  phoneNumber: { type: Number, required: true },

  gender: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  role: { type: String, required: true },

  createdBy: { type: String },

  updatedBy: { type: String },

  password: { type: String },

  city: { type: String },

  currentPassword: { type: String },
  userId: { type: String }
  // firstName: {
  //   type: String,
  //   required: true
  // },
  // lastName: {
  //   type: String,
  //   required: true
  // },
  // middleName: {
  //   type: String,

  // },
  // age: {
  //   type: Number, required: true
  // },
  // address: {
  //   type: String
  // },
  // phone: {
  //   type: Number,
  //   required: true
  // },
  // gender: {
  //   type: String,
  //   required: true
  // },
  // email: {
  //   type: String,
  //   required: true,
  //   unique: true
  // },
  // userName: {
  //   type: String,
  //   required: true
  // },
  // role: {
  //   type: String,
  //   required: true
  // },
  // createdBy: {
  //   type: String
  // },
  // updatedBy: {
  //   type: String
  // },
  // password: {
  //   type: String
  // }
}, { timestamps: true })

const user = mongoose.model("user", userSchema);

module.exports = user