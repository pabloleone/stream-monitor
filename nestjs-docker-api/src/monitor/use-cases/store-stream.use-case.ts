import { Injectable, Logger } from '@nestjs/common';
import { UseCase } from './use-case.interface';
import { StoreStreamCommand } from './store-stream.command';
import { InjectModel } from '@nestjs/mongoose';
import { Stream, StreamDocument } from '../schemas/stream.schema';
import { Model } from 'mongoose';
import {
  ArchiveStream,
  ArchiveStreamDocument,
} from '../../monitor/schemas/archive-stream.schema';

@Injectable()
export class StoreStreamUseCase implements UseCase<StoreStreamCommand, void> {
  #logger = new Logger(StoreStreamUseCase.name);

  // set the threshold for the archive
  #archiveStreamThreshold = 100000;

  constructor(
    @InjectModel(Stream.name)
    private readonly streamModel: Model<StreamDocument>,
    @InjectModel(ArchiveStream.name)
    private readonly archiveStreamModel: Model<ArchiveStreamDocument>,
  ) {}

  async execute(command: StoreStreamCommand): Promise<void> {
    const stream = await this.streamModel.create(command);
    await stream.save();

    const count = await this.streamModel.count().exec();

    if (count > this.#archiveStreamThreshold) {
      const countToMove = count - this.#archiveStreamThreshold;
      await this.#archiveStream(countToMove);
    }
  }

  async #archiveStream(countToMove: number) {
    // Get the oldest records from the Main collection based on the count to move
    const oldestRecords = await this.streamModel
      .find({}, {}, { sort: { _id: 1 }, limit: countToMove })
      .exec();

    if (oldestRecords.length > 0) {
      // Prepare archived records with the same _id
      const archivedRecords = oldestRecords.map((record) => ({
        ...record.toObject(),
        _id: record._id, // Preserve the original _id
      }));

      // Move the oldest records to the Archived collection
      await this.archiveStreamModel.insertMany(archivedRecords);

      // Delete the oldest records from the Main collection
      const oldestRecordIds = oldestRecords.map((record) => record._id);
      await this.streamModel
        .deleteMany({ _id: { $in: oldestRecordIds } })
        .exec();

      this.#logger.log(`Archived ${oldestRecords.length} records`);
    }
  }
}
