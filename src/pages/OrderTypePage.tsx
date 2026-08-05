import { useNavigate } from "react-router-dom";
import { PageShell } from "../components/ui";
import { OrderTypeSelector } from "../components/OrderTypeSelector";
import type { OrderType } from "../types";

export default function OrderTypePage() {
  const navigate = useNavigate();

  const handleSelect = (orderType: OrderType) => {
    navigate("/menu", { state: { orderType } });
  };

  return (
    <PageShell>
      <OrderTypeSelector onSelect={handleSelect} />
    </PageShell>
  );
}