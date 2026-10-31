import { notifications } from '@mantine/notifications';
import { getErrorMessage } from '@/shared/api/interceptor';

/** Shows the API's error message in a red notification. */
export const notifyError = (error: unknown) =>
  notifications.show({ color: 'red', message: getErrorMessage(error) });

export const notifySuccess = (message: string) =>
  notifications.show({ color: 'green', message });
