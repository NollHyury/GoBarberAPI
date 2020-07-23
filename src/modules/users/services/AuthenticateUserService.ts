import authConfig from '@config/auth';
import {injectable, inject} from 'tsyringe';
import {sign} from 'jsonwebtoken';
import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User'
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';


interface IRequest {
  email : string;
  password: string;
}

interface IResponse{
  user : User;
  token: string;
}

@injectable()
export default class AuthenticateUserService{
  constructor(
    @inject('UsersRepository')
    private usersRepository : IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    ){}

  public async execute({email, password} : IRequest) :Promise<IResponse>{

    const user = await this.usersRepository.findByEmail(email)

    if(!user){
      throw new AppError('Incorrect email/password combination.',401);
    }

    const passwordMatched = await this.hashProvider.compareHash(password, user.password);

    if(!passwordMatched){
      throw new AppError('Incorrect email/password combination.', 401);
    }

    delete user.password;

    if(!authConfig.jtw.secret)
      throw new AppError('Auth jwt secret is unavailable',501)

    const token = sign({},authConfig.jtw.secret,{
      subject: user.id,
      expiresIn: authConfig.jtw.expiresIn,
    });

    return {
      user,
      token,
    }
  }
}
