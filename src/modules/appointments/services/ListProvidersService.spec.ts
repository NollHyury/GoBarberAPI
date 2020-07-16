import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersReposity';
import ListProvidersService from './ListProvidersService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    listProvidersService = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Quat',
      email: 'johndoe321@test.com',
      password: '123456',
    });

    await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'johndo212e@test.com',
      password: '123456',
    });

    const logedUser = await fakeUsersRepository.create({
      name: 'John Cinq',
      email: 'johndo212323e@test.com',
      password: '123456',
    });

    const providers = await listProvidersService.execute({
      user_id: logedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
