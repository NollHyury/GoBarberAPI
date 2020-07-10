import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersReposity';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUsersRepository;
let fakeMailProvider : FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmailService : SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(()=>{
    fakeUserRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    );
  })

  it('Should be able to recover the password using the email', async () => {
   await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await sendForgotPasswordEmailService.execute({
      email: 'johndoe@test.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('Should not be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({
        email: 'johndoe@test.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shoul generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'johndoe@test.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
