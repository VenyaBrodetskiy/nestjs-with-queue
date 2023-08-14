import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  Logger,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './create-items.dto';
import { Item } from './items.schema';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Controller('items')
export class ItemsController {
  private readonly logger = new Logger(ItemsController.name);
  constructor(
    @InjectQueue('items') private readonly itemsQueue: Queue,
    private readonly itemService: ItemsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  public async create(@Body() item: CreateItemDto, @Request() req) {
    const userId = req.user.id;

    this.logger.log('Creating an item');
    const job = await this.itemsQueue.add('create-item', { ...item, userId });

    this.logger.log('Create item task is sucessfully sent to queue');
    return { jobId: job.id };
  }

  @Get()
  public async findAll(): Promise<Item[]> {
    try {
      return this.itemService.findAll();
    } catch (error) {
      this.logger.error('Failed getting items', error.stack);
      throw new HttpException(
        'Failed getting items',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
