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
        authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiZjU5NzBmMzA3ZmZkMjhlYmRlNTJmYTI5NWNlNzExYTQ2OGRhOWZmMDFkY2M0OWU5OWFmZjMyZWZjMjQ2NDVmYjg2MThmZDc0NWMwMGI2NDciLCJpYXQiOjE2MzEwNjQwNjIsIm5iZiI6MTYzMTA2NDA2MiwiZXhwIjoxNjM4ODQwMDYyLCJzdWIiOiI0Iiwic2NvcGVzIjpbIioiXX0.KbFwz-28RqugmRkMt1qdnAZ1fMaOAIMPALVW5oisRNLVSxDWYquflTJGgrEG3cISByRyhq-a-a0hBn0FIlexrTbiXjE5SlolFDs8AVmiPqSCRaHQwTwjlpggztK706Gyibo50wZDxVaAG21rg6IaST4v8OWQv-YSTwN1LWN_L0NH2LrzYM8C9C2aIdQrhSNx7OAnDlYG9abEsLf6JxwIdP3TryHwXBqBZBGaLIrGcPMpUt_hf0qP3KRQJ2rMB4fdcco620ptJ5apGmTXqTW6YbyQ6jmkhDILsYWpi5PL9o9AxLvdWmw2EZhg2RjRCTeF0PNbJyNXgluUTAlQcN9QmSMPeN7tdyCDDVcroIKdlhJudNGBpFMCWfmSDpbKvPO-BmMcPWlROT_odJ7V-_wocIcLYyEewI8HBECrQ_kveH52_vMlgbzxAZpyUuHBN2V0ibtu_WQR3r1vw5FvILo69QoKBIFHw1KYnk_RtbwTGWYJdKESImfsdaHMOAI-eTDvG30bKvCtub6Zd7QHB3aF0pJXdWuYevA4EW64POoLGmtyUrbiUsP7Twvv0cxi8Ef9qv8mWv7385m9lqfKuL2lOjRr1Fl1qRCek1xliYKaltGYdyNpVPevph7xOs09k1EZVyyaHY27eTxzuHD9ikQopg7JcIJsNqpnqi9WA2CjKWM",
      },
    },
  };
});

export default request;
