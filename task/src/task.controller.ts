import {Controller} from "@nestjs/common";
import {MessagePattern} from "@nestjs/microservices";
import {ITaskDto} from "./interface/task.interface";
import {TaskService} from "./task.service";

@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @MessagePattern("create_task")
  create(taskDto: ITaskDto) {
    return this.taskService.create(taskDto);
  }
  @MessagePattern("user_tasks")
  findUserTasks({userId}: {userId: string}) {
    return this.taskService.findUserTask(userId);
  }
}
