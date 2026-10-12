/** An update in the customer's notification center (L2-030). */
export interface CustomerNotification {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly createdAt: string;
  readonly read: boolean;
  /** An app path for the related owned destination, or null. */
  readonly link: string | null;
}

interface NotificationRecord {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly createdAt: Date;
  readonly readAt: Date | null;
  readonly link: string | null;
}

export function toCustomerNotification(record: NotificationRecord): CustomerNotification {
  return {
    id: record.id,
    title: record.title,
    body: record.body,
    createdAt: record.createdAt.toISOString(),
    read: record.readAt !== null,
    link: record.link,
  };
}
