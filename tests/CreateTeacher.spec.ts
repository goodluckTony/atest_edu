import { test, expect, request } from '@playwright/test';
import fs from 'fs/promises';
import { LoginPage } from '../pageobjects/LoginPage';
import { AdminPanelUsersPage } from '../pageobjects/AdminPanelUsersPage';
import { TeacherListPage } from '../pageobjects/TeacherListPage';
import { Gender, TeacherFormPage, CreateTeacherData } from '../pageobjects/TeacherFormPage';
import { TeacherProfilePage } from '../pageobjects/TeacherProfilePage';
import { AdminCredentials } from '../pageobjects/utils/AdminCredentials';
import { UserDataGenerator } from '../pageobjects/utils/UserDataGenerator';
import { ApiHelper } from "../pageobjects/utils/ApiHelper";
import { config } from '../config';

test.describe('Teacher creation', () => {
  let loginPage: LoginPage;
  let adminPanelUsersPage: AdminPanelUsersPage;
  let teacherListPage: TeacherListPage;
  let teacherFormPage: TeacherFormPage;
  let teacherProfilePage: TeacherProfilePage;
  let teacher;
  let apiHelper: ApiHelper;
  let userId: number;
  let mainCred: {email: string, pass: string}

  test.beforeEach(async ({ page, request }) => {
    console.log('BASE_URL:', process.env.BASE_URL);
    console.log('API_URL:', process.env.API_URL);
    console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
    console.log('ADMIN_PASS:', process.env.ADMIN_PASS);

    mainCred = AdminCredentials.admin;

    console.log('Preparing Admin Credentials:', mainCred);

    loginPage = new LoginPage(page);
    adminPanelUsersPage = new AdminPanelUsersPage(page);
    teacherListPage = new TeacherListPage(page);
    teacherFormPage = new TeacherFormPage(page);
    teacherProfilePage = new TeacherProfilePage(page);
    teacher = UserDataGenerator.generateTeacher();
    apiHelper = await ApiHelper.create(request, config.apiUrl!, mainCred.email, mainCred.pass);
  });

  test('Should create teacher', async ({ page }) => {

    // Login
    await loginPage.open()
    await loginPage.login(mainCred.email, mainCred.pass);

    // Navigate to teacher form
    await adminPanelUsersPage.navigateToTeachersList();
    await teacherListPage.addNewTeacherBtnClick();

    // Fill teacher form
    await teacherFormPage.fillTeacherForm(teacher);
    await teacherFormPage.submitForm();

    // Search teacher and verify details
    await teacherListPage.searchTeacherByEmail(teacher.email, teacher.subject);
    await expect(teacherProfilePage.getTeacherLastName()).toHaveText(teacher.lastName);
    await expect(teacherProfilePage.getTeacherFirstName()).toHaveText(teacher.firstName);
    await expect(teacherProfilePage.getTeacherSurname()).toHaveText(teacher.surname);
    await expect(teacherProfilePage.getTeacherDate()).toHaveText(teacher.date);
    await expect(teacherProfilePage.getTeacherGender()).toHaveText(teacher.gender === Gender.Male ? "Чоловіча" : "Жіноча");
    await expect(teacherProfilePage.getTeacherEmail()).toHaveText(teacher.email);
    await expect(teacherProfilePage.getTeacherPhone()).toHaveText(teacher.phone);
    await expect(teacherProfilePage.getTeacherTelegram()).toHaveText(teacher.telegram);
    // expect(true).toBe(false)
    await expect(teacherProfilePage.getTeacherLink()).toHaveText(teacher.link);
    const imageSrc = await teacherProfilePage.getTeacherImageSrc();
    const expectedImageFileName = await teacherProfilePage.getTeacherImageGender(teacher);
    await expect(imageSrc).toContain(expectedImageFileName);
  });

  test.afterEach(async ({page}) => {
    userId = teacherFormPage.teacherId;

    // DELETE created teacher via API
    console.log(`Attempting to delete user. ID: ${userId}`);
    if(userId) {
      await apiHelper.deleteUser(userId);
      console.log(`Teacher with ID ${userId} deleted successfully.`)
    } else {
      console.warn('User ID is missing. Skipping deletion.');
    }
  });
});