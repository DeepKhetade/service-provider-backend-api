let router = require("express").Router();
let log = require("../../helper/logger");
let response = require("../../helper/response");
const services = require("../../controller/services");
const MESSAGE = require("../../helper/responseMessages");
const CONSTANT = require("../../helper/constant")
const mongoose = require("mongoose");
const Routing = mongoose.model("Routing");
const Role = mongoose.model("role");
const Access = mongoose.model("Access");

router.post("/add", async (req, res) => {
  log.debug("/routing/add");
  try {
    let { routingName, routingPath, routingComponent, icon } = req.body;

    let payload = {
      routingName, routingPath, routingComponent, icon
    }

    let paths = routingPath.split("/");

    paths = paths.filter(item => item !== "")

    for (let i = 0; i <= paths.length; i++) {
      let temp = 'level' + (i + 1)
      payload[temp] = paths[i];
    }

    let result = await services.add(Routing, payload);
    if (result) {
      let roleData = await services.getAllBySelect(Role, "_id role")
      roleData.map(async (ele) => {
        await services.add(Access, {
          route: routingName,
          routeId: result._id,
          roleId: ele._id
        })
      })
    }
    response.successResponse(res, CONSTANT.CREATED_STATUS_CODE, MESSAGE.ROUTING_ADD_SUCCESS, result);
  } catch (error) {
    log.error("/routing/add/error", error);
    response.errorResponse(res, CONSTANT.BAD_REQUEST_ERROR_CODE, MESSAGE.ROUTING_ADD_FAIL, error);
  }
});

router.get("/getAll", async (req, res) => {
  log.debug("/routing/getAll");
  try {
    let result = await services.getAll(Routing);
    response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.ROUTING_GETALL_SUCCESS, result);
  } catch (error) {
    log.error("/routing/getAll/error", error);
    response.errorResponse(res, CONSTANT.BAD_REQUEST_ERROR_CODE, MESSAGE.ROUTING_GETALL_FAIL, error);
  }
})

router.get("/getBy/:id", async (req, res) => {
  log.debug("/routing/getBy");
  try {
    let id = req.params.id;
    const result = await services.getOne(Routing, { _id: id });
    response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.ROUTING_GETBY_SUCCESS, result);
  } catch (error) {
    log.error("/routing/getBy/error", error);
    response.errorResponse(res, CONSTANT.BAD_REQUEST_ERROR_CODE, MESSAGE.ROUTING_GETBY_FAIL, error);
  }
});

router.delete("/delete/:id", async (req, res) => {
  log.debug("/routing/delete");
  try {
    let id = req.params.id;
    const result = await services.deleteById(Routing, id);
    if (result) {
      await services.deleteMany(Access, { routeId: id })
    }
    response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.ROUTING_DELETE_SUCCESS, result);
  } catch (error) {
    log.error("/routing/delete/error", error);
    response.errorResponse(res, CONSTANT.BAD_REQUEST_ERROR_CODE, MESSAGE.ROUTING_DELETE_FAIL, error);
  }
});

router.put("/updateBy/:id", async (req, res) => {
  log.debug("/routing/updateBy");
  try {
    let id = req.params.id;
    let data = req.body;
    const result = await services.updateBy(Routing, id, data);
    response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.ROUTING_UPDATE_SUCCESS, result);
  } catch (error) {
    log.error("/routing/updateBy/error", error);
    response.errorResponse(res, CONSTANT.BAD_REQUEST_ERROR_CODE, MESSAGE.ROUTING_UPDATE_FAIL, error);
  }
});


router.get("/parentNode", async (req, res) => {
  log.debug("/routing/parentNode");
  try {
    const result = await services.getBy(Routing, { type: "parent" });
    response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.ROUTING_GET_PARENT_NODE_SUCCESS, result);
  } catch (error) {
    log.error("/routing/parentNode/error", error);
    response.successResponse(res, CONSTANT.BAD_REQUEST_ERROR_CODE, MESSAGE.ROUTING_GET_PARENT_NODE_FAIL, error);
  }
})

router.get("/childNode/:parentNode", async (req, res) => {
  log.debug("/routing/childNode/:parentNode");
  try {
    const { parentNode } = req.params;
    const result = await services.getBy(Routing, { parentNode });
    response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.ROUTING_GET_CHILD_NODE_SUCCESS, result);
  } catch (error) {
    log.error("/routing/childNode/:parentNode/error", error);
    response.successResponse(res, CONSTANT.BAD_REQUEST_ERROR_CODE, MESSAGE.ROUTING_GET_CHILD_NODE_FAIL, error);
  }
})

router.get("/getForsideMenu", async (req, res) => {
  log.debug("/routing/getForsideMenu");
  try {
    // let resultData = await Routing.find({ type: "subchild" }).populate({
    //   path: "childNode",
    //   model: "Routing",
    //   populate: {
    //     path: "parentNode",
    //     model: "Routing"
    //   }
    // });


    // const parent = await Routing.find({ type: "parent", status: "active" })
    // const child = await Routing.find({ type: "child", status: "active" })
    // const subchild = await Routing.find({ type: "subchild", status: "active" })

    // const result = []

    // for (const i of parent) {
    //   let parentData = {
    //     path: null,
    //     iconName: i.icon,
    //     name: i.routingName
    //   }
    //   if (i.routingPath) {
    //     parentData["path"] = i.routingPath
    //   }
    //   let childData = [];
    //   for (const j of child) {
    //     if (j.parentNode.toString() === i._id.toString()) {
    //       let childSubData = {
    //         path: "/app" + j.routingPath,
    //         iconName: j.icon,
    //         name: j.routingName
    //       }

    //       let subchilddata = [];
    //       for (const k of subchild) {
    //         if (k.childNode.toString() === j._id.toString()) {
    //           let subchildSubData = {
    //             path: "/app" + k.routingPath,
    //             iconName: k.icon,
    //             name: k.routingName
    //           }
    //           subchilddata.push(subchildSubData)
    //         }
    //       }
    //       if (subchilddata.length > 0) {
    //         childSubData['submenu'] = subchilddata;
    //       }
    //       childData.push(childSubData)
    //     }
    //   }
    //   if (childData.length > 0) {
    //     parentData["submenu"] = childData;
    //   }
    //   result.push(parentData)
    // }

    // const data = await Routing.find({ status: "active" });
    const data = await services.getAll(Routing, { status: "active" });

    const parents = [];
    const childs = [];
    const subChilds = [];

    for (const item of data) {
      if (item.level1) {
        if (parents.filter(ele => ele.level1 === item.level1).length === 0) {
          parents.push({
            path: "/app" + item.routingPath,
            iconName: item.icon,
            name: item.routingName,
            level1: item.level1
          });
        }
      }
      if (item.level2) {
        if (childs.filter(ele => ele.level2 === item.level2).length === 0) {
          childs.push({
            path: "/app" + item.routingPath,
            iconName: item.icon,
            name: item.routingName,
            level1: item.level1,
            level2: item.level2
          });
        }
      }
      if (item.level3) {
        if (subChilds.filter(ele => ele.level3 === item.level3).length === 0) {
          subChilds.push({
            path: "/app" + item.routingPath,
            iconName: item.icon,
            name: item.routingName,
            level1: item.level1,
            level2: item.level2,
            level3: item.level3
          })
        }
      }
    }


    let result = []
    for (const level1 of parents) {
      let level1_payload = {
        path: level1.path,
        iconName: level1.iconName,
      }
      let level2_arr = [];
      for (const level2 of childs) {
        if (level1.level1 === level2.level1) {
          let level2_payload = {
            path: level2.path,
            iconName: level2.iconName,
          }
          let level3_arr = [];
          for (const level3 of subChilds) {
            if (level3.level1 === level1.level1 && level3.level2 === level2.level2) {
              let level3_payload = {
                path: level3.path,
                iconName: level3.iconName,
                name: level3.name
              }
              level3_arr.push(level3_payload);
            }
          }
          if (level3_arr.length === 0) {
            level2_arr.push({
              ...level2_payload,
              name: level2.name
            })
          } else {
            level2_arr.push({
              ...level2_payload,
              name: level2.level2,
              submenu: level3_arr
            })

          }
        }
      }
      if (level2_arr.length === 0) {
        result.push({
          ...level1_payload,
          name: level1.name
        })
      } else {
        result.push({
          ...level1_payload,
          name: level1.level1,
          submenu: level2_arr
        })
      }
    }


    // let list = routes
    // {
    //   parents,
    //   childs,
    //   subchild
    // }

    // let result = []
    // resultData.map((e) => {
    //   result.push({
    //     path: `/app${e.routingComponent}`,
    //     icon: "",
    //     name: e.routingName,
    //     componentName: e.routingName
    //     // apiUrl: e.routingPath
    //   })
    // })
    response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.GET_FOR_SIDE_MENU_SUCCESS, result);
    // res.send(result);
  } catch (error) {
    log.error("/routing/getForsideMenu/error", error)
    response.errorMsgResponse(res, CONSTANT.BAD_REQUEST_ERROR_CODE, MESSAGE.GET_FOR_SIDE_MENU_FAIL, error)
  }
})


module.exports = router