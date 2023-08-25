import mongoose, { ObjectId, Schema } from "mongoose";

interface IIncident {
    owner: ObjectId,
    access?: ObjectId[],
    date_of_occurence: Date,
    staff_involved?: ObjectId[],
    students_involved?: ObjectId[],
    parents_involved?: ObjectId[],
    others_involved?: ObjectId[],
    subject: string,
    description?: string,
    action_taken?: string,
    parentOrGuardian_notified: boolean,
    notification_type: string[],
    escalated: boolean,

}

const incidentModel = new mongoose.Schema<IIncident>(
    {
        owner: { type: Schema.Types.ObjectId, ref: "users", required: true },
        access: [{ type: Schema.Types.ObjectId, ref: "users" }],
        date_of_occurence: {type: Date, required: true},
        staff_involved: [{ type: Schema.Types.ObjectId, ref: "users" }],
        students_involved: [{ type: Schema.Types.ObjectId, ref: "students" }],
        parents_involved: { type: String },
        others_involved: { type: String },
        subject: { type: String, required: true },
        description: { type: String },
        action_taken: String,
        parentOrGuardian_notified: Boolean,
        notification_type: {
            Type: String,
            enum: ["Email", "Phone Call", "Text", "Remind", "Social Media", "Other"],
        },
        escalated: Boolean,
    },
    { collection: "incidents" }
);

export default mongoose.model<IIncident>("incidents", incidentModel);
