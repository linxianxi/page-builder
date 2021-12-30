import { extend } from "umi-request";

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  credentials: "include",
});

request.interceptors.request.use((url, { headers, ...options }) => {
  return {
    url,
    options: {
      ...options,
      headers: {
        ...headers,
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiN2JkNGY3NTk4MmU2OWNlYTNjNGM5YmQ3ZGM3MTBlMzdhMjk2MjlmYTc3YmEwZmVjNDUzYjdmYmZjNTdkYTA5MGY3ZTUzMTgyOGIxNWZiZDEiLCJpYXQiOjE2MzE1MjQ3ODEsIm5iZiI6MTYzMTUyNDc4MSwiZXhwIjoxNjM5MzAwNzgxLCJzdWIiOiI3Iiwic2NvcGVzIjpbIioiXX0.f6oCsAZJQRnPDv_f3K0bM3ppCvRP7aWfIa4VuTnyaAJd8dLqKFgR1EVHhecz878Bck0GZaM2NYvXhc9x_jz5VoLV5bqbC_iZ8zd0xn5beFTtpawIIN9-jp5QrGcTt3XS0T2ifwmwXQT2b7pupU656_n3TPxVTANxEKuk5caJ0AM1mugQYEG3o3Bi8hP7Xn66xuXGs8Aflcd8OouxcQ1habubJqcOKiXwcWdkL--lmcLT3REB89xMcsHTMSlpnzToPYrFsA-jSAaTPJA_BQCBWsXuHLSIheQDfgkx-wrFaTl9yfU_ia2HfK-IX9wlxp-Q0XNsLP0zDLwHqCMtjAjIydZG76vM4m7bi4i61PIGnBFWY6YcmgjBlHAX-lkc8ZFmJU0zpeCy80XHwGAZp9FRjz0xqsICavBPPq539MHbnFSIM3fs5cizq2hbXCERrAuupjqzMZ_WuqMPUDdJR4BP5fHVwEofizkr20unW6Oq8EpkJ2q98l2hWN_Y6s46TDWknPfWJ5IfGkepT4GypgAflc30x60r0Xf3YS-F5BxCm-9m6yb4_DLaw4Ls9n7-9YzOR_MM6OGiexDOw85sSAx67pMa8XeQ2NmHO3ljz4UWsAcncXTBvfho0KgYWTurJO6M3IsKDe_2uTK-GTlYZ3xvt7KfFSTpAIDeD2oa7NlIw1E",
      },
    },
  };
});

export default request;
