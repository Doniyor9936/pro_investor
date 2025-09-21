// src/documents/documents.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { UpdateVerificationDto } from './dto/update-verification.dto';
import * as fs from 'fs';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(Document)
        private readonly documentsRepository: Repository<Document>,
    ) {}

    // Hujjat yuklash
    async uploadDocument(userId: number, fileName: string, filePath: string, documentType: string): Promise<Document> {
        const document = this.documentsRepository.create({
            userId,
            fileName,
            filePath,
            documentType,
            verificationStatus: 'pending',
        });

        return this.documentsRepository.save(document);
    }

    // User hujjatlari
    async getUserDocuments(userId: number): Promise<Document[]> {
        return this.documentsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    // Bitta hujjat
    async getDocumentById(documentId: number, userId?: number): Promise<Document> {
        const where: any = { id: documentId };
        if (userId) where.userId = userId;

        const document = await this.documentsRepository.findOne({ where });
        
        if (!document) {
            throw new NotFoundException('Hujjat topilmadi');
        }
        
        return document;
    }

    // Hujjat o'chirish
    async deleteDocument(documentId: number, userId: number): Promise<void> {
        const document = await this.getDocumentById(documentId, userId);
        
        // Faylni o'chirish
        if (fs.existsSync(document.filePath)) {
            fs.unlinkSync(document.filePath);
        }

        await this.documentsRepository.remove(document);
    }

    // Admin: tasdiqlash
    async updateVerificationStatus(documentId: number, updateDto: UpdateVerificationDto): Promise<Document> {
        const document = await this.getDocumentById(documentId);
        
        document.verificationStatus = updateDto.status;
        
        if (updateDto.rejectionReason) {
            document.rejectionReason = updateDto.rejectionReason;
        } else {
            document.rejectionReason = null;
        }

        return this.documentsRepository.save(document);
    }

    // Admin: barcha hujjatlar
    async getAllDocuments(page: number = 1, limit: number = 20) {
        const [documents, total] = await this.documentsRepository.findAndCount({
            relations: ['user'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return { documents, total, currentPage: page, totalPages: Math.ceil(total / limit) };
    }

    // Fayl olish
    async getDocumentFile(documentId: number, userId?: number) {
        const document = await this.getDocumentById(documentId, userId);
        
        if (!fs.existsSync(document.filePath)) {
            throw new NotFoundException('Fayl topilmadi');
        }

        return { filePath: document.filePath, fileName: document.fileName };
    }
}