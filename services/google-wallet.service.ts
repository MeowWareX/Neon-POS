import "server-only";
import { JWT } from "google-auth-library";
import jwt from "jsonwebtoken";
import {
  walletobjects,
  type walletobjects_v1,
} from "@googleapis/walletobjects";
import { env, isGoogleWalletConfigured } from "@/lib/env";
import type { LoyaltyCustomer, LoyaltyPass } from "@/types/domain";

const WALLET_SCOPE = "https://www.googleapis.com/auth/wallet_object.issuer";

type WalletClient = ReturnType<typeof walletobjects>;

function cleanPrivateKey(raw: string): string {
  let key = raw.trim();

  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  if (key.includes("\\n")) {
    key = key.replace(/\\n/g, "\n");
  }

  return key;
}

export function getIssuerId(): string | null {
  return isGoogleWalletConfigured ? env.GOOGLE_WALLET_ISSUER_ID! : null;
}

export function getClassId(): string {
  return `${getIssuerId()}.${env.GOOGLE_WALLET_CLASS_ID}`;
}

let cachedClient: WalletClient | null = null;

function getClient(): WalletClient | null {
  if (!isGoogleWalletConfigured) return null;

  if (cachedClient) return cachedClient;

  const auth = new JWT({
    email: env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL!,
    key: cleanPrivateKey(env.GOOGLE_WALLET_PRIVATE_KEY!),
    scopes: [WALLET_SCOPE],
  });

  cachedClient = walletobjects({ version: "v1", auth });
  return cachedClient;
}

async function getOrCreateLoyaltyClass(
  client: WalletClient,
): Promise<walletobjects_v1.Schema$LoyaltyClass> {
  const classId = getClassId();

  try {
    const { data } = await client.loyaltyclass.get({ resourceId: classId });
    return data;
  } catch {
    // Class does not exist yet -> create it
  }

  const logoUrl = `${env.NEXT_PUBLIC_APP_URL ?? ""}logo.jpg`;

  const { data } = await client.loyaltyclass.insert({
    requestBody: {
      id: classId,
      issuerName: "NEON Club",
      programName: "NEON Club",
      accountIdLabel: "Código NEON",
      accountNameLabel: "Miembro",
      hexBackgroundColor: "#090014",
      programLogo: {
        sourceUri: { uri: logoUrl },
        contentDescription: {
          defaultValue: {
            language: "es-CO",
            value: "Logo NEON Club",
          },
        },
      },
      rewardsTier: "Sellos",
      rewardsTierLabel: "Sellos",
      textModulesData: [
        {
          header: "Programa",
          body: "Paga 10, llévate 1 raspado gratis",
          id: "program",
        },
      ],
      reviewStatus: "underReview",
    },
  });

  return data;
}

function buildLoyaltyObject(
  customer: LoyaltyCustomer,
  pass: LoyaltyPass,
): walletobjects_v1.Schema$LoyaltyObject {
  const issuerId = getIssuerId()!;
  const objectId = `${issuerId}.${customer.id}`;
  const cardUrl = `${env.NEXT_PUBLIC_APP_URL ?? ""}club/${pass.passToken}`;
  const remainingStamps = Math.max(0, 10 - customer.stampsCount);

  return {
    id: objectId,
    classId: getClassId(),
    state: "ACTIVE",
    accountId: customer.id,
    accountName: customer.fullName,
    loyaltyPoints: {
      label: "Sellos",
      balance: { int: customer.stampsCount },
    },
    barcode: {
      type: "QR_CODE",
      value: cardUrl,
      alternateText: `Sellos: ${customer.stampsCount}/10`,
    },
    linksModuleData: {
      uris: [
        {
          uri: cardUrl,
          description: "Abrir tarjeta NEON",
        },
      ],
    },
    textModulesData: [
      {
        header: "Recompensa",
        body:
          remainingStamps === 0
            ? "¡Raspado gratis disponible!"
            : `${remainingStamps} sellos para tu raspado gratis`,
        id: "reward",
      },
      {
        header: "Teléfono",
        body: customer.phone,
        id: "phone",
      },
    ],
  };
}

async function getOrCreateLoyaltyObject(
  client: WalletClient,
  customer: LoyaltyCustomer,
  pass: LoyaltyPass,
): Promise<walletobjects_v1.Schema$LoyaltyObject> {
  const object = buildLoyaltyObject(customer, pass);
  const objectId = `${getIssuerId()}.${customer.id}`;

  try {
    const { data } = await client.loyaltyobject.patch({
      resourceId: objectId,
      requestBody: {
        loyaltyPoints: object.loyaltyPoints,
        textModulesData: object.textModulesData,
        barcode: object.barcode,
        accountName: object.accountName,
        linksModuleData: object.linksModuleData,
        notifyPreference: "NOTIFY",
      },
    });
    return data;
  } catch {
    const { data } = await client.loyaltyobject.insert({
      requestBody: object,
    });
    return data;
  }
}

async function createSaveLink(
  client: WalletClient,
  loyaltyClass: walletobjects_v1.Schema$LoyaltyClass,
  loyaltyObject: walletobjects_v1.Schema$LoyaltyObject,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const token = jwt.sign(
    {
      iss: env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL!,
      aud: "google",
      typ: "savetowallet",
      iat: now,
      exp: now + 3600,
      payload: {
        loyaltyClasses: [loyaltyClass],
        loyaltyObjects: [loyaltyObject],
      },
    },
    cleanPrivateKey(env.GOOGLE_WALLET_PRIVATE_KEY!),
    { algorithm: "RS256" },
  );

  const { data } = await client.jwt.insert({ requestBody: { jwt: token } });

  if (!data.saveUri) {
    throw new Error("Failed to create save link");
  }

  return data.saveUri;
}

export async function createGoogleWalletLink(
  customer: LoyaltyCustomer,
  pass: LoyaltyPass,
): Promise<{ saveUrl: string }> {
  const client = getClient();

  if (!client) {
    throw new Error("GoogleWalletNotConfigured");
  }

  const loyaltyClass = await getOrCreateLoyaltyClass(client);
  const loyaltyObject = await getOrCreateLoyaltyObject(client, customer, pass);
  const saveUrl = await createSaveLink(client, loyaltyClass, loyaltyObject);

  return { saveUrl };
}

export async function updateGoogleWalletPass(
  customer: LoyaltyCustomer,
  pass: LoyaltyPass,
): Promise<void> {
  const client = getClient();

  if (!client) {
    throw new Error("GoogleWalletNotConfigured");
  }

  const object = buildLoyaltyObject(customer, pass);
  const objectId = `${getIssuerId()}.${customer.id}`;

  try {
    await client.loyaltyobject.patch({
      resourceId: objectId,
      requestBody: {
        loyaltyPoints: object.loyaltyPoints,
        textModulesData: object.textModulesData,
        notifyPreference: "NOTIFY",
      },
    });
  } catch {
    try {
      await client.loyaltyobject.insert({ requestBody: object });
    } catch {
      // The object may not be saved by the user yet; nothing to update.
    }
  }
}
