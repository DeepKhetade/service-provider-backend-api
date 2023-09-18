let routingRoute = require("./routing/routing");
let accessRoute = require("./access/access");
let userRoute = require("./user/user.routes");
let roleRouting = require("./role/role.routes");

const router = require('express').Router();

router.use("/api/v1/user", userRoute);
router.use("/api/v1/routing", routingRoute);
router.use("/api/v1/access", accessRoute);
router.use('/api/v1/role', roleRouting)

module.exports = router
