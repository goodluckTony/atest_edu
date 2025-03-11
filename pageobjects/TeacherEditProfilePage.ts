import { Locator, Page } from '@playwright/test';

export class TeacherEditProfilePage {
  private page: Page;
  private teacherEditBtn: Locator;
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
  private saveChangesButton: Locator;


  constructor(page: Page) {
    this.page = page;
    this.teacherEditBtn = page.locator("button:has-text('Редагувати')");
    this.lastNameInput = page.locator("[name='lastName']");
    this.firstNameInput = page.locator("[name='firstName']");
    this.surnameInput = page.locator("[name='surname']");
    this.birthdayInput = page.locator("[placeholder='DD.MM.YYYY']");
    this.subjectDropdown = page.locator("[role='combobox']");
    this.genderButton = page.locator("span input[value]");
    this.emailInput = page.locator("[name='email']");
    this.phoneInput = page.locator("[name='phone']");
    this.telegramInput = page.locator("[name='telegram']");
    this.linkInput = page.locator("[name='link']");
    this.saveChangesButton = page.locator("button:has-text('Зберегти')");

  }
  
  async editTeacherProfile(newTeacher: EditTeacherData): Promise<void> {
    await this.teacherEditBtn.click();
    await this.page.waitForLoadState("networkidle");

    await this.lastNameInput.fill(newTeacher.lastName);
    await this.firstNameInput.fill(newTeacher.firstName);
    await this.surnameInput.fill(newTeacher.surname);
    await this.birthdayInput.fill(newTeacher.date);
    await this.editTeacherGender();
    await this.emailInput.fill(newTeacher.email);
    await this.phoneInput.fill(newTeacher.phone);
    await this.telegramInput.fill(newTeacher.telegram);
    await this.linkInput.fill(newTeacher.link);
    await this.saveChangesButton.click();
  }
  
  async editTeacherGender(): Promise<void> {
    const femaleLabel = this.page.locator("label:has-text('Жіноча')");
    const maleLabel = this.page.locator("label:has-text('Чоловіча')");
  
    (await femaleLabel.locator("span.Mui-checked").count() > 0) 
      ? await maleLabel.click() 
      : await femaleLabel.click();
  }

  getSaveChangesButton(): Locator {
    return this.saveChangesButton;
  }
}

export interface EditTeacherData {
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