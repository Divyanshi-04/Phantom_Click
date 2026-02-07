import axios from "axios";

const NODE_BASE =
  import.meta.env.VITE_NODE_API || "http://localhost:5000";

const PYTHON_BASE =
  import.meta.env.VITE_PYTHON_API || "http://localhost:8001";


export const nodeApi = axios.create({
  baseURL: NODE_BASE,
});

export const pythonApi = axios.create({
  baseURL: PYTHON_BASE,
  timeout: 120000,
});


export const analyzeSite = async (url) => {
  console.log("URL:", url);

  const res = await nodeApi.post("/api/analyze", { url });
  console.log(res.data);

  return res;
}

export const buildReplay = async (report) => {
  const res = await nodeApi.post("/api/replay/build", report);
  return res.data;
};


export const uploadStage1Image = async (formData) => {
  const res = await pythonApi.post("/stage1/ocr", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};


export const analyzeUrlStage2 = async (url, session_id = null) => {
  const res = await pythonApi.post("/stage2/analyze-url", {
    url,
    session_id,
  });

  return res.data.stage2_output;
};

export const generateForensicReport = async (data) => {
  const res = await nodeApi.post("/api/analyze/generate-report", data);
  return res.data;
};
