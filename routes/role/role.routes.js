let router = require("express").Router();
let log = require("../../helper/logger");
let response = require("../../helper/response");
const services = require("../../controller/services");
const MESSAGE = require("../../helper/responseMessages");
const CONSTANT = require("../../helper/constant")
const _ = require("lodash");
const mongoose = require("mongoose");
const { debug } = require("request");
const Role = mongoose.model("role")







//get by id 


router.get("by/:id", async (req, res) => {
    log.debug("by/:id")
    const { id } = req.params
    try {

        const singleRole = await services.getOne(Role, { _id: id })
        response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.GET_BY_ID, singleRole)

    } catch (error) {
        log.error("by/:id", error)
        response.errorResponse(res, CONSTANT.INTERNAL_SERVER_ERROR_CODE, MESSAGE.ERROR_IN_GET, error.message)

    }
})



// delete by id 

router.delete("/deleteby/:id", async (req, res) => {
    log.debug("deleteby/:id")
    const { id } = req.params
    try {

        const single_role = await services.deleteByIdPer(Role, id)

        response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.DELETEBY_ID, single_role)
    } catch (error) {
        log.debug("deleteby/:id", error)

        response.errorResponse(res, CONSTANT.INTERNAL_SERVER_ERROR_CODE, MESSAGE.ERROR_IN_DELETE, error.message)
    }
})




///get all roll api
router.get("/", async (req, res) => {
    log.debug("role/rolelist")
    try {
        let { page, limit, search } = req.query
        const skip = (page - 1) * limit;

        let getAllSearch = { $or: [{ role: { $regex: '^' + search + '', $options: 'i' } }, { description: { $regex: '^' + search + '', $options: 'i' } }] }

        const allRoles = await services.getAllWithSortAndPagination(Role, getAllSearch, skip, limit * 1, { _id: -1 })

        const roleLength = await services.count(Role, getAllSearch)
        response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.GET_ALL_ROLES, { allRoles, count: roleLength })

    }
    catch (error) {
        log.debug("role/rolelist", error)

        response.errorResponse(res, CONSTANT.INTERNAL_SERVER_ERROR_CODE, MESSAGE.ERROR_IN_GET, error.message)
    }

});



// simple get role api

router.get("/roleList/list", async (req, res) => {

    try {
        const all_roles = await services.getAll(Role)

        response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.GET_ALL_ROLES, all_roles)

    } catch (error) {
        consolelog(error, "errorr>>")

        response.errorResponse(res, CONSTANT.INTERNAL_SERVER_ERROR_CODE, MESSAGE.ERROR_IN_GET, error.message)
    }

})



///update  role api


router.patch("/update/:id", async (req, res) => {
    log.debug("role/update/:id")
    const { id } = req.params


    try {
        const updateRole = await services.updateBy(Role, id, req.body)

        response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.UPDATE_ROLE, updateRole)

    } catch (error) {
        log.debug("role/update/:id", error)
        response.errorResponse(res, CONSTANT.INTERNAL_SERVER_ERROR_CODE, MESSAGE.DUPLICATE_ROLE, error.message)

    }

})




// post api role

router.post('/add', async (req, res) => {
    log.debug("role/add")
    const { role, description, createdBy, updatedBy } = req.body;
    try {
        const roleData = await Role.create({
            role: role,
            description: description,
            createdBy: createdBy,
            updatedBy: updatedBy
        })

        response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.GET_ALL_ROLES, roleData)
    } catch (error) {
        log.debug("role/add", error)
        response.errorResponse(res, CONSTANT.BAD_REQUEST_ERROR_CODE, MESSAGE.DUPLICATE_ROLE, error.message)
    }


})


// delete all by id in array

router.delete("/deleteMany", async (req, res) => {
    log.debug("role/deleteMany")
    const { id } = req.body;

    try {

        const ids = await services.deleteMany(Role, id)

        response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.GET_ALL_ROLES, ids)

    } catch (error) {
        log.debug("role/deleteMany", error)
        response.errorResponse(res, CONSTANT.INTERNAL_SERVER_ERROR_CODE, MESSAGE.MULTIPLE_ERROR, error.message)
    }

})


router.get("/getRoleNames", async (req, res) => {
    log.debug("/role/getRoleNames");
    try {
        let result = await services.getAllBySelect(Role, "role")
        response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.ROLE_NAMES_SUCCESS, result);
    } catch (error) {
        log.error("/role/getRoleNames/error", error);
        response.errorResponse(res, CONSTANT.INTERNAL_SERVER_ERROR_CODE, MESSAGE.ROLE_NAMES_FAIL, error)
    }
})

module.exports = router