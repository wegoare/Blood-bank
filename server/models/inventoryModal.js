const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    inventoryType: {
        type: String,
        required: true,
        enum: ["in", "out"],
    },
    bloodGroup: {
        type: String,
        required: true,
        
    },
    quantity: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    organisation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },

    // If inventoryType is "out" then Hospital is required
    //If inventoryType is "in" then Donar will be required
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: function () {
            return this.inventoryType === "out";
        },
    },
    
    donar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: function () {
            return this.inventoryType === "in";
        },
    },
},
    {
        timestamps: true,
    }



);

const Inventory = mongoose.model("inventories", inventorySchema);

module.exports = Inventory;