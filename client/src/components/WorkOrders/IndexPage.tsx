import React from 'react';
import { Link } from 'react-router-dom';
import routes from 'routes';
import Spinner from 'components/Common/Spinner';
import Table from 'components/Common/Table';
import {
  formatWorkOrderName,
  useWorkOrdersQuery,
} from 'components/WorkOrders/service';

export default function IndexPage() {
  const { data, isLoading } = useWorkOrdersQuery();

  const tables = [
    { title: 'Active Work Orders', data: data?.activeWorkOrders },
    { title: 'Archived Work Orders', data: data?.archivedWorkOrders },
  ];

  return (
    <>
      {tables.map(({ title, data }, i) => (
        <div className={i !== 0 ? 'mt-10' : ''} key={i}>
          <div className="flex justify-between mb-8">
            <h1 className="text-2xl">{title}</h1>
            {i === 0 && (
              <Link to={routes.workOrders.new} className="btn-primary-outline">
                Create New Work Order
              </Link>
            )}
          </div>
          {isLoading && <Spinner />}
          {!isLoading && data && (
            <Table
              columnNames={[
                'Pod',
                'Work Order',
                '# Ordered',
                '# Complete',
                'Actions',
              ]}
              rows={data.map((item, i) => [
                item.podName,
                formatWorkOrderName(item),
                item.totalQuantity,
                item.completedQuantity,
                <Link
                  to={routes.workOrders.show(item.id)}
                  key={i}
                  className="btn-primary-flat"
                >
                  View
                </Link>,
              ])}
            />
          )}
        </div>
      ))}
    </>
  );
}
