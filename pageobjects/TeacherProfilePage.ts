import { Locator, Page, expect } from "@playwright/test";
import { CreateTeacherData, Gender } from "./TeacherFormPage";

export class TeacherProfilePage {
    private page: Page; 
    public teacherLastname: Locator;
    private teacherFirstname: Locator;
    private teacherSurname: Locator;
    private teacherDate: Locator;
    private teacherGender: Locator;
    private teacherEmail: Locator;
    private teacherPhone: Locator;
    private teacherTelegram: Locator;
    private teacherLink: Locator;
    private teacherProfileImage: Locator;
    private inviteTeacherBtn: Locator;
    private resetPasswordLink: Locator;
    private teachersStudy: Locator;

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
        this.inviteTeacherBtn = page.locator("button:has-text('Відправити інвайт')");
        this.resetPasswordLink = page.locator("[href*='password-reset']");
        this.teachersStudy = page.locator("[href*='teachers/study']");
    }
    
    async waitForTeacherProfilePage(): Promise<void> {
        await this.page.waitForLoadState("domcontentloaded");
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

    async getTeacherImageSrc(): Promise<string> {
        const teacherImage = await this.getTeacherImage();
        const imageSrc = await teacherImage.getAttribute("src");
        return imageSrc || "";
    }

    async getTeacherImageGender(teacher: CreateTeacherData): Promise<string> {
        const expectedFileName = teacher.gender === Gender.Male ? "male-img.jpg" : "female-img.jpg";
        return expectedFileName;
    }

    async clickSendInvite(): Promise<void> {
        await this.inviteTeacherBtn.click();
        await this.page.waitForSelector("[href*='password-reset']");
    }

    async getResetPassUrl(): Promise<string> {
        return await this.resetPasswordLink.getAttribute("href") || "";
    }
    
    async handleResetPassInNewTab(): Promise<Page> {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent("page"),
            this.resetPasswordLink.click()
        ]);
        await newPage.waitForLoadState("domcontentloaded");
        return newPage;
    }

    async navigateToTeachersStudy(): Promise<void> {
        await this.teachersStudy.click();
    }
}