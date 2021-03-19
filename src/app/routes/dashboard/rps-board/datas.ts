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
    planNums?:number;
    /** 0-无排产 1-未排产 */
    isNull?: '0'|'1';
}
export interface UrlData {
    [key: string]: any;
    data: {
        WAVE: Data[],
        COATING: Data[],
        SMT: Data[],
        ATP: Data[],
        planAchievementRate: { bad: number; good: number },
        yield: { bad: number; good: number }
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