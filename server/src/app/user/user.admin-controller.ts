import { adminHandler } from 'lib/requestHandler';
import * as service from 'app/user/user.service';
import { number, object } from 'lib/yup';

export const getUsers = adminHandler({}, async (req, res) => {
  const query = service.buildUsersQuery({
    select: [
      'id',
      'name',
      'podName',
      'activeWorkOrder',
      'onTimeCompletionPercentage',
    ],
  });
  const users = await query.getRawMany();
  res.json(users);
});

export const getUserById = adminHandler(
  {
    params: object({
      id: number().required(),
    }),
  },
  async (req, res) => {
    const query = service.buildUsersQuery({
      id: req.params.id,
      select: [
        'id',
        'phone',
        'email',
        'createdAt',
        'name',
        'podName',
        'address',
        'onTimeCompletionPercentage',
        'totalUnitsCompleted',
        'totalTasksCompleted',
        'activeTask',
        'pastTasks',
      ],
    });

    const maker = await query.getRawOne();
    res.json(maker);
  },
);
