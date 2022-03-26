// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
var request = require("request");

type Data = {
  
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  var options = {
    method: "POST",
    url: "https://auth.sandbox.openfabric.co/oauth2/token",
    headers: {
      Authorization: "Basic MnNvMjRvZWNjcjBtb2xjN2FuMW1vMjQ0azoxcnE3c3YwbzMwdDlhZnVrNG5hYm91bGxtYzFkMGIyOTZ1ajJ2aGhzYXZzbnRqazRuY3Ay",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      grant_type: "client_credentials",
      scope:
        "resources/transactions.read resources/transactions.write resources/cards.read",
    },
  };
  request(options, function (error: any, response: any) {
    if (error) throw new Error(error);
    res.status(200).json(response.body);
  });

}
