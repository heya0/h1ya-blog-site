export declare const swiss: {
    colors: {
        text: string;
        background: string;
        primary: string;
        secondary: string;
        highlight: string;
        purple: string;
        muted: string;
        gray: string;
    };
    fonts: {
        body: string;
        heading: string;
        monospace: string;
    };
    fontSizes: number[];
    fontWeights: {
        body: number;
        heading: number;
        display: number;
    };
    lineHeights: {
        body: number;
        heading: number;
    };
    textStyles: {
        heading: {
            fontFamily: string;
            fontWeight: string;
            lineHeight: string;
        };
        display: {
            variant: string;
            fontSize: number[];
            fontWeight: string;
            letterSpacing: string;
            mt: number;
        };
    };
    styles: {
        Container: {
            p: number;
            maxWidth: number;
        };
        root: {
            fontFamily: string;
            lineHeight: string;
            fontWeight: string;
        };
        h1: {
            variant: string;
        };
        h2: {
            variant: string;
            fontSize: number;
        };
        h3: {
            variant: string;
            fontSize: number;
        };
        h4: {
            variant: string;
            fontSize: number;
        };
        h5: {
            variant: string;
            fontSize: number;
        };
        h6: {
            variant: string;
            fontSize: number;
        };
        a: {
            color: string;
            '&:hover': {
                color: string;
            };
        };
        pre: {
            variant: string;
            fontFamily: string;
            fontSize: number;
            p: number;
            color: string;
            bg: string;
            overflow: string;
            code: {
                color: string;
            };
        };
        code: {
            fontFamily: string;
            color: string;
            fontSize: number;
        };
        inlineCode: {
            fontFamily: string;
            color: string;
            bg: string;
        };
        table: {
            width: string;
            my: number;
            borderCollapse: string;
            borderSpacing: number;
            'th,td': {
                textAlign: string;
                py: string;
                pr: string;
                pl: number;
                borderColor: string;
                borderBottomStyle: string;
            };
        };
        th: {
            verticalAlign: string;
            borderBottomWidth: string;
        };
        td: {
            verticalAlign: string;
            borderBottomWidth: string;
        };
        hr: {
            border: number;
            borderBottom: string;
            borderColor: string;
        };
        img: {
            maxWidth: string;
        };
    };
    prism: {
        '.comment,.prolog,.doctype,.cdata,.punctuation,.operator,.entity,.url': {
            color: string;
        };
        '.comment': {
            fontStyle: string;
        };
        '.property,.tag,.boolean,.number,.constant,.symbol,.deleted,.function,.class-name,.regex,.important,.variable': {
            color: string;
        };
        '.atrule,.attr-value,.keyword': {
            color: string;
        };
        '.selector,.attr-name,.string,.char,.builtin,.inserted': {
            color: string;
        };
    };
};
export default swiss;
