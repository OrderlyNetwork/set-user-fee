// ==== CONFIG ====

// get your credentials here from your Orderly admin wallet:
// https://orderlynetwork.github.io/broker-registration/

// Your Orderly account ID from the admin wallet
const adminAddress = "your-admin-evm-or-sol-address-here";

// Your Orderly secret key from the admin wallet
const orderlyAdminSecret = "ed25519:your-admin-secret-key-here";

// Your broker ID
const brokerId = "your-broker-id-here";

// set your fees here. Fees are set as decimal numbers,
// e.g. 0.0001 => 0.01% fee
// 0.00005 => 0.005% fee etc
// you cannot go below 0.03% taker fee, because this is what Orderly charges

// the maker fee rate you want to set for the list of accounts
const makerFeeRate = 0;
// the taker fee rate you want to set for the list of accounts
const takerFeeRate = 0.0003;
// the list of addresses as array of strings
// you can add/delete addresses as you see fit
const addresses = [
  "0xfirst-address-here",
  "0xsecond-address-here",
  "0xthird-address-here",
  // ...
];

// network: "testnet" or "mainnet"
const network = "testnet";

// ==== DO NOT CHANGE ANYTHING BELOW ====
import { getPublicKeyAsync, signAsync } from "@noble/ed25519";
import bs58 from "bs58";

const baseUrl =
  network === "testnet"
    ? "https://testnet-api-evm.orderly.org"
    : "https://api-evm.orderly.org";

async function main() {
  const orderlyKey = bs58.decode(orderlyAdminSecret.substring(8));
  const res = await signAndSendRequest(
    await getAccountId(adminAddress, brokerId),
    orderlyKey,
    `${baseUrl}/v1/broker/fee_rate/set`,
    {
      method: "POST",
      body: JSON.stringify({
        maker_fee_rate: makerFeeRate,
        taker_fee_rate: takerFeeRate,
        account_ids: await Promise.all(
          addresses.map((address) => getAccountId(address, brokerId))
        ),
      }),
    }
  );
  const response = await res.json();
  console.log(JSON.stringify(response, undefined, 2));
}
main();

async function signAndSendRequest(
  orderlyAccountId: string,
  privateKey: Uint8Array | string,
  input: URL | string,
  init?: RequestInit | undefined
): Promise<Response> {
  const timestamp = Date.now();
  const encoder = new TextEncoder();

  const url = new URL(input);
  let message = `${String(timestamp)}${init?.method ?? "GET"}${url.pathname}${
    url.search
  }`;
  if (init?.body) {
    message += init.body;
  }
  const orderlySignature = await signAsync(encoder.encode(message), privateKey);

  return fetch(input, {
    headers: {
      "Content-Type":
        init?.method !== "GET" && init?.method !== "DELETE"
          ? "application/json"
          : "application/x-www-form-urlencoded",
      "orderly-timestamp": String(timestamp),
      "orderly-account-id": orderlyAccountId,
      "orderly-key": `ed25519:${bs58.encode(
        await getPublicKeyAsync(privateKey)
      )}`,
      "orderly-signature": Buffer.from(orderlySignature).toString("base64url"),
      ...(init?.headers ?? {}),
    },
    ...(init ?? {}),
  });
}

async function getAccountId(address: string, brokerId: string) {
  const isEvm = isEvmAddress(address);
  const isSol = isSolAddress(address);
  if (!isEvm && !isSol) {
    throw new Error("Invalid address format");
  }
  const res = await fetch(
    `${baseUrl}/v1/get_account?address=${address}&broker_id=${brokerId}${
      isSol ? "&chain_type=SOL" : ""
    }`
  );
  const response = await res.json();
  return response.data.account_id as string;
}

function isEvmAddress(address: string) {
  return address.match(/^0x[0-9a-fA-F]{40}$/);
}
function isSolAddress(address: string) {
  return address.match(/^[0-9a-zA-Z]{44}$/);
}
