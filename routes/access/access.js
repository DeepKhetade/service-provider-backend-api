let router = require("express").Router();
let log = require("../../helper/logger");
let response = require("../../helper/response");
const services = require("../../controller/services");
const MESSAGE = require("../../helper/responseMessages");
const CONSTANT = require("../../helper/constant")
const mongoose = require("mongoose");
const Access = mongoose.model("Access");

router.post("/add", async (req, res) => {
  log.debug("access/add");
  try {
    let data = req.body;
    let result = await services.add(Access, data);
    response.successResponse(res, CONSTANT.CREATED_STATUS_CODE, MESSAGE.ACCESS_ADD_SUCCESS, result);
  } catch (error) {
    log.error("/routing/add/error", error);
    response.errorResponse(res, CONSTANT.BAD_REQUEST_ERROR_CODE, MESSAGE.ACCESS_ADD_FAIL, error);
  }
});

router.get("/getBy/role", async (req, res) => {
  log.debug("/access/getAll");
  try {
    let result = await services.getAll(Access);
    response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.ACCESS_GETALL_SUCCESS, result);
  } catch (error) {
    log.error("/access/getAll/error", error)
    response.errorResponse(res, CONSTANT.BAD_REQUEST_ERROR_CODE, MESSAGE.ACCESS_GETALL_FAIL, error);
  }
})

router.get("/getBy/role/:id", async (req, res) => {
  log.debug("/access/getAll");
  try {
    let { page, limit } = req.query;
    limit = limit ? parseInt(limit) : 4;
    page = page ? parseInt(page) : 1;
    let skip = (page - 1) * limit;
    let { id } = req.params;
    let result = await Access.find({
      roleId: id,
      status: {
        $ne: CONSTANT.DELETED
      }
    }).skip(skip).limit(limit)

    let count = await Access.countDocuments({
      roleId: id,
      status: {
        $ne: CONSTANT.DELETED
      }
    });
    const resultResponse = {
      [id]: {
        data: result,
        total: count,
        page: page,
        limit: limit,
        noPages: Math.ceil(count / limit)
      }
    }
    response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.ACCESS_GETALL_SUCCESS, resultResponse);
  } catch (error) {
    log.error("/access/getAll/error", error)
    response.errorResponse(res, CONSTANT.BAD_REQUEST_ERROR_CODE, MESSAGE.ACCESS_GETALL_FAIL, error);
  }
});

router.put("/updateBy/:id", async (req, res) => {
  log.debug("/access/updateBy");
  try {
    let id = req.params.id;
    let data;
    let prevData = await services.getOne(Access, { _id: id });

    if ((req.body.create || req.body.private || req.body.edit) === true) {
      data = {
        view: true,
        create: req.body.create ? req.body.create : prevData.create,
        edit: req.body.edit ? req.body.edit : prevData.edit,
        private: req.body.private ? req.body.private : prevData.private,
      };
    } else {
      data = req.body;
    }
    const result = await services.updateBy(Access, id, data);
    response.successResponse(
      res,
      CONSTANT.SUCCESS_STATUS_CODE,
      MESSAGE.ACCESS_UPDATE_SUCCESS,
      result
    );
  } catch (error) {
    log.error("/access/updateBy/error", error);
    response.errorResponse(
      res,
      CONSTANT.BAD_REQUEST_ERROR_CODE,
      MESSAGE.ACCESS_UPDATE_FAIL,
      error
    );
  }
});

module.exports = router