//API
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const getPatientInfoById = async function (loginToken, patientId) {
  try {
    let options = {
      url: `${process.env.REACT_APP_API_HOST}/patients/${patientId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};

export const getHistoryListByPatientId = async function (patientId) {
  try {
    let options = {
      url: `${process.env.REACT_APP_API_HOST}/purchase_histories/?patient_id=${patientId}`,
      method: "GET",
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};

export const getHistoryStatus = async function (documentKey) {
  try {
    let options = {
      url: `${process.env.REACT_APP_API_HOST}/purchase_histories/?documentKey=${documentKey}`,
      method: "GET",
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};

export const getAuditLog = async function (fullDocumentId) {
  try {
    let options = {
      // url: `${process.env.REACT_APP_API_HOST}/audits/?focus=/merchant/cancel/${fullDocumentId}&action=POST`,
      url: `${process.env.REACT_APP_API_HOST}/audits/?focus=/merchant/cashless-cancel/${fullDocumentId}&action=POST`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_ADMIN_TOKEN}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};

export const getIosAuditLog = async function (fullDocumentId) {
  try {
    let options = {
      url: `${process.env.REACT_APP_API_HOST}/audits/?focus=/ios-iap-consumable/cancel/${fullDocumentId}&action=POST`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_ADMIN_TOKEN}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};

export const getAndroidAuditLog = async function (fullDocumentId) {
  try {
    let options = {
      url: `${process.env.REACT_APP_API_HOST}/audits/?focus=/android-iap-consumable/cancel/${fullDocumentId}&action=POST`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_ADMIN_TOKEN}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};

export const getTreatmentByPatientId = async function (loginToken, patientId) {
  try {
    let options = {
      url: `${process.env.REACT_APP_API_HOST}/treatment_appointments/?patient_id=${patientId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};

export const getTreatmentInformation = async function (
  loginToken,
  appointmentId
) {
  try {
    let options = {
      url: `${process.env.REACT_APP_API_HOST}/treatment_appointments/${appointmentId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};

export const getTreatmentResults = async function (loginToken, treatmentId) {
  try {
    let options = {
      url: `${process.env.REACT_APP_API_HOST}/treatments/?treatment_appointment_id=${treatmentId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};

export const getInvoiceInformation = async function (loginToken, biddingId) {
  try {
    let options = {
      url: `${process.env.REACT_APP_API_HOST}/invoices/?bidding_id=${biddingId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};

export const cancelTreatmentAppointment = async function (purchaseId, tid) {
  try {
    let options = {
      url: `${process.env.REACT_APP_API_HOST}/merchant/cancel/${purchaseId}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_ADMIN_TOKEN}`,
      },
      data: {
        tid: tid,
        msg: "의사의 진료 취소 요청",
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};

// [!PROMOTION] 0원 결제 취소부
export const cancelCashlessTreatmentAppointment = async function (purchaseId) {
  try {
    let options = {
      url: `${process.env.REACT_APP_API_HOST}/merchant/cashless-cancel/${purchaseId}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_ADMIN_TOKEN}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};

export const cancelIosPurchase = async function (purchaseId) {
  try {
    let options = {
      url: `${process.env.REACT_APP_API_HOST}/ios-iap-consumable/cancel/${purchaseId}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_ADMIN_TOKEN}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};

export const cancelAndroidPurchase = async function (purchaseId) {
  try {
    let options = {
      url: `${process.env.REACT_APP_API_HOST}/android-iap-consumable/cancel/${purchaseId}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_ADMIN_TOKEN}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};

export const getTreatmentDraft = async function (loginToken) {
  try {
    let options = {
      url: `${process.env.REACT_APP_API_HOST}/treatment-drafts`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};

export const editTreatmentDraft = async function (loginToken, draftId, data) {
  try {
    let options = {
      url: `${process.env.REACT_APP_API_HOST}/treatment-drafts/${draftId}`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
      data: data,
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};

export const submitTreatmentDraft = async function (
  loginToken,
  treatmentId,
  data
) {
  try {
    let options = {
      url: `${
        process.env.REACT_APP_API_HOST
      }/treatment_appointments/${treatmentId}/treatment_drafts/${uuidv4()}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
      data: data,
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};

export const submitTreatment = async function (loginToken, treatmentId, data) {
  try {
    let options = {
      url: `${
        process.env.REACT_APP_API_HOST
      }/treatment_appointments/${treatmentId}/treatments/${uuidv4()}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
      data: data,
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};

export const findDeases = async function (text) {
  try {
    let options = {
      url: `${process.env.REACT_APP_API_HOST}/diseases?search=${text}`,
      method: "GET",
    };
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error.response;
  }
};
