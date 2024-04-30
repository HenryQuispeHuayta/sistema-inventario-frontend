import axios from "@/axios";
import { useState, useEffect } from "react";
import { Sale } from "./Sale";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  saleId: number | null;
}

const ModalEdit: React.FC<ModalProps> = ({ isOpen, onClose, saleId }) => {
  const [sale, setSale] = useState<Sale | null>(null);

  useEffect(() => {
    const fetchSale = async () => {
      if (saleId) {
        try {
          const { data } = await axios.get(`/sale/${saleId}`);
          setSale(data);
        } catch (error) {
          console.error("Error fetching sale:", error);
        }
      }
    };

    fetchSale();
  }, [saleId]);

  if (!isOpen) {
    return null;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(`/sale/${saleId}`, {
        total: sale?.total,
      });
      onClose();
    } catch (error) {
      return new Error("Error updating sale:", error as Error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded">
        <h2>Editar Venta</h2>
        {sale && (
          <>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-2">
                <label>
                  Total:
                  <input type="text" value={sale.total} disabled />
                </label>
                <button type="submit">Guardar</button>
              </div>
            </form>
          </>
        )}
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ModalEdit;
