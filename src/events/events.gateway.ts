import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

interface CreateNoteInterface {
  id: number;
  title: string;
  tags: string[];
  isPinned: boolean;
}

interface UpdateNoteInterface {
  title: string;
  tags: string[];
  content: string;
}

interface CopyData {
  id: number;
  duplicate: CreateNoteInterface;
}

interface UpdateData {
  id: number;
  note: UpdateNoteInterface;
}

@WebSocketGateway({ cors: true })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('pin')
  pin(@MessageBody() id: number): void {
    this.server.emit('pin', id);
  }

  @SubscribeMessage('remove')
  remove(@MessageBody() id: number): void {
    this.server.emit('remove', id);
  }

  @SubscribeMessage('copy')
  copy(@MessageBody() data: CopyData): void {
    this.server.emit('copy', data);
  }

  @SubscribeMessage('update')
  update(@MessageBody() data: UpdateData): void {
    this.server.emit('update', data);
  }

  @SubscribeMessage('create')
  create(@MessageBody() note: CreateNoteInterface): void {
    this.server.emit('create', note);
  }
}
