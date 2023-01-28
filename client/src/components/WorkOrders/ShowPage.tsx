import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useWorkOrderQuery } from 'components/WorkOrders/service';
import Spinner from 'components/Common/Spinner';
import dayjs from 'dayjs';
import Table from 'components/Common/Table';
import routes from 'routes';

export default function ShowPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useWorkOrderQuery(parseInt(id));

  if (isLoading) return <Spinner />;

  if (!data) return null;

  return (
    <>
      <div className="border border-gray-400 px-5 py-2 flex text-lg mb-10">
        <div className="w-1/2">
          <div className="py-1">
            <b className="inline-block mr-2 w-36">Product Name:</b>
            {data.name}
          </div>
          <div className="py-1">
            <b className="inline-block mr-2 w-36">Start Date:</b>
            {dayjs(data.createdAt).format('M/D/YY')}
          </div>
          <div className="py-1">
            <b className="inline-block mr-2 w-36">SKU:</b>
            {data.productSku}
          </div>
          <div className="py-1">
            <b className="inline-block mr-2">Time Estimate / Item:</b>
            {data.timeEstimateMin} - {data.timeEstimateMax} minutes
          </div>
        </div>
        <div className="w-1/2">
          <div className="py-1 text-right">
            <b className="mr-2">Pod:</b>
            <div className="inline-block w-16">{data.podName}</div>
          </div>
          <div className="py-1 text-right">
            <b className="mr-2">Progress:</b>
            <div className="inline-block w-16">
              {data.completedQuantity} / {data.totalQuantity}
            </div>
          </div>
          <div className="py-1 text-right">
            <b className="mr-2">Payment / Per Item:</b>
            <div className="inline-block w-16">${data.paymentTerms}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl">Work Order Makers</h1>
      </div>
      <Table
        className="mb-10"
        columnNames={['Name', '# Claimed', '# Complete', 'Actions']}
        rows={data.makers.map((item) => [
          item.name,
          item.claimedQuantity,
          item.completedQuantity,
          <Link
            key={0}
            to={routes.makers.show(item.id)}
            className="btn-primary-flat"
          >
            View
          </Link>,
        ])}
      />
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl">Work Order Instructions</h1>
      </div>
      <div className="text-lg">
        <p className="mb-2">
          <b className="mr-2">Instructions PDF:</b>
          {data.instructionsPdfLink}
        </p>
        <p className="mb-2">
          <b className="mr-2">Video Instructions:</b>
          {data.instructionsVideoLink}
        </p>
        <p className="mb-2">
          <b className="mr-2">Post Signup Instructions:</b>
          {data.postSignupInstructions}
        </p>
      </div>
    </>
  );
}
