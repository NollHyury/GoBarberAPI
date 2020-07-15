import FakeUsersRepository from '../repositories/fakes/FakeUsersReposity';
import ShowProfileService from './ShowProfileService';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let showProfileService: ShowProfileService;

describe('showProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    showProfileService = new ShowProfileService(
      fakeUsersRepository,
    );
  });

  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    const findUser = await showProfileService.execute({
      user_id: user.id,
    });

    expect(findUser.id).toBe(user.id);
  });

  it('should not be able to show the profile from non-existing user', async () => {
    expect(showProfileService.execute({
      user_id: '2dadwadwa',
    })).rejects.toBeInstanceOf(AppError)
  });
});
