import { Locator, Page, expect } from "@playwright/test";

export class StudentProfilePage {
    private page: Page; 
    private studentLastname: Locator;
    private studentFirstname: Locator;
    private studentSurname: Locator;
    private studentDate: Locator;
    private studentPhone: Locator;
    private studentEmail: Locator;
    private studentTelegram: Locator;
    private studentProfileImage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.studentProfileImage = page.locator("img.MuiAvatar-img");
        this.studentLastname = page.locator("//form[1]//p[contains(text(), 'Прізвище')]/following::p[1]");
        this.studentFirstname = page.locator("//form[1]//p[contains(text(), 'Ім’я')]/following::p[1]");
        this.studentSurname = page.locator("//form[1]//p[contains(text(), 'По батькові')]/following::p[1]");
        this.studentDate = page.locator("//form[1]//p[contains(text(), 'Дата народження')]/following::p[1]");
        this.studentPhone = page.locator("//form[1]//p[contains(text(), 'Телефон')]/following::p[1]");
        this.studentEmail = page.locator("//form[1]//p[contains(text(), 'E-mail')]/following::p[1]");
        this.studentTelegram = page.locator("//form[1]//p[contains(text(), 'Telegram')]/following::p[1]");
    }

    getStudentImage(): Locator {
        return this.studentProfileImage;
    }

    getStudentLastName(): Locator {
       return this.studentLastname;
    }
    
    getStudentFirstName(): Locator {
        return this.studentFirstname;
    }

    getStudentSurname(): Locator {
        return this.studentSurname;
    }

    getStudentDate(): Locator {
        return this.studentDate;
    }
    
    getStudentPhone(): Locator {
        return this.studentPhone;
    }

    getStudentEmail(): Locator {
        return this.studentEmail;
    }

    getStudentTelegram(): Locator {
        return this.studentTelegram;
    }
}