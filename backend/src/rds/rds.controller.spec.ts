import { Test, TestingModule } from '@nestjs/testing';
import { RdsController } from './rds.controller';

describe('RdsController', () => {
  let controller: RdsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RdsController],
    }).compile();

    controller = module.get<RdsController>(RdsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
