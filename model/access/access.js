const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const Access = new Schema(
  {
    view: { type: Boolean, default: false },
    create: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    private: { type: Boolean, default: false },
    route: { type: String },
    routeId: { type: mongoose.Types.ObjectId, ref: "Routing" },
    roleId: { type: mongoose.Types.ObjectId, ref: "Role" },
    status: { type: String, default: "active" },
  },
  {
    timestamps: true,
    versionKey: false
  }
);
module.exports = mongoose.model("Access", Access);