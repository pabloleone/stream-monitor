import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type StreamDocument = Stream & Document;

@Schema({
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
})
export class Stream {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  timestamp: Date;
}

export const StreamSchema = SchemaFactory.createForClass(Stream);
