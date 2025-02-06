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
    private teacherProfileImage: Locator;

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
        this.teacherProfileImage = page.locator("img.MuiAvatar-img");
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

    getTeacherImage(): Locator {
        return this.teacherProfileImage;
    }
}