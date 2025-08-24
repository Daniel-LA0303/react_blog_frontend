import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const classes = {
  success: { popup: 'swal-popup-success', title: 'swal-title-success', confirmButton: 'swal-btn-success' },
  error: { popup: 'swal-popup-error', title: 'swal-title-error', confirmButton: 'swal-btn-error' },
  warning: { popup: 'swal-popup-warning', title: 'swal-title-warning', confirmButton: 'swal-btn-warning' }
};

export const useSwal = () => {

  // Modal que desaparece solo
  const showAutoSwal = ({ message, status = "success", timer = 2000 }) => {
    Swal.fire({
      title: message,
      icon: status,
      showConfirmButton: false,
      timer,
      timerProgressBar: true,
      customClass: classes[status],
      buttonsStyling: false,
    });
  };

  // Modal con botón de confirmación
  const showConfirmSwal = ({ message, status = "warning", confirmButton = true }) => {
    return Swal.fire({
      title: message,
      icon: status,
      showConfirmButton: confirmButton,
      customClass: classes[status],
      buttonsStyling: false,
    });
  };

  return { showAutoSwal, showConfirmSwal };

};
