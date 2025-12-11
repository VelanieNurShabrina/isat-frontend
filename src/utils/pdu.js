import { Submit } from "sms-pdu-node";

// Destination wajib format internasional +62...
export function generatePDU(destination, message) {

  // SMSC null → library akan pakai 00 (default)
  const pdu = new Submit(
    destination,
    message,
    null   // penting! BUKAN getSMSC()
  );

  return {
    pdu: pdu.hex,
    length: pdu.tpduLength
  };
}
