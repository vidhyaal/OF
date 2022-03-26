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
  const transactionID = req.body.transactionId;
  const token = req.body.token;


  var optionsApprove = {
    method: "GET",
    url: "https://api.sandbox.openfabric.co/m/transactions/" + transactionID,
    headers: {
      Authorization: `Bearer ` + token + ``,
      "Content-Type": "application/json",
    }
  };
 
  request(optionsApprove, function (error: any, response: any) {
    if (error) throw new Error(error);
    res.status(200).json({data:response.body});
  }); 
}