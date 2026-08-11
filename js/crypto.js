const DEMO_PRIVATE_JWK = {"kty":"RSA","n":"vdr5_9q8M3fpUIVNtN9kOEw0B7dqFTGPw_9I8as3wZ_uSa2t7VN2ZSKP5-KCE8zs0R8BYOloxmM3jA4rEhfebxpVm5cBHAWPcbev2arOQKE1l9Fkml9DBMauiC4CAH-ok7U1uLhDzdKHeNuV3nqpIgDZAM5vnAwc7o_Wwt-MEy6XBho6JuN4jzzXCyC7thUKhciNWO8AoI4f8PQCmOCnez3uNIefupe4DPxl0CUvoCT512L9Yl3lLzSIIU-Mbz5k_z2WgmIqOgkICnk5c3yhksYmTKzVNBKOwivNSC6Vbz0-UJOnsjrovVM2CAHQqEZMebT8UYs8g6Wz8n9DHH993w","e":"AQAB","d":"UvIvJC2T6OacLB45T2sD9aaxWqey9LR1C5vmahM0Zmcxq8XyBYxf3xqlBZnL28u9sTWbHBSNvpMNayargZmlCCRYv4PPK8dwHq4yaWY6-ziTWhNVIS66cIU_LmbvX_lmFLZoVJ5InU07-7zv8sXjS-RT6orGb0ZJg56bJQOWxq_kJVf2FKImlzOt4gkbskEguW02Thv-sYbNOQJuUJZQudd8zO-VrtInm_ORi0qPDgqh3C9LkEhiXf5NZgvqN6RVgYjSycck-WPjEfc98EVBdJjVZaLeWSK0lWKz2xdAMFZ7SWVNyQxDLlOSmhie6tPf6q0q5RsNtjtpKfuuEl9jvQ","p":"8wGAOjocuY8DjuEHzUzRtu5VgTaKjQXmDJXFBhSJzWFRzW2Mys7dbvIp7iDtcfeF6MPAj0Ub24tjdgSgjTt35Mzk2hX1ARJWGT5TBfck2ESyTRMMm9dTDaYR7opSm6uV706pCoAVAUv8osfXrt95oajIO0iJfgswrPG_TQU2hzs","q":"yAHmhDoTw_AEF39MtwBSJXAwxoSIqfgRB81BJsDofL9_LXTE9RPbGEOj4rHZk6hvt3WW6FcLG6OWURDyI_5V0mej6-qosQCsV_4oRG7c37nABNERmWIIGjZ18PJ3baoKdR5-xZsGNgci03L91Y8tZF7SCJdVMy2JLlknfw0uoa0","dp":"iu6XvjKNS7WtRhn4GPNLjzfSIO7q5deygA18uI4zfv2eBEIW1bjRtuWy_VdMCfWHVN3eEMtlMu8NbWMV28ldMa3HRbx5-CPgn8wXMXjsUs1r108FzW-dJ1eENwpUUnYWYdxqHvu9hqFIDlUNRgi0hK131RUSrsJ9ENOiGMnbNBM","dq":"xy4tVO1Jlc3HJWdfDLhDFomd6XU_bJVg0HY2NdPTM7i5fJlXNAIsJQPnh_E6DvSlHPz75jIZG9NT9TN9ER9OdJVGB8HPcUaMW6z-iPgm-p7PfXx_nFKmYwRtfCDbktjORUizUzNJgjClHBLeevl1aQmM_YVIEgl9Hi0nSj3kfJk","qi":"lpLBLkaxtdiI3TxTzs2NznETz5z68jPPKpfvccmaEmaBEddIfyRm7cexP8iw6Xwf8BNCSxIHqZQNDpL4Cd-nL9TG6Deuo85Qrp3ArxADL5p0Wa5LtcjR21VpepfK6myvrAkk-Yw6WfM0OaIHXlKLDu_xsjCxjMkerDgmWTeXjKk","alg":"PS256","ext":true};
const TRUSTED_PUBLIC_JWK = {"kty":"RSA","n":"vdr5_9q8M3fpUIVNtN9kOEw0B7dqFTGPw_9I8as3wZ_uSa2t7VN2ZSKP5-KCE8zs0R8BYOloxmM3jA4rEhfebxpVm5cBHAWPcbev2arOQKE1l9Fkml9DBMauiC4CAH-ok7U1uLhDzdKHeNuV3nqpIgDZAM5vnAwc7o_Wwt-MEy6XBho6JuN4jzzXCyC7thUKhciNWO8AoI4f8PQCmOCnez3uNIefupe4DPxl0CUvoCT512L9Yl3lLzSIIU-Mbz5k_z2WgmIqOgkICnk5c3yhksYmTKzVNBKOwivNSC6Vbz0-UJOnsjrovVM2CAHQqEZMebT8UYs8g6Wz8n9DHH993w","e":"AQAB","alg":"PS256","ext":true};

function bytesToBase64(bytes) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToBytes(base64) {
  const binary = atob(base64.replace(/\s/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

async function importPrivateKey() {
  return crypto.subtle.importKey(
    "jwk", DEMO_PRIVATE_JWK,
    { name: "RSA-PSS", hash: "SHA-256" },
    false, ["sign"]
  );
}

async function importTrustedPublicKey() {
  return crypto.subtle.importKey(
    "jwk", TRUSTED_PUBLIC_JWK,
    { name: "RSA-PSS", hash: "SHA-256" },
    true, ["verify"]
  );
}

async function signResult(text) {
  const key = await importPrivateKey();
  const signature = await crypto.subtle.sign(
    { name: "RSA-PSS", saltLength: 32 },
    key,
    new TextEncoder().encode(text)
  );
  return bytesToBase64(new Uint8Array(signature));
}

async function verifyResult(text, signatureBase64) {
  const key = await importTrustedPublicKey();
  return crypto.subtle.verify(
    { name: "RSA-PSS", saltLength: 32 },
    key,
    base64ToBytes(signatureBase64),
    new TextEncoder().encode(text)
  );
}
