import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import isWeekend from "../scripts/utils/dates.js";

export const deliveryOptions = [
  {
    id: "1",
    deliveryDays: 7,
    priceCents: 0,
  },
  {
    id: "2",
    deliveryDays: 3,
    priceCents: 499,
  },
  {
    id: "3",
    deliveryDays: 1,
    priceCents: 999,
  },
];

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  return deliveryOption;
}

export function calculateDeliveryDate(deliveryOption) {
  const today = dayjs();
  const { deliveryDays } = deliveryOption;

  let i = 0;
  let deliveryDate = today;

  while (i < deliveryDays) {
    deliveryDate = deliveryDate.add(1, "days");

    if (isWeekend(deliveryDate)) continue;
    i++;
  }

  return deliveryDate;
}