import { Router } from 'express';
import Resource from './Resource';
import { authorize } from '../user';
import files from './files';

const router = new Router();
export default router;

router.use(authorize());

router.use('/rooms', new Resource('room', 'rooms', {
    filter: data => ({
        ...data,
        password: Boolean(data.password),
    }),
}).initialize());

router.use('/files', files);
