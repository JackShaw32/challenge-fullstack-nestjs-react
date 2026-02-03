import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async findAll(page: number = 1, limit: number = 9) {
    const skip = (page - 1) * limit;

    return await this.postsRepository.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
      take: limit,
      skip: skip,
    });
  }

  async findOne(id: string) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Publicación no encontrada');
    }

    return post;
  }

  async create(createPostDto: CreatePostDto, userId: string) {
    const post = this.postsRepository.create({
      ...createPostDto,
      user: { id: userId } as User,
      created_at: new Date(),
    });

    const savedPost = await this.postsRepository.save(post);

    return await this.postsRepository.findOne({
      where: { id: savedPost.id },
      relations: ['user'],
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto, user: any) {
    const post = await this.findOne(id);

    if (post.user?.id !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'No tienes permiso para editar esta publicación',
      );
    }

    Object.assign(post, updatePostDto);
    return await this.postsRepository.save(post);
  }

  async remove(id: string, user: any) {
    const post = await this.findOne(id);

    if (post.user?.id !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'No tienes permiso para eliminar esta publicación',
      );
    }

    return await this.postsRepository.remove(post);
  }
}
