const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
    orderItems: {
        type:mongoose.Schema.Types.ObjectId ,
        ref: 'OrderItem',
        required: true,
    },
    shippingAddress1:{
        type:String,
        required:true,
    },
    shippingAddress2:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    zip:{
        type:Number,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        required:true,
        default:'Pending',
    },
    totalPrice:{
        type:Number,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    dateOrdered:{
        type:Date,
        default: Date.now,
    },
})
productSchema.virtual('id').get(function (){
    return this._id.toHexString();
});
productSchema.set('toJSON',{
    virtuals: true,
});
exports.Order = mongoose.model('Order',orderSchema);