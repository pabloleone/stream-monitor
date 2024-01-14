import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Stream, StreamSchema } from './schemas/stream.schema';
import { MonitorController } from './controllers/monitor/monitor.controller';
import { StoreStreamUseCase } from './use-cases/store-stream.use-case';
import {
  ArchiveStream,
  ArchiveStreamSchema,
} from './schemas/archive-stream.schema';

const StreamSchemaModel = {
  name: Stream.name,
  schema: StreamSchema,
};

const ArchiveStreamSchemaModel = {
  name: ArchiveStream.name,
  schema: ArchiveStreamSchema,
};

const StreamSchemaModelFeature = MongooseModule.forFeature([StreamSchemaModel]);
const ArchiveStreamSchemaModelFeature = MongooseModule.forFeature([
  ArchiveStreamSchemaModel,
]);

@Module({
  imports: [StreamSchemaModelFeature, ArchiveStreamSchemaModelFeature],
  providers: [StoreStreamUseCase],
  controllers: [MonitorController],
  exports: [StreamSchemaModelFeature],
})
export class MonitorModule {}
