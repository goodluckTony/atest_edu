import { Locator, Page } from "@playwright/test";
import path from "path";
import { ApiHelper } from "./utils/ApiHelper";

export class TeacherFormPage {
    private page: Page;
    private apiHelper: ApiHelper;
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
    
    public teacherId: number;

    constructor (page: Page, apiHelper: ApiHelper) {
        this.page = page;
        this.apiHelper = apiHelper;
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

    async fillTeacherForm(teacher: CreateTeacherData): Promise<void> {
        await this.lastNameInput.fill(teacher.lastName);
        await this.firstNameInput.fill(teacher.firstName);
        await this.surnameInput.fill(teacher.surname);
        await this.birthdayInput.fill(teacher.date);
        await this.subjectDropdown.click();
        await this.page.locator(`li:has-text('${teacher.subject}')`).click();
        await this.page.locator(`span input[value='${teacher.gender}']`).click();
        await this.emailInput.fill(teacher.email);
        await this.phoneInput.fill(teacher.phone);
        await this.telegramInput.fill(teacher.telegram);
        await this.linkInput.fill(teacher.link);
        await this.uploadTeacherImage(teacher.gender);
        await this.page.waitForLoadState("networkidle");
        // await this.page.pause();
    }

    async uploadTeacherImage(gender: Gender): Promise<void> {
        const imagePath = gender === Gender.Male
            ? path.resolve("assets/male-img.jpg")
            : path.resolve("assets/female-img.jpg");

        await this.fileUploadInput.setInputFiles(imagePath);
    }

    async submitForm(): Promise<number> {
        await this.page.waitForLoadState("networkidle");
        await this.submitButton.click();
        await this.page.waitForLoadState("networkidle");

        // Wait for api response and turn the captured teacherId
        this.teacherId = await this.apiHelper.getCreatedTeacherId(this.page) ?? 0;
        console.log(`Teacher created wtih ID: ${this.teacherId}`);
        return this.teacherId;
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