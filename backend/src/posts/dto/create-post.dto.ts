import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsNotEmpty()
  content!: string;
}
