import Swal, { SweetAlertIcon, SweetAlertResult } from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

type Status = "success" | "error" | "warning";

type SwalOptions = {
  message: string;
  status?: Status;
};

type AutoSwalOptions = SwalOptions & {
  timer?: number;
};

type ConfirmSwalOptions = SwalOptions & {
  confirmButton?: boolean;
};

const classes: Record<
  Status,
  { popup: string; title: string; confirmButton: string }
> = {
  success: {
    popup: "swal-popup-success",
    title: "swal-title-success",
    confirmButton: "swal-btn-success",
  },
  error: {
    popup: "swal-popup-error",
    title: "swal-title-error",
    confirmButton: "swal-btn-error",
  },
  warning: {
    popup: "swal-popup-warning",
    title: "swal-title-warning",
    confirmButton: "swal-btn-warning",
  },
};

export const useSwal = () => {
  const showAutoSwal = ({
    message,
    status = "success",
    timer = 2000,
  }: AutoSwalOptions): void => {
    Swal.fire({
      title: message,
      icon: status as SweetAlertIcon,
      showConfirmButton: false,
      timer,
      timerProgressBar: true,
      customClass: classes[status],
      buttonsStyling: false,
    });
  };

  const showConfirmSwal = ({
    message,
    status = "warning",
    confirmButton = true,
  }: ConfirmSwalOptions): Promise<SweetAlertResult> => {
    return Swal.fire({
      title: message,
      icon: status as SweetAlertIcon,
      showConfirmButton: confirmButton,
      customClass: classes[status],
      buttonsStyling: false,
    });
  };

  return { showAutoSwal, showConfirmSwal };
};