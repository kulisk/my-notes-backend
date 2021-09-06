import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } from '../const';

const s3 = new S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

@Injectable()
export class S3Service {
  constructor() {
    this.S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
  }
  S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
  async copy(key: string, newKey: string) {
    await s3
      .copyObject({
        Bucket: this.S3_BUCKET_NAME,
        Key: newKey,
        CopySource: encodeURI(`${this.S3_BUCKET_NAME}/${key}`),
      })
      .promise();
  }

  async delete(key: string) {
    await s3
      .deleteObject({
        Bucket: this.S3_BUCKET_NAME,
        Key: key,
      })
      .promise();
  }
}
