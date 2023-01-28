import React from 'react';
import { Link } from 'react-router-dom';
import routes from 'routes';
import Spinner from 'components/Common/Spinner';
import { usePodsQuery } from 'components/Pods/service';
import Table from 'components/Common/Table';

export default function IndexPage() {
  const { data, isLoading } = usePodsQuery();

  return (
    <>
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl">Pods</h1>
        <Link to={routes.pods.new} className="btn-primary-outline">
          Create New Pod
        </Link>
      </div>
      {isLoading && <Spinner />}
      {!isLoading && data && (
        <Table
          columnNames={['Name', 'Active Work Orders', 'Actions']}
          rows={data.map((item, i) => [
            item.name,
            item.activeWorkOrdersCount,
            <Link
              to={routes.pods.show(item.id)}
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
