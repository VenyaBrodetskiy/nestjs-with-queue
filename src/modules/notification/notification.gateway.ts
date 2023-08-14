import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // public handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }
  public sendNotification(userId: string, data: any) {
    this.server.to(userId).emit('notification', data);
  }
}
