import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn((username: string, password: string) => {
        if (username === 'test' && password === 'password') {
          return { access_token: 'mock-token' };
        }
        return 'Unauthorized';
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should be return access token', () => {
    const result = { access_token: 'mock-token' };
    expect(
      controller.login({ username: 'test', password: 'password' }),
    ).toEqual(result);
  });

  it('Should be return Error ', () => {
    const result = 'Unauthorized';
    expect(
      controller.login({ username: 'error', password: 'password' }),
    ).toEqual(result);
  });
});
