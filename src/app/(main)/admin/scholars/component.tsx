'use client'

import Table, { TableColumnProps } from "@app/components/tables"

const columns: TableColumnProps[] = [
  {
    label: 'Student Name',
    field: 'name',
    sortable: true,
    searchable: true
  },
  {
    label: 'School',
    field: 'school',
    sortable: true,
    searchable: true
  },
  {
    label: 'Contact #',
    field: 'mobileNo',
    sortable: true,
    searchable: true
  },
  {
    label: 'Email',
    field: 'email',
    sortable: true,
    searchable: true
  },
  {
    label: 'Action',
    field: 'action',
    render(row: any) {
      return row?.status
    }
  }
]

export default function ScholarListPage() {
  return (
    <div className="p-6">
      <div className="text-4xl uppercase py-4 border-b-3 border-black text-black font-[700]">
        SCHOLARSHIP STATUS
      </div>
      <div className="py-2 font-[500] text-[15px] leading-[19px]">
        You can view and update the status.
      </div>
      <div className="w-full font-[500] text-[15px] min-w-[500px] text-black">
        <Table columns={columns} data={[]} searchable />
      </div>
    </div>
  )
}