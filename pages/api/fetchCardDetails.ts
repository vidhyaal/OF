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
  const token = req.body.accessToken;
  const cardToken = req.body.cardToken;
  const payload = {
    "card_fetch_token": cardToken
  }

  var options = {
    method: "POST",
    url: "https://issuer.sandbox.openfabric.co/i/fetchCard",
    headers: {
      Authorization: `Bearer ` + token + ``,
      "Content-Type": "application/json",
    },   
     body: JSON.stringify(payload),
  };
 console.log(options)
  request(options, function (error: any, response: any) {
    if (error) throw new Error(error);
    res.status(200).json({data:response.body});
  }); 
}
