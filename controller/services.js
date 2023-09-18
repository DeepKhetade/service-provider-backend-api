const CONSTANT = require("../helper/constant")

module.exports = {

  add: (schema, data) => {
    return new Promise(function (resolve, reject) {
      var addSchema = new schema(data);
      addSchema
        .save()
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error : ", error);
          reject(error);
        });
    });
  },

  getAll: (schema) => {
    return new Promise(function (resolve, reject) {
      schema
        .find({
          status: {
            $ne: CONSTANT.DELETED
          }
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error :", error);
          reject(error);
        });
    });
  },

  getAllBySelect: (schema, select) => {
    return new Promise(function (resolve, reject) {
      schema
        .find({
          status: {
            $ne: CONSTANT.DELETED
          }
        }).select(select)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error :", error);
          reject(error);
        });
    });
  },

  getOne: (schema, object) => {
    return new Promise(function (resolve, reject) {
      schema
        .findOne({
          ...object,
          status: {
            $ne: CONSTANT.DELETED
          }
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getOneBySelect: (schema, object, select) => {
    return new Promise(function (resolve, reject) {
      schema
        .findOne({
          ...object,
          status: {
            $ne: CONSTANT.DELETED
          }
        }).select(select)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getAllSortReverse: (schema) => {
    return new Promise(function (resolve, reject) {
      schema
        .find({
          status: {
            $ne: CONSTANT.DELETED
          }
        })
        .sort({
          _id: -1
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error :", error);
          reject(error);
        });
    });
  },

  getBy: (schema, object) => {
    return new Promise(function (resolve, reject) {
      schema
        .find({
          ...object,
          status: {
            $ne: CONSTANT.DELETED
          }
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getBySortReverse: (schema, object) => {
    return new Promise(function (resolve, reject) {
      schema
        .find({
          ...object,
          status: {
            $ne: CONSTANT.DELETED
          }
        })
        .sort({
          _id: -1
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getAllWithPagination: (schema, skip, limit) => {
    return new Promise(function (resolve, reject) {
      schema
        .find({
          status: {
            $ne: CONSTANT.DELETED
          }
        }).skip(skip).limit(limit)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getAllWithSortAndPagination: (schema, object, skip, limit, sort) => {
    return new Promise(function (resolve, reject) {
      schema
        .find({
          ...object,
          status: {
            $ne: CONSTANT.DELETED
          }
        }).skip(skip).limit(limit).sort({ ...sort })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  updateBy: (schema, id, data) => {
    return new Promise(function (resolve, reject) {
      schema
        .findByIdAndUpdate({
          _id: id
        }, data, {
          $new: true
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  updateWithObject: (schema, object, data) => {
    return new Promise(function (resolve, reject) {
      schema
        .findOneAndUpdate(object, data, {
          $new: true
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error :", error);
          reject(error);
        });
    });
  },

  deleteById: (schema, id) => {
    return new Promise(function (resolve, reject) {
      schema
        .findByIdAndUpdate({
          _id: id
        }, {
          status: CONSTANT.DELETED
        }, {
          $new: true
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error : ", error);
          reject(error);
        });
    });
  },

  deleteMany: (schema, data) => {
    return new Promise(function (resolve, reject) {
      schema
        .updateMany(
          { ...data },
          { $set: { status: CONSTANT.DELETED } },
          { $multi: true }
        )
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error : ", error);
          reject(error);
        });
    });
  },


  getWithSortBy: (schema, object, sort) => {
    return new Promise(function (resolve, reject) {
      schema
        .find({
          ...object,
          status: {
            $ne: CONSTANT.DELETED
          }
        })
        .sort(sort)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  getWithSortByPopulate: (schema, populates) => {
    return new Promise(function (resolve, reject) {
      schema
        .find({})
        .populate(populates)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  getWithReverseSortByPopulate: (schema, populates) => {
    console.log("object");
    return new Promise(function (resolve, reject) {
      schema
        .find({})
        .populate(populates)
        .sort({
          _id: -1
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  getSingleRecordByPopulate: (schema, object, populates) => {
    console.log("object");
    return new Promise(function (resolve, reject) {
      schema
        .findOne(object)
        .populate(populates)
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  count: (schema, object) => {
    return new Promise(function (resolve, reject) {
      schema
        .countDocuments({
          ...object,
          status: {
            $ne: CONSTANT.DELETED
          }
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },

  deletePRM: (schema, object) => {
    return new Promise(function (resolve, reject) {
      schema
        .findOneAndDelete({
          ...object,
        })
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  },


  deleteByIdPer: (schema, id) => {
    return new Promise(function (resolve, reject) {
      schema
        .findOneAndDelete({
          _id: id
        }
          // {
          //   status: CONSTANT.DELETED
          // }, {
          //   $new: true
          // }
        )
        .then((resData) => {
          resolve(resData);
        })
        .catch((error) => {
          console.log("error : ", error);
          reject(error);
        });
    });
  }

};




