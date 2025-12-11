import { SmsSubmitPdu } from "sms-pdu";

export function generatePDU(destination, message) {
  // Bangun PDU SUBMIT
  const pduObj = new SmsSubmitPdu({
    receiver: destination,
    text: message,
    smsc: "+870772001799"   // SMSC Default IsatPhone
  });

  return {
    pdu: pduObj.toString(),
    length: pduObj.getTpduLength()
  };
}
