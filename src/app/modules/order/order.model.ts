import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
    email: string;
    items: { foodId: Schema.Types.ObjectId; quantity: number }[];
    totalPrice: number;
    paymentStatus: string;
    paymentIntentId?: string;
    status : 'pending' | 'delivery' | 'completed' | 'rejected'
    createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
    email: { type: String, required: true },
    items: [
        {
            foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
            quantity: { type: Number, required: true },
        },
    ],
    totalPrice: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    status: { type: String, enum: ["pending", "delivery" , "completed" , "rejected"], default: "pending" },
    paymentIntentId: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;
