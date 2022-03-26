// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
var request = require("request");

type Data = {};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const accessToken = req.body.accessToken;
  const payload = req.body.payload;
  var options = {
    method: "POST",
    url: "https://api.sandbox.openfabric.co/m/transactions",
    headers: {
      Authorization: `Bearer ` + accessToken + ``,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  request(options, function (error: any, response: any) {
    if (error) throw new Error(error);
    console.log(options);
    res.status(200).json(response.body);
  });
}
