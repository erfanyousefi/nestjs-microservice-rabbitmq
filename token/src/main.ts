import {NestFactory} from "@nestjs/core";
import {RmqOptions, Transport} from "@nestjs/microservices";
import {TokenModule} from "./token.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TokenModule, {
    transport: Transport.RMQ,
    options: {
      urls: ["amqp://localhost:5672"],
      queue: "token-service",
      queueOptions: {
        durable: false,
      },
    },
  } as RmqOptions);
  await app.listen();
  console.log("tokenService: localhost:4002");
}
bootstrap();
