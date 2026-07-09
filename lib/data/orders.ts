import { Order } from "@/types";

export const ORDER_STEPS = [
  "Order Placed",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
] as const;

export function stepIndexForStatus(status: Order["status"]): number {
  switch (status) {
    case "Placed":
      return 0;
    case "Confirmed":
    case "Processing":
      return 1;
    case "Shipped":
      return 2;
    case "Out for Delivery":
      return 3;
    case "Delivered":
      return 4;
    default:
      return -1;
  }
}
