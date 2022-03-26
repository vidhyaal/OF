// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
var request = require("request");

type Data = {
    data: string
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const approveId = req.body.approveId;
  const token = req.body.token;

  const payload = {
    "account_reference_id": approveId,
    "status": "Approved",
    "amount":100,
    "currency":"SGD"
  }

  var optionsApprove = {
    method: "PUT",
    url: "https://api.sandbox.openfabric.co/t/transactions",
    headers: {
      Authorization: `Bearer ` + token + ``,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
 
  request(optionsApprove, function (error: any, response: any) {
    if (error) throw new Error(error);
    if(response?.statusCode === 204) {
        res.status(200).json({data: "APPROVED"});
    }else {
        res.status(200).json({data: "ERROR"});
    }
  }); 
}