import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform, SecurityContext } from '@angular/core';

@Pipe({
    name: 'boldText',
})
export class BoldTextPipe implements PipeTransform {

    private regex!: RegExp;

    private pattern!: string;

    constructor(private readonly sanitizer: DomSanitizer) {}

    public transform(value: string, pattern: string): string {
        this.regex = new RegExp(pattern, 'gmi');
        this.pattern = pattern;

        const bolderedText = this.sanitize(this.replace(value));

        return bolderedText ? bolderedText : value;
    }

    public replace(source: string): string {

        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        const matches = source.slice().match(this.regex);

        let outString = source.slice();

        if (matches) {
            matches.forEach(foundString => {
                const startIdx = source.indexOf(foundString);
                const leftSideStr = source.slice(0, startIdx);
                const rightSideStr = source.slice(startIdx);

                const rightSideStrReplaced = rightSideStr.replace(this.regex, `<b>${foundString}</b>`);


                outString = leftSideStr + rightSideStrReplaced;

            });

        }

        return outString;
    }

    public sanitize(source: string): string | null {
        return this.sanitizer.sanitize(SecurityContext.HTML, source);
    }

}
