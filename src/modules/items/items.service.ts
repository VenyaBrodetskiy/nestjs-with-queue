import { NotificationGateway } from '../notification/notification.gateway';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { Item } from './items.schema';
import { Model } from 'mongoose';
import { CreateItemDto } from './create-items.dto';
import {
  Processor,
  Process,
  OnQueueEvent,
  BullQueueEvents,
} from '@nestjs/bull';
import { Job } from 'bull';

interface FailedJobEvent {
  job: Job<Item>;
  error: Error;
}

@Injectable()
export class ItemsService {
  private readonly logger = new Logger(ItemsService.name);
  constructor(@InjectModel('Item') private itemModel: Model<Item>) {}

  // public async create(itemDto: CreateItemDto): Promise<Item> {
  //   try {
  //     const newItem = new this.itemModel(itemDto);
  //     return newItem.save();
  //   } catch (error) {
  //     throw new HttpException(
  //       'Item creation failed',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  public async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }
}

@Processor('items')
export class ItemsProcessor {
  constructor(
    @InjectModel('Item') private itemModel: Model<Item>,
    private readonly notification: NotificationGateway,
  ) {}

  @Process('create-item')
  public async handleCreateItem(job: Job<CreateItemDto>) {
    const item = job.data;

    const newItem = new this.itemModel(item);
    const result = await newItem.save();

    this.notification.sendNotification(result.id, {
      message: 'Item created successfully!',
    });

    return result;
  }

  @OnQueueEvent(BullQueueEvents.FAILED)
  public onFailedJob(event: FailedJobEvent) {
    const { job, error } = event;

    const userId = job.data.id;

    this.notification.sendNotification(userId, {
      message: `Failed to create item: ${error.message}`,
    });
  }
}
