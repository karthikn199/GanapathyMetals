import { useState, forwardRef, useImperativeHandle } from 'react';

const ConfirmModal = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: 'Confirm Action',
    message: 'Are you sure you want to perform this action?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {},
  });

  useImperativeHandle(ref, () => ({
    open: (customConfig) => {
      setConfig({ ...config, ...customConfig });
      setIsOpen(true);
    },
    close: () => setIsOpen(false),
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">{config.title}</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{config.message}</p>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            onClick={() => {
              config.onConfirm();
              setIsOpen(false);
            }}
          >
            {config.confirmText}
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={() => setIsOpen(false)}
          >
            {config.cancelText}
          </button>
        </div>
      </div>
    </div>
  );
});

ConfirmModal.displayName = 'ConfirmModal';

export default ConfirmModal;