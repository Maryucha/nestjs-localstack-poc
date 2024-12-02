import { Test, TestingModule } from '@nestjs/testing';
import { SesController } from './ses.controller';

describe('SesController', () => {
  let controller: SesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SesController],
    }).compile();

    controller = module.get<SesController>(SesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
