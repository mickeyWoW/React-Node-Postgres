import { Migration } from 'rake-db';

export const change = (db: Migration, up: boolean) => {
  if (up)
    db.changeColumn('workOrders', 'paymentTerms', {
      type: 'numeric',
      precision: 10,
      scale: 2,
    });
  else
    db.changeColumn('workOrders', 'paymentTerms', {
      type: 'integer',
    });
};
