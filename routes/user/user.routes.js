let router = require("express").Router();
let log = require("../../helper/logger");
let response = require("../../helper/response");
const services = require("../../controller/services");
const MESSAGE = require("../../helper/responseMessages");
const CONSTANT = require("../../helper/constant")
const _ = require("lodash");
const mongoose = require("mongoose");
const User = mongoose.model("user");
const U = require("../../model/user/user.model")
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bcrept = require("bcrypt")

const secretKey = require("../../config.json");




const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "anirudhadahate6@gmail.com",
        pass: 'hbugqvmnpotavwoa',
    },

});




//post user api
router.post("/add", async (req, res) => {
    log.debug("/user/add")

    try {

        const myUUID = uuidv4();

        console.log(myUUID, "myUUID")
        // var length = 8,
        //     charset = "@#$&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&*0123456789abcdefghijklmnopqrstuvwxyz",
        //     password = "";
        // for (var i = 0, n = charset.length; i < length; ++i) {
        //     password += charset.charAt(Math.floor(Math.random() * n));
        // }
        // // res.send(password);
        // console.log(password, "password")
        // const obj = { ...req.body, password: password }
        const obj = { ...req.body, userId: myUUID }
        const UserData = await services.add(User, obj)

        // const d = await User.findOne({ email: UserData.email })
        // console.log(d)

        // Send an email
        const mailOptions = {
            from: 'nil60940@gmail.com',
            to: req.body.email,
            subject: 'Service Provider',
            html: `<h3 style:"color:red;">Thank you for join with us .</h3> <p>  <a href="http://localhost:3000/change-password/${obj.userId}"><u>Please click here to change your password to login </u></a></p>`
            // text: htmlContent
        };


        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {

                response.errorResponse(res, CONSTANT.BAD_REQUEST_ERROR_CODE, MESSAGE.USER_ADD_FAIL, error.message)
            } else {
                console.log("email sent", + info)
                response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.USER_ADD_SUCCESS, UserData)
            }
        });

    } catch (error) {
        log.error("/user/add/error", error)
        response.errorResponse(res, CONSTANT.BAD_REQUEST_ERROR_CODE, MESSAGE.USER_ADD_FAIL, error.message)

    }
})



/// get api user
router.get("/userlist", async (req, res) => {
    log.debug("/user/userlist")
    try {
        let { page, limit, search } = req.query
        const skip = (page - 1) * limit

        let getAllSerach = { $or: [{ email: { $regex: '^' + search + '', $options: 'i' } }, { role: { $regex: '^' + search + '', $options: 'i' } }] }

        const count = await User.countDocuments(getAllSerach)
        // const UserData = await User.find(getAllSerach).limit(limit * 1).skip(skip).sort({ _id: -1 })
        const UserData = await services.getAllWithSortAndPagination(User, getAllSerach, skip, limit * 1, { _id: -1 })
        response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.USER_LIST, { UserData, total: count })

    } catch (error) {
        log.debug("/user/userlist", error)
        response.errorResponse(res, CONSTANT.INTERNAL_SERVER_ERROR_CODE, MESSAGE.USER_LIST_FAIL, error.message)

    }
})




// get by userid
router.get("/get/:id", async (req, res) => {
    log.debug("/user/get/:id")
    const { id } = req.params
    try {
        // const single = await User.findById({ _id: id });
        const single = await services.getOne(User, { _id: id })

        response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.FETCH_SINGLE_USER, single)
    } catch (error) {
        log.debug("/get/:id", error)

        response.errorResponse(res, CONSTANT.INTERNAL_SERVER_ERROR_CODE, MESSAGE.ERROR_SINGLE_FETCH, error.message)
    }
})



/// delete by id
router.delete("/delete/:id", async (req, res) => {
    log.debug("/user/delete/:id")
    const { id } = req.params
    try {
        // const user = await User.findByIdAndDelete({ _id: id });

        const user = await services.deleteByIdPer(User, id)

        response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.SINGLE_USER_DELETE, user)
    }
    catch (error) {
        log.debug("/user/delete/:id", error)

        res.errorResponse(res, CONSTANT.BAD_REQUEST_ERROR_CODE, MESSAGE.ERROR_SINGLE_DELETE, error.message)
    }

})



// update by id
router.patch("/update/:id", async (req, res) => {
    log.debug("/user/update/:id")

    const { id } = req.params;
    try {
        // const userUpdate = await User.findByIdAndUpdate(id, req.body, { new: true })
        const userUpdate = await services.updateBy(User, id, req.body)
        response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.UPDATE_USER, userUpdate)

    } catch (error) {
        log.debug("/user/update/:id", error)

        res.errorResponse(res, CONSTANT.BAD_REQUEST_ERROR_CODE, MESSAGE.USER_UPDATE_ERROR, error.message)
    }
})
// multiple delete 
router.delete("/deleteSelected", async (req, res) => {
    log.debug("/user/deleteSelected")
    const { id } = req.body

    try {
        // const result = await userModel.deleteMany({ _id: { $in: id } });
        const result = await services.deleteMany(User, id)
        response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.MULTIPLE_USER_DELETE, result)

    } catch (error) {

        res.errorResponse(res, CONSTANT.INTERNAL_SERVER_ERROR_CODE, MESSAGE.ERROR_MULTIPLE_DEL, error.message)
    }
})


// change password 


router.patch("/changePassword/:id", async (req, res) => {
    log.debug("/changePassword")
    const { id } = req.params
    const { password } = req.body

    try {

        bcrept.hash(password, 10, async (err, hash) => {
            if (err) {
                console.log(err);
                return
            }
            if (hash) {

                // const userExists = await User.find();
                const userExists = await services.getAll(User)

                const singleUser = userExists.find((userId) => userId.userId === id);
                //console.log(newPassword, "dsd")
                if (singleUser !== undefined) {
                    const userUpdate = await User.findByIdAndUpdate(singleUser._id, { $set: { password: hash } })


                    response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.CHANGE_SUCCESS, userUpdate)
                }

            }
        })
        // console.log(newPassword, "sjdh")
        // const userExists = await User.find();

        // const U = userExists.find((userId) => userId.userId === id);
        // console.log(newPassword, "dsd")
        // if (U !== undefined) {
        //     const userUpdate = await User.findByIdAndUpdate(U._id, { $set: { password: newPassword } })


        //     response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.CHANGE_SUCCESS, userUpdate)
        // }

    } catch (error) {
        log.debug("/changePassword", error)

        response.errorResponse(res, CONSTANT.BAD_REQUEST_ERROR_CODE, MESSAGE.ERROR_CHANGE,)
    }
})



router.post("/login", async (req, res) => {
    log.debug("/login")
    const { email, password } = req.body
    try {
        // const user = await User.findOne({ email: email })
        const user = await services.getOne(User, { email: email })



        if (user) {

            bcrept.compare(password, user.password, async (err, result) => {
                if (result) {


                    const token = jwt.sign({ id: user._id, email: user.email }, secretKey.secretKey, {
                        expiresIn: '1h', // Token expiration time
                    });


                    const singleUser = await User.findOne({ email: email }).select('-password -__v -createdBy');
                    // const singleUser = await services.getOne(User, { email: email }).select('-password -__v -createdBy');
                    console.log(singleUser)
                    response.successResponse(res, CONSTANT.SUCCESS_STATUS_CODE, MESSAGE.LOGIN_SUCCESSFULL, { user: singleUser, token })
                }
                if (err) {
                    console.log(err, "errrr")
                    response.errorResponse(res, CONSTANT.UNAUTHORIZED_ERROR_CODE, MESSAGE.ERROR_LOGIN, err.message)
                }

            });

        }



    } catch (error) {
        log.debug("/login", error)
        response.errorResponse(res, CONSTANT.UNAUTHORIZED_ERROR_CODE, MESSAGE.ERROR_LOGIN, error.message)

    }


})


module.exports = router