export const billStatus = {
  NOTPAID: 'Not Paid',
  PARTIALLY_PAID: 'Partially Paid',
  PAID: 'Fully Paid',
  ONHOLD: 'On Hold',
  CANCELLED: 'Cancelled',
  DELETED: 'Deleted'
};

export const invoiceStatus = {
  NOTPAID: 'Not Paid',
  PARTIALLY_PAID: 'Partially Paid',
  PAID: 'Fully Paid',
  ONHOLD: 'On Hold',
  CANCELLED: 'Cancelled',
  DELETED: 'Deleted'
};

export function statusColors(status) {
  const colors = {
    NOTPAID: 'danger',
    PARTIALLY_PAID: 'warning',
    PAID: 'success',
    ONHOLD: 'primary',
    CANCELLED: 'secondary',
    DELETED: 'dark'
  };

  let color;
  switch (status) {
    case 'Not Paid':
      color = colors.NOTPAID;
      break;
    case 'Partially Paid':
      color = colors.PARTIALLY_PAID;
      break;
    case 'Fully Paid':
      color = colors.PAID;
      break;
    case 'On Hold':
      color = colors.ONHOLD;
      break;
    case 'Cancelled':
      color = colors.CANCELLED;
      break;
    case 'Deleted':
      color = colors.DELETED;
      break;
    default:
      break;
  }
  return color;
}
