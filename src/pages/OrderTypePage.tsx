import { useNavigate, useLocation } from "react-router-dom";
import { PageShell } from "../components/ui";
import { OrderTypeSelector } from "../components/OrderTypeSelector";
import type { OrderType } from "../types";

export default function OrderTypePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const tableFromQr = location.state?.tableNumber || null;

  const handleSelect = (orderType: OrderType) => {
    navigate("/menu", { state: { orderType, tableNumber: tableFromQr } });
  };

  return (
    <PageShell>
      <OrderTypeSelector onSelect={handleSelect} />
    </PageShell>
  );
}