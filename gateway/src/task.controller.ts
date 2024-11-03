import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Post,
  Req,
} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {ApiConsumes, ApiTags} from "@nestjs/swagger";
import {Request} from "express";
import {lastValueFrom} from "rxjs";
import {Authorization} from "./decorators/auth.decorator";
import {TaskDto} from "./dto/task.dto";

@Controller("/task")
@ApiTags("Task")
export class TaskController {
  constructor(@Inject("TASK_SERVICE") private taskClientService: ClientProxy) {}

  @Post("create")
  @ApiConsumes("application/x-www-form-urlencoded")
  @Authorization()
  async createTask(@Body() createDto: TaskDto, @Req() req: Request) {
    const response = await lastValueFrom(
      this.taskClientService.send("create_task", {
        title: createDto.title,
        content: createDto.content,
        userId: req.user._id,
      })
    );
    if (response?.error) {
      throw new HttpException(response?.message, response?.status ?? 500);
    }
    return {
      message: response?.message,
      data: response?.data,
    };
  }
  @Get("user")
  @Authorization()
  async userTasks(@Req() req: Request) {
    const response = await lastValueFrom(
      this.taskClientService.send("user_tasks", {userId: req.user?._id})
    );
    return response?.data ?? {tasks: []};
  }
}
