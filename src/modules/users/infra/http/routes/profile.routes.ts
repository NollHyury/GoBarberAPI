import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ProfileController from '../controllers/ProfileController';

const usersRouter = Router();

usersRouter.use(ensureAuthenticated);

const profileController = new ProfileController();

usersRouter.put('/', profileController.update);
usersRouter.get('/',profileController.show);

export default usersRouter;
