import 'configure-passport';
import { Router } from 'express';
import * as admin from 'app/admin/admin.admin-controller';
import * as pod from 'app/pod/pod.admin-controller';
import * as user from 'app/user/user.admin-controller';
import * as workOrder from 'app/workOrder/workOrder.admin-controller';
import * as task from 'app/task/task.admin-controller';

const router = Router();

/* admins */
router.post('/users/login', admin.login);
router.post('/users', admin.register);
router.post('/users/send-reset-password-email', admin.sendResetPasswordEmail);
router.post('/users/reset-password', admin.resetPassword);

/* pods */
router.get('/pods', pod.getPods);
router.get('/pods/:id', pod.getPodById);
router.post('/pods', pod.createPod);

/* users */
router.get('/makers', user.getUsers);
router.get('/makers/:id', user.getUserById);

/* work orders */
router.get('/work-orders', workOrder.getWorkOrders);
router.get('/work-orders/:id', workOrder.getWorkOrderById);
router.post('/work-orders', workOrder.createWorkOrder);

/* tasks */
router.get('/tasks', task.getTasks);
router.patch('/tasks/:id', task.updateTaskById);

export default router;
