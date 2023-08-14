import { IsString, Length } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @Length(1, 50)
  name: string;

  @IsString()
  @Length(1, 255)
  description: string;
}
