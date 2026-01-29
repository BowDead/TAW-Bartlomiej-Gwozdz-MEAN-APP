import { Schema, model } from 'mongoose';
import { IPost } from "../models/data.model";

export const DataSchema: Schema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
}, {
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            ret.id = ret._id.toString();
            return ret;
        }
    }
});

export default model<IPost>('Post-BG', DataSchema);