export interface Data {
    line: String;
    complete: number;
    yield: number;
    completeStatus?: 'success' | 'exception' | 'active';
    yieldStatus?: 'success' | 'exception' | 'active';
}
export function getTestData(): Data[] {
    return [
        {
            line: 'SUZ15SMT-A',
            complete: 75,
            yield: 99,
        },
        {
            line: 'SUZ15SMT-B',
            complete: 75,
            yield: 99
        },
        {
            line: 'SUZ15SMT-C',
            complete: 96,
            yield: 80
        },
        {
            line: 'SUZ15SMT-D',
            complete: 95,
            yield: 77
        },
        {
            line: 'SUZ15SMT-E',
            complete: 75,
            yield: 43
        },
        {
            line: 'SUZ15SMT-F',
            complete: 89,
            yield: 86
        },
        {
            line: 'SUZ15SMT-G',
            complete: 99,
            yield: 78
        },
        {
            line: 'SUZ15SMT-H',
            complete: 96,
            yield: 97
        },
        {
            line: 'SUZ15SMT-I',
            complete: 86,
            yield: 95
        },
        {
            line: 'SUZ15SMT-J',
            complete: 93,
            yield: 85
        },
        {
            line: 'SUZ15SMT-K',
            complete: 87,
            yield: 77
        },
    ];
}