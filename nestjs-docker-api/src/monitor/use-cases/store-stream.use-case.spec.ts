import { getModelToken } from '@nestjs/mongoose';
import { TestingModule, Test } from '@nestjs/testing';
import { ArchiveStream } from '../schemas/archive-stream.schema';
import { Stream } from '../schemas/stream.schema';
import { StoreStreamCommand } from './store-stream.command';
import { StoreStreamUseCase } from './store-stream.use-case';

describe('StoreStreamUseCase', () => {
  let storeStreamUseCase: StoreStreamUseCase;

  const saveFn = jest.fn();
  const countFn = jest
    .fn()
    .mockResolvedValueOnce(1)
    .mockResolvedValueOnce(100001);
  const findFn = jest
    .fn()
    .mockResolvedValueOnce([{ _id: '1', toObject: () => ({ _id: '1' }) }]);
  const deleteManyFn = jest.fn();
  const insertManyFn = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreStreamUseCase,
        {
          provide: getModelToken(Stream.name),
          useValue: {
            count: () => ({
              exec: countFn,
            }),
            find: () => ({ exec: findFn }),
            create: () => ({
              save: saveFn,
            }),
            deleteMany: () => ({
              exec: deleteManyFn,
            }),
          },
        },
        {
          provide: getModelToken(ArchiveStream.name),
          useValue: {
            insertMany: insertManyFn,
          },
        },
      ],
    }).compile();

    storeStreamUseCase = module.get<StoreStreamUseCase>(StoreStreamUseCase);
  });

  describe('execute', () => {
    it('should store the stream', async () => {
      const command = new StoreStreamCommand(
        'tweet with hashtag #covid',
        new Date('2021-01-01T00:00:00Z'),
      );

      await storeStreamUseCase.execute(command);

      expect(saveFn).toBeCalled();
      expect(countFn).toBeCalled();
      expect(findFn).not.toBeCalled();
    });

    it('should archive the stream', async () => {
      const command = new StoreStreamCommand(
        'tweet with hashtag #covid',
        new Date('2021-01-01T00:00:00Z'),
      );

      await storeStreamUseCase.execute(command);

      expect(saveFn).toBeCalled();
      expect(countFn).toBeCalled();
      expect(findFn).toBeCalled();
      expect(insertManyFn).toBeCalled();
      expect(deleteManyFn).toBeCalled();
    });
  });
});
