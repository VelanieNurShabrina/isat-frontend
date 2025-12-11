import smsPdu from "sms-pdu";

export function generatePDU(destination, message) {
  const pdu = smsPdu.toPdu(message, destination);

  return {
    pdu: pdu.pdu,
    length: pdu.length
  };
}
