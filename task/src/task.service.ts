import {HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {ITaskDto} from "./interface/task.interface";
import {Task, TaskDocument} from "./schema/task.schema";
import {TaskStatus} from "./status.enum";

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}
  async create(taskDto: ITaskDto) {
    const {content, title, userId} = taskDto;
    const task = await this.taskModel.create({
      content,
      title,
      userId,
      status: TaskStatus.Pending,
    });
    return {
      status: HttpStatus.CREATED,
      error: false,
      message: "task created",
      data: {task},
    };
  }
  async findUserTask(userId: string) {
    const tasks = await this.taskModel.find({
      userId,
    });
    return {
      status: HttpStatus.OK,
      error: false,
      data: {tasks},
    };
  }
}
