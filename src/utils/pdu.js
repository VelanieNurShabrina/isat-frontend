// pdu.js
import { PDU } from "node-pdu";

export function generatePDU(destination, message) {
  // PDU-SUBMIT
  const sms = PDU.Submit({
    receiver: destination,
    text: message
  });

  return {
    pdu: sms.hex,
    length: sms.getTpduLength()
  };
}
