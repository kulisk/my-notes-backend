import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from '../users/dto/user.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileHelper } from '../shared/fileHelper';
import { MaxFilesCount } from './constants';
import { CreateResultDto } from './dto/create-result.dto';
import * as S3Storage from 'multer-s3';
import { S3 } from 'aws-sdk';

const s3 = new S3();
const S3BucketName = 'mynotesbusket';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FilesInterceptor('files', MaxFilesCount, {
      storage: S3Storage({
        bucket: S3BucketName,
        s3: s3,
        acl: 'public-read',
        key: FileHelper.customFileName,
      }),
    }),
  )
  create(
    @Body() createNoteDto: CreateNoteDto,
    @Req() req,
    @UploadedFiles() files,
  ): Promise<CreateResultDto> {
    const user = <UserDto>req.user;
    return this.notesService.create(user, createNoteDto, files);
  }

  @Post(':id')
  @UseGuards(AuthGuard())
  copy(@Param('id') id: string, @Req() req): Promise<CreateResultDto> {
    const user = <UserDto>req.user;
    return this.notesService.copy(+id, user);
  }

  @Get('pages/:page')
  @UseGuards(AuthGuard())
  findAllInPage(@Req() req, @Param('page') page: number) {
    const user = <UserDto>req.user;
    return this.notesService.findAllInPage(user, page);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(+id);
  }

  @Get('search/:term/:page')
  @UseGuards(AuthGuard())
  search(@Param('term') term: string, @Param('page') page: string, @Req() req) {
    const user = <UserDto>req.user;
    return this.notesService.search(term, +page, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FilesInterceptor('files', MaxFilesCount, {
      storage: S3Storage({
        bucket: S3BucketName,
        s3: s3,
        acl: 'public-read',
        key: FileHelper.customFileName,
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @UploadedFiles() files,
  ) {
    return this.notesService.update(+id, updateNoteDto, files);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Param('id') id: string) {
    return this.notesService.remove(+id);
  }
}
