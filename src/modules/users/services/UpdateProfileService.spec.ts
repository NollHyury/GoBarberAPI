import FakeUsersRepository from '../repositories/fakes/FakeUsersReposity';
import UpdateProfileService from './UpdateProfileService';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      email: 'johndoe2@test.com',
      name: 'John Doee',
      user_id: user.id,
    });

    expect(updatedUser.name).toBe('John Doee');
    expect(updatedUser.email).toBe('johndoe2@test.com');
  });

  it('should not be able tp change the email to same the another email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'test@test.com',
      password: '123456',
    });


    await expect(updateProfile.execute({
      email: 'johndoe@test.com',
      name: 'John Doee',
      user_id: user.id,
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      email: 'johndoe2@test.com',
      name: 'John Doee',
      user_id: user.id,
      old_passWord: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    await expect(updateProfile.execute({
      email: 'johndoe2@test.com',
      name: 'John Doee',
      user_id: user.id,
      password: '123123',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    await expect(updateProfile.execute({
      email: 'johndoe2@test.com',
      name: 'John Doee',
      user_id: user.id,
      password: '123123',
      old_passWord: '321321321'
    })).rejects.toBeInstanceOf(AppError);
  });
});
