import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    const fileName = `${uuidv4()}-${file.originalname}`;

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype, // MIME type of the file.
    };
    const { Location } = await this.s3.upload(params).promise();
    return Location; // Returns the public URL of the uploaded file
  }

  async deleteFile(imageURL: string): Promise<void> {
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    const key = imageURL.split(
      `${bucketName}.s3.ap-southeast-1.amazonaws.com/`,
    )[1];
    const params = {
      Bucket: bucketName,
      Key: key,
    };
    try {
      await this.s3.deleteObject(params).promise();
      console.log(`File ${key} deleted successfully`);
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw new Error('Failed to delete file from S3');
    }
  }

  async updateFile(
    oldImageURL: string,
    newFile: Express.Multer.File,
  ): Promise<string> {
    await this.deleteFile(oldImageURL);
    return this.uploadFile(newFile);
  }
}
