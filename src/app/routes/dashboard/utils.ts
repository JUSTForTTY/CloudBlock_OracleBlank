export function InitErrorData(CallInfos: ErrorInfo[], CallUserInfos: CallUserInfo[]): boolean {
    let isError = false;
    const errorData = groupByToJson(CallUserInfos, 'FBillNo')
    for (const iterator of CallInfos) {
        iterator.callUserInfo = errorData[iterator.FBillNo] || [];
        switch (iterator.FState) {
            case '已维修':
                iterator.status = 'success';
                iterator.sort = 3;
                break;
            case '已关闭':
                iterator.status = 'success';
                iterator.sort = 4;
                break;
            case '待响应':
                isError = true;
                iterator.status = 'error';
                iterator.sort = 1;

                break;
            case '已响应':
                isError = true;
                iterator.status = 'warning';
                iterator.sort = 2;

                break;

            default:
                break;
        }
    }
    CallInfos.sort((a, b) => {
        return a.sort - b.sort;
    })
    let index = 0;
    for (const iterator of CallInfos) {
        iterator.index = ++index;
    }
    return isError;
}

export function groupByToJson<E extends { [key: string]: any }>(list: E[], key: (keyof E)): { [key: string]: E[] } {
    let res: { [key: string]: E[] } = {};
    for (const item of list) {
        const id = item[key]
        if (!res[id]) res[id] = [];
        res[id].push(item);
    }
    return res;
}


export interface ErrorInfo {
    "FBillNo": string;
    "FLocation": string;
    "FReason": string;
    "FCallDate": string;
    "FCallUser": string;
    "FCallUserName": string;
    "FRespUser": string;
    "FRespUserName": string;
    "FMaintUserCode": string;
    "FMaintUserName": string;
    "FRespDate": number;
    "FMaintDate": number;
    "FStopLineDate": number;
    "FactoryCode": string;
    "FState": '已维修' | '已关闭' | '待响应' | '已响应';
    index?: number;
    status?: string;
    sort?: number;
    callUserInfo?: CallUserInfo[]
    FResponseDate?: any;
    FIsTransfer?: number;
    [key: string]: any
}
export interface CallUserInfo {
    /** 姓名 */
    A0101: string;
    FBillNo: string;
    FDate: string;
    FUserCode: string;
}