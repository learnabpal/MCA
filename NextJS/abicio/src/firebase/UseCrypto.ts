import CryptoJS from "crypto-js";




export default function useCrypto({ secretKey }) {
	  
	  const reversed = secretKey.split("").reverse().join("");
	  const cryptKey = secretKey + reversed;
	  
	  const encrypt = (text: string): string => {
			 return CryptoJS.AES.encrypt(text, cryptKey).toString();
	  };
	  
	  const decrypt = (text: string): string => {
			 return CryptoJS.AES.decrypt(text || "", cryptKey).toString(CryptoJS.enc.Utf8);
	  };
	  
	  return { encrypt, decrypt };
}
