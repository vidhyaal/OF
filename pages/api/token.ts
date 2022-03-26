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
      Authorization: "Basic MmwzNjBxY242NzFhaXQ5bm9lZGpvMGRiM2E6MXVsYnUxZm9wY3JyaGVyYzlqdHNwdWp1NHFraHZuYmp0bWg0b2Q0cDBrMWRiMTFyZW5lOA==",
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
