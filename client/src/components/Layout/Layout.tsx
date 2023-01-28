import React from 'react';
import { setCurrentAdmin } from 'components/Admin/service';
import { NavLink } from 'react-router-dom';
import routes from 'routes';

const menuClass =
  'border-t border-b border-gray-700 py-2 px-4 transition duration-200 hover:bg-blue-100';
const firstMenuClass = `${menuClass} border-l`;
const lastMenuClass = `${menuClass} border-r`;
const menuActiveClass = 'bg-blue-500 text-white hover:bg-blue-500';

export default function Layout({ children }: { children: React.ReactNode }) {
  const logOut = () => setCurrentAdmin();

  return (
    <div className="h-full flex flex-col items-center">
      <button
        className="link absolute top-0 right-0 mt-5 mr-5"
        onClick={logOut}
      >
        Log Out
      </button>
      <div className="mt-5 mb-8">
        <NavLink
          to={routes.pods.index}
          className={firstMenuClass}
          activeClassName={menuActiveClass}
        >
          Pods
        </NavLink>
        <NavLink
          to={routes.makers.index}
          className={menuClass}
          activeClassName={menuActiveClass}
        >
          Makers
        </NavLink>
        <NavLink
          to={routes.workOrders.index}
          className={menuClass}
          activeClassName={menuActiveClass}
        >
          Work Orders
        </NavLink>
        <NavLink
          to={routes.reviewTasks.index}
          className={lastMenuClass}
          activeClassName={menuActiveClass}
        >
          Review Tasks
        </NavLink>
      </div>
      <div className="w-full h-full overflow-auto pb-10">
        <div className="max-w-5xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
