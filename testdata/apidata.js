import vciprefdata from '../testdata/vcipref.json'; 
import vcipkeydata from '../testdata/vcipkey.json';
const randomnumber=Math.floor(1000000000+Math.random()*9000000000).toString();
export const authkeydata= 

{
    "username": "satish.p@m2pfintech.com",
    "password": "YWJjQDEyMzQ=",
    "rolename": "Account Admin",
    "rid": "2",
    "authflag": "1"
  };

  export const addcustomerdata =
  {
  "customerid": "L1911922908652",
  "account_code": "CIM-CFA",
  "mobile": randomnumber,
  "isconsentavailable": "1",
  "customertype": "REKYC_self",
  "addressline1": "Sajjad Hussain,54/225,J.P Colony,Aamer Road,Jai Mahal Jaipur Rajasthan,Jaipur,Jaipur,Rajasthan,302002",
  "addressline2": "Sajjad Hussain,54/225,J.P Colony,Aamer Road,Jai Mahal Jaipur Rajasthan,Jaipur,Jaipur,Rajasthan,302002",
  "areacode": "GRSE",
  "districtcode": "FLacq",
  "ref1": "Pf6DSXLPGhoB9TVUNUVvXXPXKjxNJ12uieo8D/HwRrdaWC4Vc4EnDunrYFvewFea1b8kW0R5S4WUR0HtZEsTqU003d\\u003d",
  "ref2": "5",
  "ref3": "1",
  "ref4": "1",
  "ref5": "surendhar",
  "agent_details": {
    "agent_id": "199098",
    "agent_name": "Testing call agent",
    "agent_branch": "M2p01",
    "agent_location": "chennai10"
  }


}

export const getvcipdetails=
{
 
  "vcipref": vciprefdata.id


}

export const slot=
{
    "vcipkey":vcipkeydata.vcipkey,
    "custdetails": {
        "ip": "",
        "location": "17.49027367608938,78.38172884405122",
        "geolocation": "",
        "nw_incoming": "",
        "nw_outgoing": "",
        "videoresolution": "",
        "browserdetails": "chrome,147.0.0,Windows 10,browser"
    },
    "ref1": ""
}

