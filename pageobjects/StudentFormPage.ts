import { Locator, Page } from "@playwright/test"; 
import path from "path";

export class StudentFormPage {
    private page: Page;
    private studentLastName: Locator;
    private studentFirstName: Locator;
    private studentSurname: Locator;
    private studentDate: Locator;
    private studentEmail: Locator;
    private studentPhone: Locator;
    private studentTelegram: Locator;
    private submitBtn: Locator;

    public studentId: number;

    constructor(page: Page) {
        this.page = page;
        this.studentLastName = page.locator("input[name='user.lastName']");
        this.studentFirstName = page.locator("input[name='user.firstName']");
        this.studentSurname = page.locator("input[name='user.surname']");
        this.studentDate = page.locator("input[name='user.birthday']");
        this.studentEmail = page.locator("input[name='user.email']");
        this.studentPhone = page.locator("input[name='user.phone']");
        this.studentTelegram = page.locator("input[name='user.telegram']");
        this.submitBtn = page.locator("button[type='submit']");
        this.listenForCreateStudentResponse();
    }

    async fillStudentForm(student: CreateStudentData): Promise<void> {
        await this.studentLastName.fill(student.lastName);
        await this.studentFirstName.fill(student.firstName);
        await this.studentSurname.fill(student.surname);
        await this.studentDate.fill(student.date);
        await this.studentEmail.fill(student.email);
        await this.studentPhone.fill(student.phone);
        await this.studentTelegram.fill(student.telegram);
        await this.page.waitForLoadState("networkidle");
    }

    async submitForm(): Promise<void> {
        await this.page.waitForLoadState("networkidle");
        await this.submitBtn.click();
        await this.page.waitForLoadState("networkidle");

        await this.page.pause();
    }

    listenForCreateStudentResponse(): void {
        this.page.on('response', async (response) => {
            if (response.url().includes('/graphql') && response.status() === 200) {
                const request = response.request(); 
                const postData = request.postData();

                if (!postData) return;

                const requestBody = JSON.parse(postData);

                if (requestBody.query.includes('mutation createStudent')) {
                    const resJson = await response.json();
                    
                    // Extract userId if present
                    if (resJson.data?.createStudent) {
                        console.log('Captured User ID:', resJson.data.createStudent.id);
                        this.studentId = +resJson.data.createStudent.id
                    }
                }
            }
        });
    }
}

export interface CreateStudentData {
    lastName: string;
    firstName: string;
    surname: string;
    date: string;
    email: string;
    phone: string;
    telegram: string;
}