/**
 * 1.无排产从未达标剔除
 * 2.无排产时良率显示
 * 3.无排产时颜色
 */
export interface Data {
    prolineCode: String;// line
    planAchievementRate: number;//complete
    yield: number;
    goodNums?: number;
    badNums?: number;
    planError?: string;
    completeStatus?: 'success' | 'exception' | 'active';
    yieldStatus?: 'success' | 'exception' | 'active';
    planNums?: number;
    /** 0-无排产 1-正常 3-试产 2-保养 */
    isNull?: '0' | '1' | '2' | '3';
    index?: number;
    efficiency?: number;
    efficiencyStatus?: 'success' | 'exception' | 'active';
    errorMsg?: string;
    errorCode?: EErrorCode;
    [key: string]: any;
    effectiveOutput?: number;
    signTime?: number;
    efficiencyFormula?: EfficiencyFormula;

}
export interface EfficiencyFormula {
    "efficiency": number,
    "signTime": number,
    "signWorker": number,
    "efficiencyFormulaProd": {
        "effectiveOutput": number,
        "productCode": string,
        "stdUph": number,
        "stdHuman": number,
        "produce": number,
        "stdCt": number
    }[];
    prolineCode: String;// line
}
export enum EErrorCode {
    success, error, null
}
export interface SectionData {
    "signCountOffline"?: number,
    "signCountAll"?: number,
    "stdSignOfflineTime"?: number,
    "sectionCode"?: string,
    "signAllTime"?: number,
    "kaoqin"?: number,
    "paiban"?: number
}
export interface SignSection {
    "WAVE"?: SectionData,
    "shiftType"?: "白班" | "夜班",
    "COATING"?: SectionData,
    "SMT"?: SectionData,
    "ATP"?: SectionData,
    sectionData?: SectionData[]
}

export type WorkType = 'WAVE' | 'COATING' | 'SMT' | 'ATP'
export interface UrlData {
    [key: string]: any;
    data: {
        WAVE: Data[],
        COATING: Data[],
        SMT: Data[],
        ATP: Data[],
        planAchievementRate: { bad: number; good: number },
        yield: { bad: number; good: number },
        efficiency: { bad: number; good: number },
        signSection?: SignSection
    }

}

export function getDataByUrlData(data: Data): Data {
    return null;
}
export function getTestData(): Data[] {
    return [
        {
            prolineCode: 'SUZ15SMT-A',
            planAchievementRate: 75,
            yield: 99,
        },
        {
            prolineCode: 'SUZ15SMT-B',
            planAchievementRate: 75,
            yield: 99
        },
        {
            prolineCode: 'SUZ15SMT-C',
            planAchievementRate: 96,
            yield: 80
        },
        {
            prolineCode: 'SUZ15SMT-D',
            planAchievementRate: 95,
            yield: 77
        },
        {
            prolineCode: 'SUZ15SMT-E',
            planAchievementRate: 75,
            yield: 43
        },
        {
            prolineCode: 'SUZ15SMT-F',
            planAchievementRate: 89,
            yield: 86
        },
        {
            prolineCode: 'SUZ15SMT-G',
            planAchievementRate: 99,
            yield: 78
        },
        {
            prolineCode: 'SUZ15SMT-H',
            planAchievementRate: 96,
            yield: 97
        },
        {
            prolineCode: 'SUZ15SMT-I',
            planAchievementRate: 86,
            yield: 95
        },
        {
            prolineCode: 'SUZ15SMT-J',
            planAchievementRate: 93,
            yield: 85
        },
        {
            prolineCode: 'SUZ15SMT-K',
            planAchievementRate: 87,
            yield: 77
        },
    ];
}