import { Locator, Page } from "@playwright/test";
import path from "path";

export class TeacherFormPage {
    private page: Page;
    private fileUploadInput: Locator;
    private lastNameInput: Locator;
    private firstNameInput: Locator;
    private surnameInput: Locator;
    private birthdayInput: Locator;
    private subjectDropdown: Locator;
    private genderButton: Locator;
    private emailInput: Locator;
    private phoneInput: Locator;
    private telegramInput: Locator;
    private linkInput: Locator;
    private submitButton: Locator;

    constructor (page: Page) {
        this.page = page;
        this.fileUploadInput = page.locator("input[type='file']");
        this.lastNameInput = page.locator("[name='lastName']");
        this.firstNameInput = page.locator("[name='firstName']");
        this.surnameInput = page.locator("[name='surname']");
        this.birthdayInput = page.locator("[name='birthday']");
        this.subjectDropdown = page.locator("[role='combobox']");
        this.genderButton = page.locator("span input[value]");
        this.emailInput = page.locator("[name='email']");
        this.phoneInput = page.locator("[name='phone']");
        this.telegramInput = page.locator("[name='telegram']");
        this.linkInput = page.locator("[name='link']");
        this.submitButton = page.locator("button[type='submit']");
    }

    async fillTeacherForm(user: CreateTeacherData): Promise<void> {
        await this.lastNameInput.fill(user.lastName);
        await this.firstNameInput.fill(user.firstName);
        await this.surnameInput.fill(user.surname);
        await this.birthdayInput.fill(user.date);
        await this.subjectDropdown.click();
        await this.page.locator(`li:has-text('${user.subject}')`).click();
        await this.page.locator(`span input[value='${user.gender}']`).click();
        await this.emailInput.fill(user.email);
        await this.phoneInput.fill(user.phone);
        await this.telegramInput.fill(user.telegram);
        await this.linkInput.fill(user.link);
        await this.uploadTeacherImage(user.gender);
        await this.page.waitForLoadState("networkidle");
    }

    async uploadTeacherImage(gender: Gender): Promise<void> {
        const imagePath = gender === Gender.Male
            ? path.resolve("assets/male-img.jpg")
            : path.resolve("assets/female-img.jpg");

        await this.fileUploadInput.setInputFiles(imagePath);
    }

    async submitForm(): Promise<void> {
        await this.page.waitForLoadState("networkidle");
        await this.submitButton.click();
        await this.page.waitForLoadState("networkidle");   
    }
}

export interface CreateTeacherData {
    lastName: string;
    firstName: string;
    surname: string;
    date: string;
    subject: "Математика" | "Англійська";
    gender: Gender;
    email: string;
    phone: string;
    telegram: string;
    link: string;
}

export enum Gender {
    Male = 1,
    Female = 2
}