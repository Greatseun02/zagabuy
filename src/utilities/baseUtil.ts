import {appConfig} from "@/configs/appConfig";
import {BaseResponse} from "@/utilities/types";
import {BaseEnum} from "@/utilities/enums/baseEnum";

export class BaseUtil {

    static logger(...logInfo: any) {
        if (appConfig.stage == "Dev" && process.env.NODE_ENV === 'development') {
            console.log(...logInfo);
        }
    }

    static isApiResponseSuccessful(response: BaseResponse): boolean {
        return response.responseCode == BaseEnum.RESPONSE_CODE_SUCCESS;
        // return response.isSuccessful
        // return ["200", "201"].includes(String(response.code))
    }
}
