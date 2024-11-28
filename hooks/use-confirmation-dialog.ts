import { useState } from 'react';

export function useConfirmationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [onConfirm, setOnConfirm] = useState<(() => Promise<void> | void) | null>(null);

  const openDialog = (confirmAction: () => Promise<void> | void) => {
    setOnConfirm(() => confirmAction);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const handleConfirm = async () => {
    if (onConfirm) {
      setIsLoading(true);
      try {
        await onConfirm();
      } catch (error) {
        console.error('Confirmation action failed:', error);
      } finally {
        setIsLoading(false);
        closeDialog();
      }
    }
  };

  return {
    isOpen,
    isLoading,
    openDialog,
    closeDialog,
    handleConfirm,
  };
}
