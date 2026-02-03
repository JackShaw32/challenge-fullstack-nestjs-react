import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Post as PostEntity } from '../posts/entities/post.entity';

@Controller('seed')
export class SeedController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  @Get()
  async execute() {
    const existingUsers = await this.userRepository.find();
    if (existingUsers.length > 0) {
      return {
        message: 'La base de datos ya contiene datos. Seeding cancelado.',
      };
    }

    const mockAvatarBlue =
      'https://ui-avatars.com/api/?name=User+One&background=0D8ABC&color=fff&size=128';
    const mockAvatarRed =
      'https://ui-avatars.com/api/?name=Admin+User&background=EF4444&color=fff&size=128';

    const loremTitle = 'What is Lorem Ipsum?';
    const loremContent =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

    const passwordCommon = await bcrypt.hash('password123', 10);
    const admin = this.userRepository.create({
      name: 'Super Admin',
      email: 'admin@admin.com',
      password: passwordCommon,
      role: 'ADMIN',
      avatarUrl: mockAvatarRed,
    });

    const user1 = this.userRepository.create({
      name: 'Juan Perez',
      email: 'user1@user.com',
      password: passwordCommon,
      role: 'USER',
      avatarUrl: mockAvatarBlue,
    });

    const user2 = this.userRepository.create({
      name: 'Maria Garcia',
      email: 'user2@user.com',
      password: passwordCommon,
      role: 'USER',
      avatarUrl: mockAvatarBlue,
    });

    await this.userRepository.save([admin, user1, user2]);

    const allUsers = [admin, user1, user2];
    const postsToSave: PostEntity[] = [];

    let postCounter = 1;

    for (const user of allUsers) {
      for (let i = 0; i < 3; i++) {
        postsToSave.push(
          this.postRepository.create({
            title: `${loremTitle} (Post #${postCounter})`,
            content: loremContent,
            user: user,
          }),
        );
        postCounter++;
      }
    }

    await this.postRepository.save(postsToSave);

    return {
      message: '¡Seed completado con éxito!',
      summary: {
        usersCreated: 3,
        postsCreated: 9,
      },
      credentials: [
        { role: 'ADMIN', email: 'admin@admin.com', password: 'password123' },
        { role: 'USER', email: 'user1@user.com', password: 'password123' },
        { role: 'USER', email: 'user2@user.com', password: 'password123' },
      ],
    };
  }
}
