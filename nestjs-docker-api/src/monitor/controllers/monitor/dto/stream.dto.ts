import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';

interface Stream {
  content: string;
  timestamp: Date;
}

export class StreamDto implements Stream {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDate()
  @Type(() => Date)
  timestamp: Date;
}
