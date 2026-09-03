import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
  {
    projectName: { type: String, required: true },
    projectDescription: { type: String, required: true },
    projectOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    projectTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    projectStartDate: { type: Date, required: true },
    projectEndDate: { type: Date, required: true },
    projectStatus: {
      type: String,
      required: true,
      enum: ["active", "hold", "completed"],
    },
  },
  { timestamps: true },
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
