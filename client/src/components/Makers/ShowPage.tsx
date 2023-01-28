import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMakerQuery } from 'components/Makers/service';
import Spinner from 'components/Common/Spinner';
import dayjs from 'dayjs';
import routes from 'routes';
import Table from 'components/Common/Table';

export default function ShowPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useMakerQuery(parseInt(id));

  if (isLoading) return <Spinner />;

  if (!data) return null;

  const { activeTask } = data;

  return (
    <>
      <div className="border border-gray-400 px-5 py-2 flex text-lg mb-10">
        <div className="w-1/2">
          <div className="py-1">
            <b className="mr-2">Name:</b>
            {data.name}
          </div>
          <div className="py-1">
            <b className="mr-2">Address:</b>
            {data.address}
          </div>
          <div className="py-1">
            <b className="mr-2">Phone:</b>
            {data.phone}
          </div>
          <div className="py-1">
            <b className="mr-2">Email:</b>
            {data.email}
          </div>
          <div className="py-1">
            <b className="mr-2">Sign Up Date:</b>
            {dayjs(data.createdAt).format('M/D/YY')}
          </div>
        </div>
        <div className="w-1/2 text-right">
          <div className="py-1">
            <b className="mr-2">Pod:</b>
            <div className="inline-block w-12">{data.podName}</div>
          </div>
          <div className="py-1">
            <b className="mr-2">On Time Completion %:</b>
            <div className="inline-block w-12">
              {data.onTimeCompletionPercentage}%
            </div>
          </div>
          <div className="py-1">
            <b className="mr-2">Total Units Completed:</b>
            <div className="inline-block w-12">{data.totalUnitsCompleted}</div>
          </div>
          <div className="py-1">
            <b className="mr-2">Total Tasks Completed:</b>
            <div className="inline-block w-12">{data.totalTasksCompleted}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl">Active Task</h1>
      </div>
      <Table
        className="mb-10"
        emptyMessage="No Active Task"
        columnNames={[
          'Task Name',
          '# Claimed',
          '# Complete',
          'Target End Date',
          'Actions',
        ]}
        rows={
          activeTask
            ? [
                [
                  activeTask.taskName,
                  activeTask.claimedQuantity,
                  activeTask.completedQuantity,
                  activeTask.targetEndDate,
                  <Link
                    key={0}
                    to={routes.workOrders.show(activeTask.workOrderId)}
                    className="btn-primary-flat"
                  >
                    View
                  </Link>,
                ],
              ]
            : []
        }
      />
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl">Past Tasks</h1>
      </div>
      <Table
        className="mb-10"
        emptyMessage="No Past Tasks"
        columnNames={[
          'Task Name',
          '# Claimed',
          '# Complete',
          'Completed On Time?',
          'Actions',
        ]}
        rows={data.pastTasks.map((item) => [
          item.taskName,
          item.claimedQuantity,
          item.completedQuantity,
          item.completedOnTime ? 'Yes' : 'No',
          <Link
            key={0}
            to={routes.workOrders.show(item.workOrderId)}
            className="btn-primary-flat"
          >
            View
          </Link>,
        ])}
      />
    </>
  );
}
