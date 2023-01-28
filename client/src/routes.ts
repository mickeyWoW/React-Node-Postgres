export default {
  login: '/login',
  register: '/register',
  registrationSuccess: '/registration-success',
  resetPassword: '/reset-password',
  pods: {
    index: '/admin/pods',
    new: '/admin/pods/new',
    show: (id?: number) => `/admin/pods/${id || ':id'}`,
  },
  makers: {
    index: '/admin/makers',
    show: (id?: number) => `/admin/makers/${id || ':id'}`,
  },
  workOrders: {
    index: '/admin/work-orders',
    new: '/admin/work-orders/new',
    show: (id?: number) => `/admin/work-orders/${id || ':id'}`,
  },
  reviewTasks: {
    index: '/admin/review-tasks',
  },
};
