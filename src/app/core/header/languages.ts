export class Languages {
    static languages: LanguageFlag[] = [
        {
            lang: 'en',
            name: 'English',
            flag: '../../../assets/images/flags/united-states.svg',
        },
        {
            lang: 'cn',
            name: 'Chinese',
            flag: '../../../assets/images/flags/china.svg',
        },
        {
            lang: 'es',
            name: 'Spanish ',
            flag: '../../../assets/images/flags/france.svg',
        },
        {
            lang: 'ar',
            name: 'Arabic ',
            flag: '../../../assets/images/flags/saudi-arabia.svg',
        },
        {
            lang: 'ru',
            name: 'Russian',
            flag: '../../../assets/images/flags/russia.svg',
        },
        {
            lang: 'ja',
            name: 'Japanese',
            flag: '../../../assets/images/flags/japan.svg',
        },
        {
            lang: 'ko',
            name: 'Korean',
            flag: '../../../assets/images/flags/south-korea.svg',
        },
        {
            lang: 'de',
            name: 'German',
            flag: '../../../assets/images/flags/germany.png',
        }, {
            lang: 'fr',
            name: 'French',
            flag: '../../../assets/images/flags/french.png',
        }, {
            lang: 'pt',
            name: 'Portuguese',
            flag: '../../../assets/images/flags/portuguese.png',
        }, {
            lang: 'tr',
            name: 'Turkish',
            flag: '../../../assets/images/flags/turkish.png',
        }
    ];
}

export interface LanguageFlag {
    lang: string;
    name: string;
    flag: string;
    active?: boolean;
}