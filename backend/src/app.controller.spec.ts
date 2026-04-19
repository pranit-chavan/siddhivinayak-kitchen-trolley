import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(() => {
    controller = new AppController();
  });

  it('returns the backend health payload', () => {
    expect(controller.getHealth()).toEqual({
      status: 'ok',
      service: 'kitchen-trolley-backend',
    });
  });
});
