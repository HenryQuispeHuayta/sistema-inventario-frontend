import React, { useEffect, useState } from "react";
import { Product, ProductEdit } from "./Product";
import axios from "@/axios";
import { set } from "firebase/database";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number | null;
}

const ModalEdit: React.FC<ModalProps> = ({ isOpen, onClose, productId }) => {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          const { data } = await axios.get(`/product/${productId}`);
          setProduct(data);
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
    };

    fetchProduct();
  }, [productId]);

  if (!isOpen) {
    return null;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(`/product/${productId}`, {
        stock: product?.stock,
        pricePurchase: product?.pricePurchase,
        priceSale: product?.priceSale,
      });
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded">
        <h2>Editar Producto</h2>
        {product && (
          <>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-2">
                <label>
                  Código:
                  <input type="text" value={product.code} disabled />
                </label>
                <label>
                  Nombre:
                  <input type="text" value={product.name} disabled />
                </label>
                <label>
                  Descripción:
                  <input type="text" value={product.description} disabled />
                </label>
                <label>
                  Stock:
                  <input
                    type="number"
                    value={product.stock}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        stock: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Precio de compra:
                  <input
                    type="number"
                    value={product.pricePurchase}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        pricePurchase: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Precio de venta:
                  <input
                    type="number"
                    value={product.priceSale}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        priceSale: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Guardar
                </button>
              </div>
            </form>
          </>
        )}
        <button className="bg-red-500 text-white p-2 rounded" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalEdit;
