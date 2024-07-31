import 'only-server';

import { FileModel, MimeTypes } from '@app/types';
import { model, models, Schema } from 'mongoose';


const FileSchema = new Schema({
  file: {
    type: Buffer,
    required: [true, 'Photo/File is required'],
  },
  mimeType: {
    type: String,
    enum: MimeTypes,
    required: [true, 'Mime Type is required'],
  },
}, {
  timestamps: true
})

export default models?.File || model<FileModel>('File', FileSchema)
