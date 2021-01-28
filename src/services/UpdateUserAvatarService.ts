import {getRepository} from 'typeorm';
import path from 'path';
import User from '../models/User';
import uploadConfig from '../config/upload';
import fs from 'fs';

interface Request{
    user_id: string,
    avatarFileName: string
}

class UpdateUserAvatarService{
    public async execute({user_id, avatarFileName}:Request): Promise<User>{
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(user_id);

        if(!user){
            throw new Error('Only authenticated users can change avatar');
        }

        if(user.avatar){
            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
            const userAvatarFileExist = await fs.promises.stat(userAvatarFilePath);

            if(userAvatarFileExist){
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFileName;
        await usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;