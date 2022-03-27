import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
// @ts-ignore
import { OpenFabric, Environment, PGConfig } from "@openfabric/merchant-sdk";

import { useState, useEffect } from "react";
import merchantToken from "./api/merchantToken";

interface ITransactionModel {
  account_reference_id: string;
  id: string;
}
interface ITransactionDetails {
  status: string;
}

const Home: NextPage = () => {
  const [accessToken, setAccessToken] = useState("");
  const [createTransactionResponse, SetCreateTransactionResponse] =
    useState<ITransactionModel>({ account_reference_id: "", id: "" });
  const [merchantAccessToken, setMerchantAccessToken] = useState("");
  const [disableCheckout, SetDisableCheckout] = useState(true);
  const [showCheckoutBlock, SetShowCheckoutBlock] = useState(false);
  const [showApprovetBlock, SetShowApproveBlock] = useState(true);
  const [transactionDetails, setTransactionDetails] =
    useState<ITransactionDetails>({ status: "" });
  const [showStatusBlock, SetShowStatusBlock] = useState(true);
  const [hideApproveDeclineButton, SetHideApproveDeclineButton] =
    useState(false);

  const getToken = () => {
    fetch("/api/token")
      .then((response) => response.json())
      .then(({ access_token }) => {
        setAccessToken(access_token);
        SetDisableCheckout(false);
      });
  };

  const getMerchantToken = () => {
    fetch("/api/merchantToken")
      .then((response) => response.json())
      .then(({ access_token }) => {
        setMerchantAccessToken(access_token);
        SetDisableCheckout(false);
      });
  };

  const customer_info = {
    mobile_number: "+6587654321",
    first_name: "BNPL",
    email: "developer@bnpl1.com",
  };

  const item = {
    item_id: "P100-1222",
    name: "iPhone",
    variation_name: "Black, 128GB",
    description: "string",
    quantity: 1,
    amount: 1,
    price: 2300,
    original_price: 2000,
    tax_amount_percent: 3,
    categories: ["phone"],
  };

  const shipping_address = {
    country: "Singapore",
    country_code: "SG",
    address_line_1: "80 Robinson Road",
    address_line_2: "#09-01",
    address_line_3: "#09-01",
    post_code: "068898",
  };

  const billing_address = {
    country: "Singapore",
    country_code: "SG",
    address_line_1: "80 Robinson Road",
    address_line_2: "#09-01",
    address_line_3: "#09-01",
    post_code: "068898",
  };

  const approveOrDecline = (action: string) => {
    if (createTransactionResponse?.account_reference_id) {
      fetch("api/approveOrDecline?action=" + action, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approveId: createTransactionResponse?.account_reference_id,
          token: merchantAccessToken,
        }),
      })
        .then((response) => response.json())
        .then(({ data }) => {
          if (data === "APPROVED") {
            // get transaction transaction_details
            fetch("api/getTransactions", {
              method: "POST", // or 'PUT'
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                transactionId: createTransactionResponse?.id,
                token: accessToken,
              }),
            })
              .then((response) => response.json())
              .then(({ data }) => {
                setTransactionDetails(JSON.parse(data));
                SetHideApproveDeclineButton(true);
                SetShowStatusBlock(false);
              });
          }
        });
    } else {
      console.log("No Create response");
    }
  };

  const decline = () => {
    setTransactionDetails({ status: "Transaction cannot be approved!" });
    SetShowStatusBlock(false);
    SetHideApproveDeclineButton(true);
  };

  const createTransaction = () => {
    const merchant_reference_id = `MT${Date.now()}`;
    const ACCOUNT_ID = "9ae8a952-b3b6-4872-a093-3d0969464bcc";

    const payload = {
      customer_info,
      amount: 2300,
      currency: "SGD",
      merchant_reference_id,
      account_id: ACCOUNT_ID,
      merchant_redirect_success_url: `${window.location}/successTransaction`,
      merchant_redirect_fail_url: `${window.location}/failureTransaction`,
      transaction_details: {
        shipping_address,
        billing_address,
        items: [item],
        tax_amount_percent: 10,
        shipping_amount: 10,
        original_amount: 130,
      },
    };

    fetch("api/createTransaction", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken: accessToken, payload: payload }),
    })
      .then((response) => response.json())
      .then((data) => {
        SetCreateTransactionResponse(data);
        if (data.id) {
          SetShowCheckoutBlock(true);
          SetShowApproveBlock(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getToken();
    getMerchantToken();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>OpenFabric</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
      </Head>

      <div className="container mt-2">
        <div className={showCheckoutBlock ? styles.hidden : undefined}>
          <h4 className="mb-3">
            <strong>Payment</strong>
          </h4>
          <div className="row"></div>
          <div className="row">
            <div className="card">
              <img
                className="card-img-top"
                src="/camera.png"
                alt="Card image cap"
                style={{ width: "18rem" }}
              />
              <div className="card-body">
                <h5 className="card-title">Sony Camera</h5>
                <p className="card-text">Best camera - low price $100</p>
                <button
                  className="btn btn-primary btn-lg btn-block"
                  type="submit"
                  onClick={() => createTransaction()}
                  disabled={disableCheckout}
                >
                  Pay with BNPL
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={showApprovetBlock ? styles.hidden : undefined}
          id="approveBlock"
        >
          <h4 className="mb-3">
            <strong>Account Dashboard</strong>
          </h4>
          <div className="card">
            <div className="card-body">
              Transation created :{" "}
              {createTransactionResponse?.account_reference_id}
              <hr />
              <div className="row">
                <div className="col-2">
                  <button
                    className="btn btn-primary btn-xs"
                    onClick={() => approveOrDecline("Approved")}
                    disabled={hideApproveDeclineButton}
                  >
                    Approve
                  </button>
                </div>
                <div className="col-2">
                  <button
                    className="btn btn-danger btn-xs"
                    onClick={() => approveOrDecline("Failed")}
                    disabled={hideApproveDeclineButton}
                  >
                    Decline
                  </button>
                </div>
              </div>
              <div>
                <hr />
                <div
                  role="alert"
                  className={
                    showStatusBlock ? styles.hidden : "alert alert-primary"
                  }
                >
                  {transactionDetails ? transactionDetails.status : ""}
                  <br />
                  <code>
                    {transactionDetails
                      ? JSON.stringify(transactionDetails, undefined, 2)
                      : ""}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
