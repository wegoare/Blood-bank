const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Inventory = require("../models/inventoryModal");
const mongoose = require("mongoose");
//register new user
router.post("/register", async (req, res) => {
    try {
        //check if user is already exists or not
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.send({
                success: false,
                message: "User already exists",
            });
        }
        // hash password decrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        // add phone field to the request body
        // req.body.phone = req.body.phone;

        // save user--
        const user = new User(req.body);
        await user.save();

        return res.send({
            success: true,
            message: "user registered successfully",
        });
    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        });
    }
});


// login user---------
router.post("/login", async (req, res) => {
    try {
        //check if user is already exists or not
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.send({
                success: false,
                message: "User not found",
            });
        }
        // check if userType is matches
        if(user.userType !== req.body.userType){
            return res.send({
                success: false,
                message: `user is not registered as a ${req.body.userType}`,

            });
        }
        // compare password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password,
        );
        // if not valid password
        if (!validPassword) {
            return res.send({
                success: false,
                message: "Invalid password",
            });
        }
        // if the password is valid just write - generate jwt token--
        const token = jwt.sign({
            userId: user._id
        }, process.env.jwt_secret, {
            expiresIn: "1d",
        });
        return res.send({
            success: true,
            message: "user logged in successfully",
            data: token,
        });

    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        });
    }
});

// get Current User--
router.get("/get-current-user", authMiddleware , async (req, res) => {
    try {
         const user = await User.findOne({ _id: req.body.userId });
         return res.send({
            success: true,
            message: "User fetched Successfully",
            data: user,
         });
    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        });
    }
});

// get all Unique Donars-

router.get("/get-all-donars", authMiddleware, async (req, res) =>{
    try {
        
        // get all unique donars ids form inventory
        const organisation = new mongoose.Types.ObjectId(req.body.userId);
        const uniqueDonarIds = await Inventory.distinct("donar", {
            organisation,

        });
         
        const donars = await User.find({
            _id: { $in: uniqueDonarIds },
        });
        
        return res.send({
            success: true,
            message: "Donars fetched successfully",
            data: donars,
        })

    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        });
    }
});

//get all Unique Hospitals-
router.get("/get-all-hospitals" , authMiddleware, async (req, res) => {

    try {
        
        // get all unique donars ids form inventory
        const organisation = new mongoose.Types.ObjectId(req.body.userId);
        const uniqueHospitalIds = await Inventory.distinct("hospital", {
            organisation,

        });
         
        const hospitals = await User.find({
            _id: { $in: uniqueHospitalIds },
        });
        
        return res.send({
            success: true,
            message: "Hospitals fetched successfully",
            data: hospitals,
        })

    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        });
    }
});

// get all unique organisations for a donar-
router.get("/get-all-organisations-of-a-donar" , authMiddleware, async (req, res) => {

    try {
        
        // get all unique donars ids form inventory
        const donar = new mongoose.Types.ObjectId(req.body.userId);
        const uniqueOrganisationIds = await Inventory.distinct("organisation", {
            donar,

        });
         
        const hospitals = await User.find({
            _id: { $in: uniqueOrganisationIds },
        });
        
        return res.send({
            success: true,
            message: "Hospitals fetched successfully",
            data: hospitals,
        })

    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        });
    }
});

// get all unique organisations for a hospital-
router.get("/get-all-organisations-of-a-hospital" , authMiddleware, async (req, res) => {

    try {
        
        // get all unique hospital ids form inventory
        const hospital = new mongoose.Types.ObjectId(req.body.userId);
        const uniqueOrganisationIds = await Inventory.distinct("organisation", {
             hospital,

        });
         
        const hospitals = await User.find({
            _id: { $in: uniqueOrganisationIds },
        });
        
        return res.send({
            success: true,
            message: "Hospitals fetched successfully",
            data: hospitals,
        })

    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;