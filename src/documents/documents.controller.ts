// src/documents/documents.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Delete,
  UseGuards, 
  UseInterceptors, 
  UploadedFile,
  Body,
  Param,
  ParseIntPipe,
  Res,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import express from 'express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../user/user.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Hujjat yuklash' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
          destination: './uploads/documents',
          filename: (req, file, cb) => {
              const randomName = Date.now() + '-' + Math.round(Math.random() * 1E9);
              cb(null, randomName + extname(file.originalname));
          },
      }),
      fileFilter: (req, file, cb) => {
          if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
              cb(new BadRequestException('Faqat JPG, PNG, PDF'), false);
          } else {
              cb(null, true);
          }
      },
      limits: { fileSize: 5 * 1024 * 1024 } // 5MB
  }))
  async uploadDocument(
      @GetUser() user: User,
      @UploadedFile() file: Express.Multer.File,
      @Body('documentType') documentType: string
  ) {
      if (!['passport', 'selfie', 'utility_bill', 'other'].includes(documentType)) {
          throw new BadRequestException('Noto\'g\'ri hujjat turi');
      }

      return this.documentsService.uploadDocument(
          user.id,
          file.originalname,
          file.path,
          documentType
      );
  }

  @Get()
  @ApiOperation({ summary: 'Mening hujjatlarim' })
  async getUserDocuments(@GetUser() user: User) {
      return this.documentsService.getUserDocuments(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Hujjat ma\'lumotlari' })
  async getDocumentById(
      @GetUser() user: User,
      @Param('id', ParseIntPipe) id: number
  ) {
      return this.documentsService.getDocumentById(id, user.id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Hujjatni yuklab olish' })
  async downloadDocument(
      @GetUser() user: User,
      @Param('id', ParseIntPipe) id: number,
      @Res() res: express.Response
  ) {
      const { filePath, fileName } = await this.documentsService.getDocumentFile(id, user.id);
      
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hujjatni o\'chirish' })
  async deleteDocument(
      @GetUser() user: User,
      @Param('id', ParseIntPipe) id: number
  ) {
      await this.documentsService.deleteDocument(id, user.id);
      return { message: 'Hujjat o\'chirildi' };
  }
}