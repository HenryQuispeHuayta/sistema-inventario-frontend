"use client";
import axios from "@/axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Product } from "./Product";
import ModalEdit from "./Modals";

const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [records, setRecords] = useState(products);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState<number | null>(null);

  const columns = [
    { name: "Código", selector: (row: any) => row.code, sortable: true },
    { name: "Nombre", selector: (row: any) => row.name, sortable: true },
    {
      name: "Descripción",
      selector: (row: any) => row.description,
      sortable: true,
    },
    { name: "Cantidad", selector: (row: any) => row.stock, sortable: true },
    {
      name: "Precio de Compra",
      selector: (row: any) => row.pricePurchase,
      sortable: true,
    },
    {
      name: "Precio de Venta",
      selector: (row: any) => row.priceSale,
      sortable: true,
    },
    {
      name: "Actualizado",
      selector: (row: any) => row.updatedAt,
      sortable: true,
    },
    {
      name: "Acciones",
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
              handleDelete(row.id);
            }}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/product");
        const updatedProducts = data.map((product: Product) => {
          return {
            ...product,
            updatedAt: formatDateTime(product.updatedAt),
          };
        });
        setProducts(updatedProducts);
        setRecords(updatedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formatDateTime = (dateTimeString: string) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString();
  };

  const handleFilter = (e: any) => {
    const newData = products.filter((product) => {
      return product.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setRecords(newData);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/product/${id}`);
      const newProducts = products.filter((product) => product.id !== id);
      setProducts(newProducts);
      setRecords(newProducts);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (id: number) => {
    setIsModalOpen(true);
    setProductId(id);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lista de Productos</h1>
      <div>
        <input
          type="text"
          placeholder="Buscar por nombre"
          className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          onChange={handleFilter}
        />
      </div>
      <ModalEdit
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
      />
      <DataTable
        columns={columns}
        data={records}
        pagination
        highlightOnHover
        pointerOnHover
        noHeader
        defaultSortAsc={false}
        progressPending={products.length === 0}
        progressComponent={<h2>Cargando...</h2>}
        noDataComponent={<h2>No hay datos</h2>}
      />
    </div>
  );
};

export default ProductTable;
