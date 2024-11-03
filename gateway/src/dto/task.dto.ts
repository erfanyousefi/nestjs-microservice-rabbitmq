import {ApiProperty} from "@nestjs/swagger";

export class TaskDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
}
