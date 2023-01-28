import 'configure-passport';
import { Router } from 'express';
import * as user from 'app/user/user.controller';
import * as pod from 'app/pod/pod.controller';
import * as skill from 'app/skills/skill.controller';
import * as workOrder from 'app/workOrder/workOrder.controller';
import * as task from 'app/task/task.controller';
import { errorHandler } from 'errors';
import adminRouter from 'routes-admin';

const router = Router();

router.use('/api/admin', adminRouter);

/* users */
router.post('/users', user.register);
router.post('/users/login', user.login);
router.post('/users/send-reset-password-email', user.sendResetPasswordEmail);
router.post('/users/reset-password', user.resetPassword);
router.get('/users/:id', user.getUserById);
router.patch('/users/:id', user.updateUser);

/* pods */
router.get('/pods', pod.getPods);

/* skills */
router.get('/skills', skill.getSkills);
router.get('/skills/:id', skill.getSkillById);

/* work orders */
router.get('/work-orders', workOrder.getWorkOrders);
router.get('/work-orders/:id', workOrder.getWorkOrderById);

/* tasks */
router.post('/tasks', task.createTask);
router.patch('/tasks/:id', task.updateTaskById);

router.use(errorHandler);

export default router;
