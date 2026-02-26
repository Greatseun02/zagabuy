import { BaseService } from "@/configs/serviceConfig";
import { ReadWalletUserIdRequest } from "@/models/requests/wallet/ReadWalletUserIdRequest";
import { ValidateBvnRequest } from "@/models/requests/wallet/ValidateBvnRequest";
import { ValidateNinRequest } from "@/models/requests/wallet/ValidateNinRequest";
import { ReadWalletUserIdResponse } from "@/models/responses/wallet/ReadWalletUserIdResponse";
import { ValidateBvnResponse } from "@/models/responses/wallet/ValidateBvnResponse";
import { ValidateNinResponse } from "@/models/responses/wallet/ValidateNinResponse";
import { ApiRequestMethodsEnum } from "@/utilities/enums/apiRequestMethodsEnum";
import { ApiTagsEnum } from "@/utilities/enums/apiTagsEnum";

const controller = "wallet";
export const walletService = BaseService.appClient.injectEndpoints({
  endpoints: (builder) => ({
    readWalletByUserId: builder.query<
      ReadWalletUserIdResponse,
      ReadWalletUserIdRequest
    >({
      query: ({ walletUserId }) => ({
        url: `/${controller}/read-by-wallet-user-id/${walletUserId}`,
        // url: `/${controller}/read`,
        method: ApiRequestMethodsEnum.GET,
      }),
      providesTags: (result) => {
        if (!result?.data) return [{ type: ApiTagsEnum.Wallet, id: "LIST" }];
        return [
          ...result.data.map((wallet) => ({
            type: ApiTagsEnum.Wallet as const,
            id: wallet.walletId,
          })),
          { type: ApiTagsEnum.Wallet, id: "LIST" },
        ];
      },
    }),
    validateBvn: builder.mutation<ValidateBvnResponse, ValidateBvnRequest>({
      query: (payload) => ({
        url: `/${controller}/validate-bvn`,
        method: ApiRequestMethodsEnum.POST,
        body: payload,
      }),
      invalidatesTags: [{ type: ApiTagsEnum.Wallet, id: "LIST" }],
    }),
    validateNin: builder.mutation<ValidateNinResponse, ValidateNinRequest>({
      query: (payload) => ({
        url: `/${controller}/validate-nin`,
        method: ApiRequestMethodsEnum.POST,
        body: payload,
      }),
      invalidatesTags: [{ type: ApiTagsEnum.Wallet, id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useReadWalletByUserIdQuery,
  useLazyReadWalletByUserIdQuery,
  useValidateBvnMutation,
  useValidateNinMutation,
} = walletService;
