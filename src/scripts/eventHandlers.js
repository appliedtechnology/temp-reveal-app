import { isCurrentUrlPrintUrl } from "./utils";

export const initEventHandlers = () => {
  window.onload = function onload() {
    if (isCurrentUrlPrintUrl()) {
      window.print();
    }
  };

  window.onafterprint = function () {
    window.close();
  };

  let shiftShiftTimer;
  let shiftCount = 0;
  window.addEventListener('keyup', (ev) => {
    if (ev.code !== 'ShiftLeft') {
      return;
    }
    shiftCount++;
    if (shiftShiftTimer) {
      clearTimeout(shiftShiftTimer);
    }
    shiftShiftTimer = setTimeout(() => {
      if (shiftCount === 2) {
        window.location.href = `${window.location.origin}/search`;
      }
      shiftCount = 0;
    }, 500);
  });
  const openTabForPrint = () => {
    const newUrl = `${window.location.origin}/search?print-pdf/${window.location.hash}`;
    window.open(newUrl, "_blank").focus();
  };

  document
    .querySelector(".background__salt-logo")
    .addEventListener("click", openTabForPrint);
}