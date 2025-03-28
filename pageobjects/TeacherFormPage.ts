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
    public teacherId: number;

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
        this.listenForCreateTeacherResponse();
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
    }

    async uploadTeacherImage(gender: Gender): Promise<void> {
        const imagePath = gender === Gender.Male
            ? path.resolve("assets/male-img.jpg")
            : path.resolve("assets/female-img.jpg");

        await this.fileUploadInput.setInputFiles(imagePath);
    }

    async submitForm(): Promise<void> {
        await this.submitButton.click();
        await this.page.waitForLoadState("networkidle");
    }

    listenForCreateTeacherResponse(): void {
        this.page.on('response', async (response) => {
            if (response.url().includes('/graphql') && response.status() === 200) {
                const request = response.request(); 
                // Get request body
                const postData = request.postData(); 
                if (!postData) return;
                // Parse GraphQL request body
                const requestBody = JSON.parse(postData); 
                if (requestBody.query.includes('mutation createTeacher')) {
                    const resJson = await response.json();
                    
                    // Extract userId if present
                    if (resJson.data?.createTeacher) {
                        console.log('Captured User ID:', resJson.data.createTeacher.id);
                        this.teacherId = +resJson.data.createTeacher.id
                    }
                }
            }
        });
    }
}

export enum Gender {
    Male = 1,
    Female = 2
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