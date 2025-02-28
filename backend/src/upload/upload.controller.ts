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
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UploadFileDto } from './dto/upload-file.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('File Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Roles(Role.Admin)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to be uploaded',
    type: UploadFileDto,
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiBearerAuth()
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
  @Roles(Role.Admin)
  @Put()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to be updated',
    type: UploadFileDto,
  })
  @ApiResponse({ status: 200, description: 'File updated successfully' })
  @ApiBearerAuth()
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
