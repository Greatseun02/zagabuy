export type AppConfig = {
  baseUrlDev: string;
  baseUrlProd: string;
  stage: "Dev" | "Prod";
};
export const appConfig: AppConfig = {
  baseUrlDev: "https://api-dev.nairainvoice.com/dev",
  baseUrlProd:
    "https://kvywacwvy2.execute-api.us-east-1.amazonaws.com/api/prod",
  stage: "Dev",
};
