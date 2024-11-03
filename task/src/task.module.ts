import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {Task, TaskSchema} from "./schema/task.schema";
import {TaskController} from "./task.controller";
import {TaskService} from "./task.service";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017/microservice-todo"),
    MongooseModule.forFeature([{name: Task.name, schema: TaskSchema}]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
