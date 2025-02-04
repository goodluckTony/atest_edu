import { Locator, Page, expect } from "@playwright/test";

export class TeacherProfilePage {
    private page: Page; 
    private teacherLastname: Locator;
    private teacherFirstname: Locator;
    private teacherSurname: Locator;
    private teacherDate: Locator;
    private teacherGender: Locator;
    private teacherEmail: Locator;
    private teacherPhone: Locator;
    private teacherTelegram: Locator;
    private teacherLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.teacherLastname = page.locator("//form[1]//p[contains(text(), 'Прізвище')]/following::p[1]");
        this.teacherFirstname = page.locator("//form[1]//p[contains(text(), 'Ім’я')]/following::p[1]");
        this.teacherSurname = page.locator("//form[1]//p[contains(text(), 'По батькові')]/following::p[1]");
        this.teacherDate = page.locator("//form[1]//p[contains(text(), 'Дата народження')]/following::p[1]");
        this.teacherGender = page.locator("//form[1]//p[contains(text(), 'Стать')]/following::p[1]");
        this.teacherEmail = page.locator("//form[2]//p[contains(text(), 'E-mail')]/following::p[1]");
        this.teacherPhone = page.locator("//form[2]//p[contains(text(), 'Телефон')]/following::p[1]");
        this.teacherTelegram = page.locator("//form[2]//p[contains(text(), 'Telegram')]/following::p[1]");
        this.teacherLink = page.locator("//form[2]//p[contains(text(), 'Лінк')]/following::p[1]");
    }

    getTeacherLastName(): Locator {
       return this.teacherLastname;
    }
    
    getTeacherFirstName(): Locator {
        return this.teacherFirstname;
    }

    getTeacherSurname(): Locator {
        return this.teacherSurname;
    }

    getTeacherDate(): Locator {
        return this.teacherDate;
    }

    getTeacherGender(): Locator {
        return this.teacherGender;
    }

    getTeacherEmail(): Locator {
        return this.teacherEmail;
    }
    
    getTeacherPhone(): Locator {
        return this.teacherPhone;
    }

    getTeacherTelegram(): Locator {
        return this.teacherTelegram;
    }

    getTeacherLink(): Locator {
        return this.teacherLink;
    }

    // async verifyTeacherDetails(): Promise<void> {
    //     await this.page.waitForLoadState("networkidle");

    //     await this.teacherLastname;
        // const teacherLastname = this.page.locator("//form[1]//p[contains(text(), 'Прізвище)]/following::p[1]");
        // const teacherFirstname = this.page.locator("//form[1]//p[contains(text(), 'Ім’я')]/following::p[1]");
        // const teacherSurname = this.page.locator("//form[1]//p[contains(text(), 'По батькові')]/following::p[1]");
        // const teacherDate = this.page.locator("//form[1]//p[contains(text(), 'Дата народження')]/following::p[1]");
        // const teacherGender = this.page.locator("//form[1]//p[contains(text(), 'Стать')]/following::p[1]");
        // const teacherEmail = this.page.locator("//form[2]//p[contains(text(), 'E-mail')]/following::p[1]");
        // const teacherPhone = this.page.locator("//form[2]//p[contains(text(), 'Телефон')]/following::p[1]");
        // const teacherTelegram = this.page.locator("//form[2]//p[contains(text(), 'Telegram')]/following::p[1]");
        // const teacherLink = this.page.locator("//form[2]//p[contains(text(), 'Лінк')]/following::p[1]");

        // const map = [
        //     { label: "Прізвище", form: 1, key: "lastName" },
        //     { label: "Ім’я", form: 1, key: "firstName" },
        //     { label: "По батькові", form: 1, key: "surname" },
        //     { label: "Дата народження", form: 1, key: "date" },
        //     { label: "Стать", form: 1, key: "gender", transform: (val: number) => val === 1 ? "Чоловіча" : "Жіноча" },
        //     { label: "E-mail", form: 2, key: "email" },
        //     { label: "Телефон", form: 2, key: "phone" },
        //     { label: "Telegram", form: 2, key: "telegram" },
        //     { label: "Лінк", form: 2, key: "link" }
        // ];

        // let isMatched = true;
        // for (const {label, form, key, transform} of map) {
        //     const locator = this.page.locator(`//form[${form}]//p[contains(text(), '${label}')]/following::p[1]`);
        //     await locator.waitFor({ state: "visible", timeout: 10000 });
        //     const text = await locator.innerText();
        //     const expectedVal = transform ? transform(user[key]) : user[key];
        //     if (text !== expectedVal) {
        //         console.error(`Mismatch for ${label}: expected "${expectedVal}", but actual is "${text}"`);
        //         isMatched = false;
        //     }
        //     expect(locator).toHaveText(expectedVal);
        // }
        // return isMatched;
    // }
}