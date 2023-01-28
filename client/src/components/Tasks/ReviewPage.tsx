import React, { useState } from 'react';
import Spinner from 'components/Common/Spinner';
import {
  useInReviewTasksQuery,
  useUpdateTaskStatusQuery,
} from 'components/Tasks/service';
import Table from 'components/Common/Table';
import dayjs from 'dayjs';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

export default function ReviewPage() {
  const { data, isLoading } = useInReviewTasksQuery();
  const { updateTask } = useUpdateTaskStatusQuery();

  const [approveId, setApproveId] = useState<number>();
  const [rejectId, setRejectId] = useState<number>();

  const closeApprove = () => setApproveId(undefined);
  const closeReject = () => setRejectId(undefined);

  const approve = () => {
    if (!approveId) return;
    updateTask({ id: approveId, status: 'Approved' });
    closeApprove();
  };

  const reject = () => {
    if (!rejectId) return;
    updateTask({ id: rejectId, status: 'Active' });
    closeReject();
  };

  return (
    <>
      <div className="flex justify-between mb-8">
        <h1 className="text-2xl">In Review Tasks</h1>
      </div>
      {isLoading && <Spinner />}
      {!isLoading && data && (
        <Table
          columnNames={[
            'Maker',
            'Work Order',
            'Completed Quantity',
            'Completed time',
            'Deadline',
            'Action',
          ]}
          rows={data.map((item, i) => [
            item.user.firstName + ' ' + item.user.lastName,
            item.workOrder.name,
            item.completedQuantity,
            dayjs(item.workOrder.endDate).format('YYYY-MM-DD'),
            item.workOrder.timeEstimateMax,
            <div key={i} className="inline-flex">
              <button
                className="btn-primary-flat mr-2"
                onClick={() => setApproveId(item.id)}
              >
                Approve
              </button>
              <button
                className="btn-danger-flat"
                onClick={() => setRejectId(item.id)}
              >
                Reject
              </button>
            </div>,
          ])}
        />
      )}
      <Modal
        classNames={{ modal: 'rounded' }}
        open={Boolean(approveId)}
        onClose={closeApprove}
        center
        showCloseIcon={false}
      >
        <div className="px-12">
          <h3 className="text-center text-2xl">Are you sure to approve?</h3>
          <div className="flex items-center justify-center mt-10">
            <button className="btn-primary mr-5" onClick={approve}>
              Approve
            </button>
            <button className="btn-secondary" onClick={closeApprove}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        classNames={{ modal: 'rounded' }}
        open={Boolean(rejectId)}
        onClose={closeReject}
        center
        showCloseIcon={false}
      >
        <div className="px-12">
          <h3 className="text-center text-2xl">Are you sure to reject?</h3>
          <div className="flex items-center justify-center mt-10">
            <button className="btn-danger mr-5" onClick={reject}>
              Reject
            </button>
            <button className="btn-secondary" onClick={closeReject}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
