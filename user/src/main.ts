import {NestFactory} from "@nestjs/core";
import {RmqOptions, Transport} from "@nestjs/microservices";
import {UserModule} from "./user.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice(UserModule, {
    transport: Transport.RMQ,
    options: {
      urls: ["amqp://localhost:5672"],
      queue: "user-service",
      queueOptions: {
        durable: false,
      },
    },
  } as RmqOptions);
  await app.listen();
  console.log("user service: localhost:4001");
}
bootstrap();
