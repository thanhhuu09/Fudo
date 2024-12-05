import {
  Controller,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UploadFileDto } from './dto/upload-file.dto';

@ApiTags('File Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to be uploaded',
    type: UploadFileDto,
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ imageUrl: string }> {
    if (!file) {
      throw new Error('File is required');
    }
    const imageUrl = await this.s3Service.uploadFile(file);
    return { imageUrl };
  }

  // Update file
  // Endpoint: PUT /upload?oldImageUrl=oldImageUrl
  @Put()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to be updated',
    type: UploadFileDto,
  })
  @ApiResponse({ status: 200, description: 'File updated successfully' })
  async updateFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('oldImageUrl') oldImageUrl: string,
  ): Promise<{ imageUrl: string }> {
    if (!file) {
      throw new Error('File is required');
    }
    const imageUrl = await this.s3Service.updateFile(oldImageUrl, file);
    return { imageUrl };
  }
}
