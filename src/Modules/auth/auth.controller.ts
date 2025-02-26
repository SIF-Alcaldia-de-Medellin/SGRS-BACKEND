import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDTO } from './auth.dto';
import { Public } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login a User' })
  @ApiResponse({ status: 200, description: 'User login successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public login(@Body() signInDto: AuthDTO) {
    return this.authService.login(signInDto.username, signInDto.password);
  }
}
