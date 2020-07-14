import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { injectable, inject } from 'tsyringe';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_passWord?: string;
  password?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, name, user_id, password, old_passWord}: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if(!user){
      throw new AppError('user non-exist.')
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id){
      throw new AppError('email already in use.')
    }


    user.name = name;
    user.email = email;

    if(password && !old_passWord){
      throw new AppError('You need to inform the old password to set a new password')
    }

    if(password && old_passWord){
      const checkOldPassword = await this.hashProvider.compareHash(old_passWord, user.password);

      if(!checkOldPassword){
        throw new AppError('Old password does not match.')
      }

      user.password = await this.hashProvider.generateHash(password)
    }

    return this.usersRepository.save(user);
  }
}
