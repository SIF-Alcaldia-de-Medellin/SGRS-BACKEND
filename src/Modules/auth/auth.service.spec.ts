/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '@Entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let repository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockJwtToken = {
    signAsync: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtToken,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /* Solicitamos la disponibilidad individual de la sala */
  describe('login', () => {
    it('should be throw a NotFoundException', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login('email', 'password')).rejects.toThrow(
        new NotFoundException('Not Found'),
      );
    });

    it('should be throw a UnauthorizedException', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        id: 1,
        role: 'role',
        email: 'email',
      });

      await expect(service.login('email', 'password')).rejects.toThrow(
        new UnauthorizedException('Unauthorized'),
      );
    });

    it('should be return access_token', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        id: 1,
        role: 'role',
        email: 'email',
      });

      const token = 'mock_token';

      mockJwtToken.signAsync.mockResolvedValue(
        new Promise((resolve, reject) => {
          resolve(token);
        }),
      );

      const result = await service.login('test@example.com', 'pass');
      expect(result).toEqual({ access_token: token });
    });
  });
});
