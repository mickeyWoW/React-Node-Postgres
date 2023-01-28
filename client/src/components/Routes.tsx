import React from 'react';
import { useCurrentAdmin } from 'components/Admin/service';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from 'routes';
import AuthLayout from 'components/Admin/Auth/Layout';
import Layout from 'components/Layout/Layout';
import LoginPage from 'components/Admin/Auth/LoginPage';
import RegisterPage from 'components/Admin/Auth/RegisterPage';
import RegistrationSuccessPage from 'components/Admin/Auth/RegistrationSuccessPage';
import ResetPasswordPage from 'components/Admin/Auth/ResetPasswordPage';
import PodsIndexPage from 'components/Pods/IndexPage';
import PodsNewPage from 'components/Pods/NewPage';
import PodsShowPage from 'components/Pods/ShowPage';
import MakersIndexPage from 'components/Makers/IndexPage';
import MakersShowPage from 'components/Makers/ShowPage';
import WorkOrdersIndexPage from 'components/WorkOrders/IndexPage';
import WorkOrdersNewPage from 'components/WorkOrders/NewPage';
import WorkOrdersShowPage from 'components/WorkOrders/ShowPage';
import ReviewTasksIndexPage from 'components/Tasks/ReviewPage';

function AuthRoutes() {
  return (
    <AuthLayout>
      <Switch>
        <Route path={routes.login} component={LoginPage} />
        <Route path={routes.register} component={RegisterPage} />
        <Route
          path={routes.registrationSuccess}
          component={RegistrationSuccessPage}
        />
        <Route path={routes.resetPassword} component={ResetPasswordPage} />
        <Redirect to={routes.login} />
      </Switch>
    </AuthLayout>
  );
}

function AdminRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path={routes.pods.index} exact component={PodsIndexPage} />
        <Route path={routes.pods.new} exact component={PodsNewPage} />
        <Route path={routes.pods.show()} component={PodsShowPage} />
        <Route path={routes.makers.index} exact component={MakersIndexPage} />
        <Route path={routes.makers.show()} component={MakersShowPage} />
        <Route
          path={routes.reviewTasks.index}
          exact
          component={ReviewTasksIndexPage}
        />
        <Route
          path={routes.workOrders.index}
          exact
          component={WorkOrdersIndexPage}
        />
        <Route
          path={routes.workOrders.new}
          exact
          component={WorkOrdersNewPage}
        />
        <Route path={routes.workOrders.show()} component={WorkOrdersShowPage} />
        <Redirect to={routes.workOrders.index} exact />
      </Switch>
    </Layout>
  );
}

export default function Routes() {
  const admin = useCurrentAdmin();

  return admin ? <AdminRoutes /> : <AuthRoutes />;
}
