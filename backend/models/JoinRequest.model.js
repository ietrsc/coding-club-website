import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema(
  {
    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
      required: true,
    },

    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    requestType: {
      type: String,
      enum: ["join", "invite"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Only enforce uniqueness while a request is still
// pending. Without partialFilterExpression, once a
// request is rejected/accepted, MongoDB blocks any
// future request between the same participant/team
// with a duplicate-key error.
joinRequestSchema.index(
  {
    participantId: 1,
    teamId: 1,
    requestType: 1,
  },
  {
    unique: true,
    partialFilterExpression: { status: "pending" },
  }
);

export default mongoose.model(
  "JoinRequest",
  joinRequestSchema
);