import {Router, request} from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

usersRouter.post('/', async (request, response) => {
    try {
        const {name, email, password} = request.body;
        
        const createUser = new CreateUserService();

        const user = await createUser.execute({name, email, password});        

        const modelUser = {
            id: user.id,
            name,
            email,
            created_at: user.created_at,
            updated_at: user.updated_at
        }
        return response.json(modelUser);
    } catch (error) {
        return response.status(400).json({message: error.message})
    }
});

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) =>{
    try {
        console.log(request.file);
        const updateUserAvatar = new UpdateUserAvatarService();
        
        const user = await updateUserAvatar.execute({user_id: request.user.id, avatarFileName:request.file.filename});

        return response.json(user);

    } catch (error) {
        return response.status(400).json({message: error.message})
    }
});

export default usersRouter;