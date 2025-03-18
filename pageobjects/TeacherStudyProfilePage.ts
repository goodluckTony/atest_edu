import { Locator, Page, expect } from "@playwright/test";
import { CreateTeacherData, Gender } from "./TeacherFormPage";

export class TeacherStudyProfilePage {
    private page: Page; 
    public teacherLevel: Locator;
    private lessonsCount: Locator;
    private individualPayment: Locator;


    constructor(page: Page) {
        this.page = page;
        this.teacherLevel = page.locator("//p[contains(text(), 'Рівень')]/following-sibling::p");
        this.lessonsCount = page.locator("//p[contains(text(), 'Кількість проведених занять')]/following-sibling::p");
        this.individualPayment = page.locator("//p[contains(text(), 'Оплата за індивідуальні')]/following-sibling::p");
    }
    
    async waitForTeacherProfilePage(): Promise<void> {
        await this.page.waitForLoadState("domcontentloaded");
    }

    getTeacherLevel(): Locator {
       return this.teacherLevel;
    }
    
    getLessonsCount(): Locator {
        return this.lessonsCount;
    }

    getIndividualPayment(): Locator {
        return this.individualPayment;
    }
}