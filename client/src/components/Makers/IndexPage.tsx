import React from 'react';
import { useMakersQuery } from 'components/Makers/service';
import { Link } from 'react-router-dom';
import routes from 'routes';
import Spinner from 'components/Common/Spinner';
import Table from 'components/Common/Table';
import { formatWorkOrderName } from 'components/WorkOrders/service';

export default function IndexPage() {
  const { data, isLoading } = useMakersQuery();

  return (
    <>
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl">Makers</h1>
      </div>
      {isLoading && <Spinner />}
      {!isLoading && data && (
        <Table
          columnNames={[
            'Name',
            'Pod',
            'Work Order',
            'On Time Completion %',
            'Actions',
          ]}
          rows={data.map((item, i) => [
            item.name,
            item.podName,
            formatWorkOrderName(item.activeWorkOrder),
            item.onTimeCompletionPercentage
              ? `${item.onTimeCompletionPercentage}%`
              : 'N/A',
            <Link
              to={routes.makers.show(item.id)}
              key={i}
              className="btn-primary-flat"
            >
              View
            </Link>,
          ])}
        />
      )}
    </>
  );
}
