'use client'

import axios from '@/axios'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Sale } from './Sale'
import ModalEdit from './Modals'

const SaleTable = () => {
  const [sales, setSales] = useState<Sale[]>([])
  const [records, setRecords] = useState(sales)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saleId, setSaleId] = useState<number | null>(null)

  const columns = [
    { name: 'Total', selector: (row: any) => row.total, sortable: true },
    {
      name: 'Fecha',
      selector: (row: any) => row.createdAt,
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row: any) => (
        <div className="flex justify-center space-x-2">
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={() => handleEdit(row.id)}
          >
            Editar
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded"
            onClick={() => {
              handleDelete(row.id)
            }}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ]

  const handleEdit = (id: number) => {
    setSaleId(id)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta venta?')) {
      axios.delete(`/sale/${id}`).then(() => {
        setSales(sales.filter((sale) => sale.id !== id))
      })
    }
  }

  useEffect(() => {
    axios.get('/sale').then(({ data }) => {
      setSales(data)
    })
  }, [])

  return (
    <>
      <DataTable
        title="Ventas"
        columns={columns}
        data={records}
        pagination
        highlightOnHover
        pointerOnHover
        onSelectedRowsChange={({ selectedRows }) => setRecords(selectedRows)}
      />
      <ModalEdit
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSaleId(null)
        }}
        saleId={saleId}
      />
    </>
  )
}

export default SaleTable