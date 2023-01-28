import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePodQuery } from 'components/Pods/service';
import Spinner from 'components/Common/Spinner';
import routes from 'routes';
import Table from 'components/Common/Table';
import { formatWorkOrderName } from 'components/WorkOrders/service';

export default function ShowPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = usePodQuery(parseInt(id));

  if (isLoading) return <Spinner />;

  if (!data) return null;

  return (
    <>
      <h1 className="text-2xl text-center mb-8">{data.name} Pod</h1>
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl">Active Work Orders</h1>
        <Link to={routes.workOrders.index} className="btn-primary-flat">
          View All
        </Link>
      </div>
      <Table
        columnNames={[
          'Pod',
          'Work Order',
          '# Ordered',
          '# Complete',
          'Actions',
        ]}
        rows={data.activeWorkOrders.map((item, i) => [
          data.name,
          item.name,
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
      <div className="flex justify-between mt-10 mb-8">
        <h1 className="text-2xl">Makers</h1>
      </div>
      <Table
        columnNames={['Name', 'Work Order', 'Actions']}
        rows={data.makers.map((item, i) => [
          item.name,
          formatWorkOrderName(item.activeWorkOrder),
          <Link
            to={routes.makers.show(item.id)}
            key={i}
            className="btn-primary-flat"
          >
            View
          </Link>,
        ])}
      />
    </>
  );
}
