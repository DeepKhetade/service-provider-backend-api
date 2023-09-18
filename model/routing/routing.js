const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const Routing = new Schema(
  {
    routingName: { type: String },
    routingPath: { type: String },
    routingComponent: { type: String },
    // parentNode: { type: mongoose.Types.ObjectId, ref: "Routing" },
    // childNode: { type: mongoose.Types.ObjectId, ref: "Routing" },
    icon: { type: String },
    // type: { type: String, enum: ["parent", "child", "subchild"], default: "parent" },
    level1: String,
    level2: String,
    level3: String,
    status: { type: String, default: "active" },
  },
  {
    timestamps: true,
    versionKey: false
  }
);
module.exports = mongoose.model("Routing", Routing);