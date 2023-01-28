import React from 'react';
import cn from 'classnames';

type Props = {
  columnNames: string[];
  rows: React.ReactNode[][];
  className?: string;
  emptyMessage?: string;
};

export default function Table({
  columnNames,
  rows,
  className,
  emptyMessage = 'No data to show',
}: Props) {
  if (rows.length === 0)
    return <div className={cn('text-lg', className)}>{emptyMessage}</div>;

  return (
    <table
      className={cn(
        'min-w-max w-full table-auto border border-gray-200',
        className,
      )}
    >
      <thead>
        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          {columnNames.map((name, i) => (
            <th key={i} className="py-3 px-6 text-left">
              {name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {rows.map((row, i) => (
          <tr
            key={i}
            className={
              i % 2
                ? 'border-b border-gray-200'
                : 'border-b border-gray-200 bg-gray-100'
            }
          >
            {row.map((cell, i) => (
              <td key={i} className="py-3 px-6">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
