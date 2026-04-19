import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import { BootstrapOwnerDto } from './dto/bootstrap-owner.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async bootstrapOwner(dto: BootstrapOwnerDto) {
    const existingUserCount = await this.prisma.user.count();

    if (existingUserCount > 0) {
      throw new BadRequestException(
        'Owner bootstrap is only allowed before the first user exists.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        passwordHash,
        role: UserRole.OWNER,
      },
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email.toLowerCase(),
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  async getMe(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  private buildAuthResponse(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const signOptions: SignOptions = {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d') as SignOptions['expiresIn'],
    };

    const accessToken = jwt.sign(
      payload,
      this.configService.getOrThrow<string>('JWT_SECRET'),
      signOptions,
    );

    return {
      accessToken,
      user: payload,
    };
  }
}
