import {NestFactory} from "@nestjs/core";
import {RmqOptions, Transport} from "@nestjs/microservices";
import {TaskModule} from "./task.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TaskModule, {
    transport: Transport.RMQ,
    options: {
      urls: ["amqp://localhost:5672"],
      queue: "task-service",
      queueOptions: {
        durable: false,
      },
    },
  } as RmqOptions);
  await app.listen();
  console.log("task service: localhost:4003");
}
bootstrap();
