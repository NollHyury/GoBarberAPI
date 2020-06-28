import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import CreateUserService from '@modules/users/services/CreateUserSevice';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({ name, email, password })

  delete user.password;

  response.json(user)
});

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
  const updataUserAvatar = new UpdateUserAvatarService();

  const user = await updataUserAvatar.execute({
    user_id: request.user.id,
    avatarFileName: request.file.filename,
  });

  return response.json(user)
})

export default usersRouter;
