import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ArchiveStreamDocument = ArchiveStream & Document;

// Keep created and updated fields for auditing purposes
@Schema()
export class ArchiveStream {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  created: Date;

  @Prop({ required: true })
  updated: Date;
}

export const ArchiveStreamSchema = SchemaFactory.createForClass(ArchiveStream);
