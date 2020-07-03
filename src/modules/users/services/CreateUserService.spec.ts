import FakeUsersRepository from '../repositories/fakes/FakeUsersReposity';
import CreateUserSevice from './CreateUserSevice';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUser', () => {

  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserSevice = new CreateUserSevice(
      fakeUsersRepository,fakeHashProvider
    );

    const user = await createUserSevice.execute({
      name : "John Doe",
      email: 'johndoe@test.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');

  });

  it('should not be able to create a new user with same email from another', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserSevice = new CreateUserSevice(
      fakeUsersRepository,fakeHashProvider
    );

    await createUserSevice.execute({
      name : "John Doe",
      email: 'johndoe@test.com',
      password: '123456',
    });

    expect(createUserSevice.execute({
      name : "John Doe",
      email: 'johndoe@test.com',
      password: '123456',
    })).rejects.toBeInstanceOf(AppError);

  });


});
