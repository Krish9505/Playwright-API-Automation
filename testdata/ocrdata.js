import vcipkeydata from '../testdata/vcipkey.json' with { type: 'json' };


import {imageToBase64} from '../helpers/imageHelper.js';

export const ocrfront =() =>
{
  const imagepath="images/ocrfront.jpeg";

  return{

      "vcipkey":vcipkeydata.vcipkey,
      "docimage": imageToBase64(imagepath),
      "type": "front",
      "cardtype":"v1"

  }


}

export const savecimocrfront = {
  "vcipkey": vcipkeydata.vcipkey,
  "type": "front",
  "edtname": "",
  "edtsurname": "",
  "edtsurnameatbirth": "",
  "edtdob": "",
  "edtgender": "",
  "edtuid": "",
  "edtbuild": "",
  "edtdoi": "",
  "edthologram_dob": "",
  "marital_status": "",
  "edtcard_control_number": ""
};



export const ocrback = () => {
  const imagepath = "images/ocrback.jpeg";

  return {
    "vcipkey": vcipkeydata.vcipkey,
    "docimage": imageToBase64(imagepath),
    "type": "back",
    "cardtype": "v1"
  };
};


export const savecimocrback2=
{
    "vcipkey": vcipkeydata.vcipkey,
    "type": "back",
    "edtname": "",
    "edtsurname": "",
    "edtsurnameatbirth": "",
    "edtdob": "",
    "edtgender": "",
    "edtuid": "",
    "edtbuild": "",
    "edtdoi": "",
    "edthologram_dob": "",
    "marital_status": "",
    "edtcard_control_number": ""
}