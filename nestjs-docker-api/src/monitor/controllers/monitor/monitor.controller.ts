import { Body, Controller, Post } from '@nestjs/common';
import { StreamDto } from './dto/stream.dto';
import { StoreStreamUseCase } from '../../use-cases/store-stream.use-case';
import { StoreStreamCommand } from '../../use-cases/store-stream.command';

@Controller('monitor')
export class MonitorController {
  constructor(private readonly storeStreamUseCase: StoreStreamUseCase) {}

  @Post('stream')
  async monitor(@Body() body: StreamDto): Promise<void> {
    const command = new StoreStreamCommand(body.content, body.timestamp);
    await this.storeStreamUseCase.execute(command);
  }
}
