import vcipkeydata from '../testdata/vcipkey.json' with { type: 'json' };
import {imageToBase64} from '../helpers/imageHelper.js';

const image='images/signature.png'
export const adress={


  "vcipkey":vcipkeydata.vcipkey,
  "docimage": imageToBase64(image),
    "isnamesame": "4",
    "doctype": null,
    "ref1": "0",
    "reltype": "",
    "issupdoc": "0"
}

export const saveutility ={
    "edtbilldate": "2026-04-01",
    "edtbillid": "",
    "edtaddress": "test",
    "edtname": "krishna",
    "areacode": "ALBION",
    "districtcode": "Black River",
    "vcipkey":vcipkeydata.vcipkey,
    "ref1": "0",
    "issamename": "4",
    "issupdoc": "0"
}






