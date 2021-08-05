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
import { diskStorage } from 'multer';
import { FileHelper } from '../shared/fileHelper';
import { Express } from 'express';
import { MaxFilesCount } from './constants';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FilesInterceptor('files', MaxFilesCount, {
      storage: diskStorage({
        destination: FileHelper.destinationPath,
        filename: FileHelper.customFileName,
      }),
    }),
  )
  create(
    @Body() createNoteDto,
    @Req() req: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<CreateNoteDto> {
    const user = <UserDto>req.user;
    return this.notesService.create(user, createNoteDto, files);
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll(@Req() req: any) {
    const user = <UserDto>req.user;
    return this.notesService.findAll(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FilesInterceptor('files', MaxFilesCount, {
      storage: diskStorage({
        destination: FileHelper.destinationPath,
        filename: FileHelper.customFileName,
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.notesService.update(+id, updateNoteDto, files);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Param('id') id: string) {
    return this.notesService.remove(+id);
  }
}
